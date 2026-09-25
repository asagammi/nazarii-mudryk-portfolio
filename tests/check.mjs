import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({channel:'chrome',headless:true});
const page = await browser.newPage();
const errors=[]; page.on('pageerror', e=>errors.push(e.message));
const ga=[]; page.on('request',r=>{if(r.url().includes('googletagmanager'))ga.push(r.url())});
await page.goto('http://127.0.0.1:5173/?utm_source=github&utm_medium=profile&utm_campaign=portfolio');
await page.getByRole('heading',{name:'Nazarii Mudryk.'}).waitFor();
await page.getByRole('button',{name:'Decline',exact:true}).click();
for (const [width,height] of [[320,812],[375,812],[390,844],[768,1024],[1440,1000]]) {
  await page.setViewportSize({width,height});
  await page.waitForTimeout(750);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), `Overflow at ${width}`);
  const small=await page.locator('a:not(.skip-link),button').evaluateAll(els=>els.filter(e=>e.getBoundingClientRect().height<44).map(e=>e.textContent));
  assert.deepEqual(small,[],`Small touch targets ${width}`);
  await page.screenshot({path:`tests/viewport-${width}.png`,fullPage:true});
}
await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();
await page.getByRole('button',{name:'Allow analytics'}).click();
await page.reload();
assert.equal(await page.locator('.consent').count(),0);
assert.equal(ga.length,0,'GA must not load without an ID');
assert.equal(await page.locator('a[target="_blank"]:not([rel="noopener noreferrer"])').count(),0);
await page.emulateMedia({reducedMotion:'reduce'});
assert.equal(await page.locator('.hero').evaluate(e=>getComputedStyle(e).animationName),'none');
assert.deepEqual(errors,[]);
console.log('PASS: 320, 375, 390, 768, 1440; no overflow; 44px targets; consent persistence; no GA without ID; reduced motion; no runtime errors.');
await browser.close();
