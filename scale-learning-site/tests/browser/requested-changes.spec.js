import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import {challengeBank} from '../../src/data.js';

test('replacement question resets only old unfinished attempts, grades and preserves retries in standalone',async({page})=>{
 const url=pathToFileURL(process.cwd()+'/../index.html').href;
 await page.goto(url);
 await page.evaluate(()=>{const db=JSON.parse(localStorage.getItem('scale-learning-v4'));delete db.practiceRevision;db.sessions[db.active].attempts={s4:7,s2:2};localStorage.setItem('scale-learning-v4',JSON.stringify(db));});
 await page.goto(url+'#page-4');await page.reload();await page.getByRole('tab').nth(3).click();
 const box=page.locator('[data-question="s4"]');
 await expect(box).toContainText('第 1 次作答');await expect(box.locator('.simple-scale-question')).toBeVisible();
 await box.locator('.options button').filter({has:page.getByText('不正確',{exact:true})}).click();await box.getByRole('button',{name:'檢查答案'}).click();
 await page.reload();await page.getByRole('tab').nth(3).click();await expect(box).toContainText('第 2 次作答');
 await box.locator('.options button').filter({has:page.getByText('正確',{exact:true})}).click();await box.getByRole('button',{name:'檢查答案'}).click();await expect(box.locator('.completed')).toContainText('2 分');
 expect(await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('scale-learning-v4'));return d.sessions[d.active].attempts.s2;})).toBe(2);
 await box.screenshot({path:'test-results/screens/replacement-scale-question.png'});
});

test('all 19 challenge answers advance immediately and last answer saves final score once',async({page})=>{
 await page.goto('/#page-9');await page.getByRole('button',{name:'準備好了，開始'}).click();
 for(let i=0;i<challengeBank.length;i++){
  await expect(page.locator('.game-hud')).toContainText(`${i+1} / ${challengeBank.length}`);
  const prompt=await page.locator('.challenge-question h2').textContent();const q=challengeBank.find(q=>q.prompt===prompt);
  await page.locator('.challenge-arena .options').getByRole('button',{name:q.answer,exact:true}).click();
 }
 await expect(page.getByRole('heading',{name:'本局完成！'})).toBeVisible();
 const record=await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('scale-learning-v4'));return d.sessions[d.active].challenge;});
 expect(record.first).toBeGreaterThan(80000);expect(record.first).toBe(record.best);
 await expect(page.getByRole('button',{name:'讀完解析，下一題'})).toHaveCount(0);
});

test('timeout advances immediately and three timeouts end the challenge',async({page})=>{
 await page.clock.install();await page.goto('/#page-9');await page.getByRole('button',{name:'準備好了，開始'}).click();
 for(let i=0;i<3;i++){
  await page.clock.fastForward(23000);
  if(i<2){await expect(page.locator('.game-hud')).toContainText(`${i+2} / 19`);await expect(page.getByLabel(`剩餘 ${2-i} 次生命`)).toBeVisible();}
 }
 await expect(page.getByRole('heading',{name:'本局完成！'})).toBeVisible();await expect(page.locator('.challenge-score')).toContainText('0');
});
