import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
fs.mkdirSync('screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();
const page=await context.newPage();const errors=[];const ga=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('request',r=>{if(/googletagmanager|google-analytics/.test(r.url()))ga.push(r.url())});
await page.goto('http://127.0.0.1:4173/');
await page.getByRole('button',{name:'Allow analytics'}).click();
await page.evaluate(()=>document.fonts.ready);
await page.locator('.portrait img').evaluate(img=>img.decode());
assert.equal(await page.locator('.portrait img').evaluate(img=>img.naturalWidth>0),true);
assert.equal(await page.locator('.hero-actions .primary').getAttribute('href'),'https://t.me/asagammi');
const cv='https://drive.google.com/file/d/1Et5YJrfyejLJv9SDHO4D8a9ytE0hRmtC/view?usp=sharing';assert.equal(await page.locator(`a[href="${cv}"]`).count(),2);
for(const [name,url] of Object.entries({github:'https://github.com/asagammi',linkedin:'https://www.linkedin.com/in/nazarii-mudryk/',telegram:'https://t.me/asagammi',instagram:'https://www.instagram.com/nazar_mudrykk'}))assert.equal(await page.locator(`.social.${name}`).getAttribute('href'),url);
assert.equal(await page.locator('a[href^="https:"],a[href^="mailto:"]').evaluateAll(links=>links.every(a=>a.target==='_blank'&&a.rel==='noopener noreferrer')),true);
for(const [width,height] of [[320,812],[375,812],[390,844],[768,1024],[1440,900]]){
 await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1100);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
 assert.deepEqual(await page.locator('a:not(.skip-link),button').evaluateAll(els=>els.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent)),[]);
 if(width===390){await page.screenshot({path:'screenshots/mobile-hero-390x844.png'});await page.locator('#connect').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:'screenshots/mobile-social-390x844.png'});}
 if(width===1440)await page.screenshot({path:'screenshots/desktop-1440x900.png'});
}
await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.hero').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await page.locator('.capability').first().evaluate(e=>getComputedStyle(e).animationName),'none');
await page.goto('about:blank');await page.goto('http://127.0.0.1:4173/');await page.keyboard.press('Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);
const reached=new Set();for(let i=0;i<22;i++){await page.keyboard.press('Tab');const info=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent,outline:getComputedStyle(document.activeElement).outlineStyle}));if(info.tag==='A'||info.tag==='BUTTON'){assert.notEqual(info.outline,'none');reached.add(info.text)}}
assert([...reached].some(x=>x.includes('Let’s talk')));assert([...reached].some(x=>x.includes('Analytics preferences')));
assert.equal(ga.length,0);assert.deepEqual(errors,[]);
// Offline after load: the bundled local avatar remains available; cold reload requires a web server.
await context.setOffline(true);assert(await page.locator('.portrait img').evaluate(img=>img.complete&&img.naturalWidth>0));await context.setOffline(false);
// Block the local asset to exercise a genuine image failure.
await page.route('**/assets/nazarii-mudryk.webp',r=>r.abort());await page.route('**/assets/nm-avatar.svg',r=>r.abort());await page.reload();await page.locator('.portrait-fallback').waitFor();assert.equal(await page.locator('.portrait-fallback').innerText(),'NM');
console.log('PASS production: five widths, local asset, fallback, offline retention, all URLs, new tabs, touch targets, keyboard focus, reduced motion, absent GA ID. Three screenshots saved.');
await browser.close();

