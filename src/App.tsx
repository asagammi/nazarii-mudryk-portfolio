import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { ArrowUpRight, ArrowRight, FileText, Mail, MapPin, Bot, Layers3, Database, ScanLine, Cpu, Globe2, Command, X } from 'lucide-react'
import { siGithub, siTelegram, siInstagram, siFacebook, siUpwork } from 'simple-icons'
import { LanguageContext, initialLanguage, useT } from './i18n'
import type { Language, TranslationKey } from './i18n'
import { profile } from './config'
import { getConsent, setConsent, track } from './analytics'
type Platform = keyof typeof profile.links
function Brand({ name }: { name: Platform }) {
  const icon = { github: siGithub, telegram: siTelegram, instagram: siInstagram, facebook: siFacebook, upwork: siUpwork }[name as 'github' | 'telegram' | 'instagram' | 'facebook' | 'upwork']
  if (icon) return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={icon.path}/></svg>
  if (name === 'linkedin') return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.75H4.98V9.2h2.95v9.55ZM6.45 7.9a1.71 1.71 0 1 1 0-3.42 1.71 1.71 0 0 1 0 3.42Zm12.3 10.85H15.8V14.1c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.73H9.51V9.2h2.83v1.31h.04c.4-.75 1.36-1.55 2.79-1.55 2.98 0 3.58 1.96 3.58 4.51v5.28Z"/></svg>
  return name === 'cv' ? <FileText aria-hidden="true"/> : <Mail aria-hidden="true"/>
}
function Link({ platform, children, className = '', contact = false }: { platform: Platform; children: ReactNode; className?: string; contact?: boolean }) {
  const t = useT()
  return <a href={profile.links[platform]} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${platform === 'cv' ? t('View CV') : platform === 'email' ? t('Email Nazarii Mudryk') : `${t('Visit')} ${platform}`} ${t('(opens in new tab)')}`} onClick={() => {
    const params = { platform, destination: profile.links[platform] }
    track(platform === 'cv' ? 'cv_open' : platform === 'email' ? 'email_click' : 'social_click', params)
    if (platform === 'facebook') track('facebook_click', params)
    if (platform === 'upwork') track('upwork_click', params)
    if (contact) track('contact_click', params)
  }}>{children}</a>
}
const capabilities = [
  { icon: Bot, title: 'AI Agents &', next: 'Business Automation', text: 'Agents, integrations and workflows for repetitive business operations.', tags: 'AGENTS / LLMS / WORKFLOWS', featured: true },
  { icon: Layers3, title: 'Full-Stack', next: 'Web Products', text: 'From product interface to backend architecture and deployment.', tags: 'REACT / NEXT.JS / TYPESCRIPT' },
  { icon: Database, title: 'Backend APIs', next: '& Databases', text: 'FastAPI services, secure APIs and reliable data layers.', tags: 'FASTAPI / POSTGRESQL / REDIS' },
  { icon: Globe2, title: 'Browser Automation', next: '& Scraping', text: 'Structured data collection and browser-driven workflows.', tags: 'PYTHON / BROWSER AUTOMATION' },
  { icon: ScanLine, title: 'Computer Vision', next: '& AI Media', text: 'Vision pipelines and AI-powered media processing.', tags: 'VISION / IMAGE PROCESSING' },
  { icon: Cpu, title: 'IoT &', next: 'Microcontrollers', text: 'Connected prototypes with Raspberry Pi, ESP32 and Arduino.', tags: 'RASPBERRY PI / ESP32 / ARDUINO' },
]
function Hero() {
  const t = useT()
  const [failed, setFailed] = useState(0)
  return <section className="hero" aria-labelledby="hero-title"><div className="portrait-line"><div className="portrait">{failed < 2 ? <img src={failed === 0 ? profile.avatar : profile.avatarFallback} alt={t(failed === 0 ? 'Portrait of Nazarii Mudryk' : 'Nazarii Mudryk — NM monogram')} width="66" height="66" decoding="async" onError={() => setFailed(value => value + 1)}/> : <span className="portrait-fallback" role="img" aria-label={t("Nazarii Mudryk — NM monogram")}>NM</span>}<i/></div><span className="location"><MapPin size={14} aria-hidden="true"/>{' '}{t("Lviv, Ukraine")}<br/><span>{t("Remote worldwide.")}</span></span></div><div className="availability"><span/>{' '}{t("Open to remote opportunities")}</div><h1 id="hero-title">{t("Nazarii")}<br/>{t("Mudryk")}<span className="period">.</span></h1><h2>{t('AI Automation & Full-Stack Developer')}</h2><p className="intro">{t("I build AI agents, web products, Telegram bots and automation systems that turn repetitive business processes into reliable software.")}</p><div className="hero-actions"><Link platform="telegram" contact className="button primary">{t("Let’s talk")}{' '}<ArrowUpRight size={19}/></Link><Link platform="cv" className="button secondary"><FileText size={17}/>{' '}{t("View CV")}</Link></div><div className="hero-note"><span className="tiny-line"/>{' '}{t("From complex processes to clean solutions.")}</div><div className="hero-index"><span>{t("2.5+ YEARS BUILDING SOFTWARE")}</span><Command size={28} strokeWidth={1}/></div></section>
}
function Capabilities() {
  const t = useT()
  return <section id="expertise" className="expertise" aria-labelledby="build-title"><div className="section-label"><h2 id="build-title">{t("WHAT I BUILD")}</h2><span>{t("01 — EXPERTISE")}</span></div><div className="capability-grid">{capabilities.map(({ icon: Icon, title, next, text, tags, featured }, i) => <article key={title} className={`capability ${featured ? 'featured' : ''}`} style={{ animationDelay: `${100 + i * 65}ms` }}><div className="card-top"><Icon size={25} strokeWidth={1.5} aria-hidden="true"/><span>0{i + 1}</span></div><h3>{t(`${title} ${next}` as TranslationKey)}</h3><p>{t(text as TranslationKey)}</p><div className="card-tags">{t(tags as TranslationKey)}</div></article>)}</div></section>
}
const socials: { platform: Platform; label: string; text: string }[] = [ { platform: 'github', label: 'GitHub', text: 'Explore the code' }, { platform: 'linkedin', label: 'LinkedIn', text: 'The professional side' }, { platform: 'telegram', label: 'Telegram', text: 'Start a conversation' }, { platform: 'instagram', label: 'Instagram', text: 'Beyond the keyboard' }, { platform: 'facebook', label: 'Facebook', text: 'Personal profile' }, { platform: 'upwork', label: 'Upwork', text: 'Freelance profile' } ]
function Connections() {
  const t = useT()
  return <section id="connect" className="connections" aria-labelledby="connect-title"><div className="section-label"><h2 id="connect-title">{t("FIND ME ONLINE")}</h2><span>{t("02 — CONNECT")}</span></div><div className="social-grid">{socials.map(s => <Link key={s.platform} platform={s.platform} contact={s.platform === 'telegram'} className={`social ${s.platform}`}><Brand name={s.platform}/><div><h3>{s.label}</h3><p>{t(s.text as TranslationKey)}</p></div><ArrowUpRight className="out-arrow" size={18}/></Link>)}</div></section>
}
function Stack() {
  const t = useT()
  const groups = [ ['Development', 'Python', 'FastAPI', 'Next.js', 'React', 'TypeScript'], ['Infrastructure', 'PostgreSQL', 'Redis', 'Docker'], ['Automation & AI', 'AI Agents', 'LLMs', 'Browser Automation', 'Web Scraping', 'Telegram Bots', 'Computer Vision'], ['Hardware', 'Raspberry Pi', 'ESP32', 'Arduino'] ]
  return <section id="stack" className="stack" aria-labelledby="stack-title"><div className="stack-heading"><span className="eyebrow">{t("03 — TOOLKIT")}</span><h2 id="stack-title">{t("The right tools.")}<br/><span>{t("Real-world solutions.")}</span></h2></div><div className="stack-groups">{groups.map(([title, ...items]) => <div className="stack-row" key={title}><h3>{t(title as TranslationKey)}</h3><div>{items.map(item => <span key={item}>{(['AI Agents', 'Browser Automation', 'Web Scraping', 'Telegram Bots', 'Computer Vision'].includes(item) ? t(item as TranslationKey) : item)}</span>)}</div></div>)}</div></section>
}
function Consent({ close }: { close: () => void }) {
  const t = useT()
  const choose = (value: 'accepted' | 'declined') => { setConsent(value); close() }
  return <aside className="consent" role="region" aria-label={t("Analytics preferences")}><div><h2>{t("A little insight. Your choice.")}</h2><p>{t("With your permission, Google Analytics helps me understand site visits. Essential preferences stay on your device.")}</p></div><div className="consent-actions"><button onClick={() => choose('declined')}>{t("Decline")}</button><button className="accept" onClick={() => choose('accepted')}>{t("Allow analytics")}</button>{getConsent() && <button aria-label={t("Close analytics preferences")} onClick={close}><X size={18}/></button>}</div></aside>
}
function Page({ language, changeLanguage }: { language: Language; changeLanguage: (value: Language) => void }) {
  const t = useT()
  const [preferences, showPreferences] = useState(getConsent() === null)
  return <><a className="skip-link" href="#main">{t("Skip to content")}</a><div className="page-shell"><header><a className="wordmark" href="#main" aria-label={t("Nazarii Mudryk home")}>nm<span> /</span></a><nav aria-label={t("Main navigation")}><a href="#expertise">{t('Expertise')}</a><a href="#stack">{t("Stack")}</a><a href="#connect">{t("Connect")}{' '}<ArrowUpRight size={13}/></a></nav><div className="language-switch" role="group" aria-label="Language / Мова"><button aria-label="Switch to English" aria-pressed={language === 'en'} onClick={() => changeLanguage('en')}>EN</button><span aria-hidden="true">/</span><button aria-label="Перейти на українську" aria-pressed={language === 'uk'} onClick={() => changeLanguage('uk')}>UA</button></div><span className="header-caption">{t("AI • AUTOMATION • FULL-STACK")}</span></header><main id="main"><div className="main-grid"><Hero/><div className="right-column"><Capabilities/><Connections/></div></div><Stack/><section className="closing" aria-labelledby="closing-title"><div><span className="eyebrow">{t("HAVE SOMETHING IN MIND?")}</span><h2 id="closing-title">{t("Let’s build something")}<br/><span>{t("that works for you.")}</span></h2></div><div className="closing-actions"><Link platform="cv" className="button primary"><Brand name="cv"/>{' '}{t('Explore my CV')}{' '}<ArrowUpRight size={19}/></Link><Link platform="email" contact className="email-link"><Mail size={17}/>{profile.email}<ArrowRight size={17}/></Link></div><ArrowUpRight className="closing-mark" aria-hidden="true"/></section></main><footer><span>© {new Date().getFullYear()} {t('Nazarii Mudryk')}</span><span className="footer-place">{t("Lviv, Ukraine")}{' '}<span>/</span>{' '}{t("Available worldwide")}</span><button onClick={() => showPreferences(true)}>{t("Analytics preferences")}</button></footer></div>{preferences && <Consent close={() => showPreferences(false)}/>}</>
}


export default function App() {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  useEffect(() => {
    document.documentElement.lang = language
    document.title = language === 'uk' ? 'Назарій Мудрик — AI-автоматизація та Full-Stack розробка' : 'Nazarii Mudryk — AI Automation & Full-Stack Developer'
    try { localStorage.setItem('nm-language', language) } catch { /* Retain the choice in memory. */ }
  }, [language])
  return <LanguageContext.Provider value={language}><Page language={language} changeLanguage={setLanguage}/></LanguageContext.Provider>
}
