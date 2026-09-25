import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5174'],{env:{...process.env,VITE_GA_MEASUREMENT_ID:'G-TEST12345'},stdio:'pipe',windowsHide:true});
try {
 await new Promise((resolve,reject)=>{server.stdout.on('data',d=>{if(d.toString().includes('Local:'))resolve()});server.on('error',reject);setTimeout(()=>reject(new Error('Server timeout')),15000).unref()});
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage(); const requests=[];
 await page.route('https://www.googletagmanager.com/**',r=>{requests.push(r.request().url());return r.fulfill({status:200,contentType:'text/javascript',body:''})});
 await page.goto('http://127.0.0.1:5174/?utm_source=instagram&utm_medium=social&utm_campaign=bio');
 assert.equal(requests.length,0);
 await page.getByRole('button',{name:'Decline',exact:true}).click(); assert.equal(requests.length,0);
 await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();
 await page.getByRole('button',{name:'Allow analytics'}).click();
 await page.waitForFunction(()=>window.dataLayer?.length>=4);
 await page.waitForTimeout(200);assert.equal(requests.length,1);
 // Capture app events while suppressing actual external navigation.
 await page.evaluate(()=>document.addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault()}));
 for (const language of ['en','uk']) {
 await page.getByRole('button',{name:language==='en'?'Switch to English':'Перейти на українську',exact:true}).click();
 for (const selector of ['.social.github','.social.linkedin','.social.telegram','.social.instagram','.social.facebook','.hero-actions .primary','.closing-actions a[href^="mailto:"]','.hero-actions .secondary','.closing-actions .primary']) await page.locator(selector).click();
 }
 await page.getByRole('button',{name:'Switch to English',exact:true}).click();
 const events=await page.evaluate(()=>window.dataLayer.map(a=>Array.from(a)).filter(a=>a[0]==='event'));
 for(const name of ['page_view','social_click','cv_open','email_click','contact_click','facebook_click'])assert(events.some(e=>e[1]===name),`Missing ${name}`);
 assert.equal(events.filter(e=>e[1]==='page_view').length,1);
 assert(events.every(e=>e[2].utm_source==='instagram'));
 assert.equal(events.filter(e=>e[1]==='facebook_click').length,2);
 for(const platform of ['github','linkedin','telegram','instagram','facebook'])assert(events.some(e=>e[1]==='social_click'&&e[2].platform===platform));
 assert.equal(events.filter(e=>e[1]==='cv_open').length,4);
 const social=events.find(e=>e[1]==='social_click');assert.equal(social[2].platform,'github');assert.equal(social[2].destination,'https://github.com/asagammi');
 await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();
 await page.getByRole('button',{name:'Decline',exact:true}).click();
 await page.waitForLoadState(); await page.waitForTimeout(500);
 assert.equal(await page.evaluate(()=>localStorage.getItem('nm-analytics-consent')),'declined');
 assert.equal(requests.length,1);
 console.log('PASS: GA consent gating, all five event types, UTM, destination/platform, one page_view, consent withdrawal. Google network intercepted; no real analytics sent.');
 await browser.close();
} finally {server.kill()}


