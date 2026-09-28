import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';

test('standalone index opens through file protocol, loads all 11 pages and images, grades and resumes',async({page})=>{
 const file=pathToFileURL(resolve('..','index.html')).href;
 const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('requestfailed',r=>failed.push(r.url()));
 await page.goto(file);
 for(let n=0;n<11;n++){
   await page.goto(file+'#page-'+n);
   await expect(page.locator('main h1')).toBeVisible();
   const urls=await page.locator('svg image').evaluateAll(items=>[...new Set(items.map(i=>i.getAttribute('href')))]);
   for(const url of urls){
    const loaded=await page.evaluate(url=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img.naturalWidth>0);img.onerror=()=>resolve(false);img.src=url;}),url);
    expect(loaded,'local image '+url).toBe(true);
   }
 }
 await page.goto(file+'#page-2');
 await page.locator('[data-question="o1"] .options').getByRole('button',{name:/複式顯微鏡/}).click();
 await page.getByRole('button',{name:'檢查答案',exact:false}).click();
 await expect(page.locator('[data-question="o1"] .completed')).toContainText('3 分');
 await page.reload();
 await expect(page.locator('[data-question="o1"] .completed')).toContainText('3 分');
 await page.goto(file+'#page-0');
 await page.screenshot({path:'test-results/standalone-home.png',fullPage:true});
 expect(errors).toEqual([]);expect(failed).toEqual([]);
});
