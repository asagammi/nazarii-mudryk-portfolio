import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});const page=await browser.newPage();const errors=[];const ga=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('request',r=>{if(/googletagmanager|google-analytics/.test(r.url()))ga.push(r.url())});
await page.goto('http://127.0.0.1:4173/');await page.getByRole('button',{name:'Allow analytics'}).click();await page.evaluate(()=>document.fonts.ready);
assert.equal(await page.locator('html').getAttribute('lang'),'en');
for(const language of ['en','uk']){
 await page.getByRole('button',{name:language==='en'?'Switch to English':'Перейти на українську',exact:true}).click();
 assert.equal(await page.locator('html').getAttribute('lang'),language);await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),language);
 await page.evaluate(()=>document.fonts.ready);await page.locator('.portrait img').evaluate(img=>img.decode());assert(await page.locator('.portrait img').evaluate(img=>img.naturalWidth===320));
 for(const [width,height] of [[320,812],[390,844],[430,932],[1024,900],[1440,900]]){
 await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1100);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow ${language} ${width}`);
 assert.deepEqual(await page.locator('a:not(.skip-link),button').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent)),[]);
 assert.equal(await page.locator('.portrait').evaluate(e=>e.getBoundingClientRect().width),76);
 if(width===390||width===1440)await page.screenshot({path:`screenshots/${language}-${width===390?'mobile-390x844':'desktop-1440x900'}.png`});
 }
 if(language==='uk'){
 for(const selector of ['.hero','.capability-grid','.stack','.closing','footer'])assert(!/I build|Let’s talk|View CV|Explore my CV|Development|Infrastructure|Nazarii|Working|Expertise|Personal profile/.test(await page.locator(selector).innerText()),selector);
 assert.equal(await page.locator('.facebook p').innerText(),'Особистий профіль');
 }
 await page.getByRole('button',{name:language==='en'?'Analytics preferences':'Налаштування аналітики',exact:true}).click();assert(await page.locator('.consent').isVisible());await page.locator('.consent button').first().click();
}
assert.equal(await page.locator('.facebook').getAttribute('href'),'https://www.facebook.com/mudryk.nazar/');
assert(await page.locator('a[href^="https:"],a[href^="mailto:"]').evaluateAll(es=>es.every(e=>e.target==='_blank'&&e.rel==='noopener noreferrer')));
await page.goto('about:blank');await page.goto('http://127.0.0.1:4173/');await page.keyboard.press('Tab');assert(await page.locator('.skip-link').evaluate(e=>e===document.activeElement));
for(let i=0;i<5;i++)await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('aria-label')),'Switch to English');await page.keyboard.press('Enter');assert.equal(await page.locator('html').getAttribute('lang'),'en');await page.keyboard.press('Tab');await page.keyboard.press('Enter');assert.equal(await page.locator('html').getAttribute('lang'),'uk');
await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.hero').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(ga.length,0);assert.deepEqual(errors,[]);
await page.route('**/assets/nazarii-mudryk.webp',r=>r.abort());await page.reload();await page.waitForFunction(()=>document.querySelector('.portrait img')?.src.endsWith('nm-avatar.svg'));await page.locator('.portrait img').evaluate(img=>img.decode());assert(await page.locator('.portrait img').evaluate(img=>img.naturalWidth>0));
await page.route('**/assets/nm-avatar.svg',r=>r.abort());await page.reload();await page.locator('.portrait-fallback').waitFor();assert.equal(await page.locator('.portrait-fallback').innerText(),'NM');
console.log('PASS: EN/UK, persistence, 320/390/430/1024/1440, photo, SVG + text fallback, keyboard language switching, reduced motion, external attributes, no GA without ID, no errors. Four screenshots saved.');await browser.close();
