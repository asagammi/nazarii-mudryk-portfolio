type Consent = 'accepted' | 'declined'
declare global { interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } }
const id = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
const key = 'nm-analytics-consent'
let active = false
let memory: Consent | null = null
export function getConsent(): Consent | null {
  try { const value = localStorage.getItem(key); return value === 'accepted' || value === 'declined' ? value : memory } catch { return memory }
}
function utm() {
  const params = new URLSearchParams(location.search)
  return Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].flatMap(key => params.has(key) ? [[key, params.get(key)!]] : []))
}
export function track(event: string, params: Record<string, string> = {}) {
  if (active && getConsent() === 'accepted') window.gtag?.('event', event, { ...utm(), ...params, transport_type: 'beacon' })
}
export function initializeAnalytics() {
  if (active || getConsent() !== 'accepted' || !id || !/^G-[A-Z0-9]+$/.test(id)) return
  active = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer!.push(arguments) }
  window.gtag('consent', 'update', { analytics_storage: 'granted' })
  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  script.id = 'nm-ga'
  document.head.appendChild(script)
  track('page_view', { page_location: location.href, page_title: document.title })
}
export function setConsent(value: Consent) {
  memory = value
  try { localStorage.setItem(key, value) } catch { /* Keep the choice in memory when storage is unavailable. */ }
  if (value === 'accepted') initializeAnalytics()
  else if (active) {
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    active = false
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim()
      if (name.startsWith('_ga')) {
        document.cookie = `${name}=; Max-Age=0; path=/`
        const parts = location.hostname.split('.')
        for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join('.')}`
      }
    }
    // Reload discards Google's loaded runtime and stops any subsequent collection.
    location.reload()
  }
}
