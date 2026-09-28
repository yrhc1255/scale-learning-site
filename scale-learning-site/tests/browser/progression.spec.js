import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {questions,assessment,gameCards,challengeBank} from '../../src/data.js';

const url=process.env.COURSE_TEST_URL||pathToFileURL(resolve('..','index.html')).href;
const next=page=>page.locator('.page-navigation > .primary');
async function at(page,n){await expect(page.locator('.site')).toHaveClass(new RegExp(`\\bpage-${n}\\b`));}
async function record(page){return page.evaluate(()=>JSON.parse(localStorage.getItem('scale-learning-v4')));}
async function answerPractice(page,q){
 const box=page.locator(`[data-question="${q.id}"]`);
 if(['match','blanks','classify','diagnosis','cer'].includes(q.type))for(let i=0;i<q.answer.length;i++)await box.locator('select').nth(i).selectOption(q.answer[i]);
 else if(q.type==='order')for(const a of q.answer)await box.locator('.step-pool').getByRole('button',{name:a,exact:false}).click();
 else if(q.type==='multi')for(const a of q.answer)await box.getByRole('button',{name:a,exact:false}).click();
 else if(q.type==='number')await box.getByRole('textbox',{name:'填入答案'}).fill(String(q.answer));
 else if(q.type==='hotspot')await box.getByRole('button',{name:new RegExp(q.options.find(o=>o[0]===q.answer)[1])}).click();
 else if(q.type==='direction')await box.getByRole('button',{name:'玻片往'+q.answer,exact:true}).click();
 else await box.locator('.options button').filter({has:page.getByText(q.answer,{exact:true})}).click();
 await box.getByRole('button',{name:'檢查答案',exact:false}).click();
 await expect(box.locator('.completed')).toBeVisible();
}
async function answerChallenge(page,correct){
 const prompt=await page.locator('.challenge-question h2').textContent();
 const q=challengeBank.find(q=>q.prompt===prompt);
 await page.locator('.challenge-arena .options').getByRole('button',{name:correct?q.answer:q.options.find(o=>o!==q.answer),exact:true}).click();
}

test('student must finish every page; all routes, refresh, games and saved progress obey locks',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'#page-10');await at(page,0);
 await expect(page.locator('.course-cards button').first()).toBeDisabled();
 await page.getByLabel('班級',{exact:true}).fill('測試班');await page.getByLabel('座號',{exact:true}).fill('01');await page.getByLabel('姓名',{exact:true}).fill('逐頁測試');
 await page.getByRole('button',{name:'開始我的探索'}).click();await at(page,1);await expect(next(page)).toBeDisabled();
 await page.getByRole('button',{name:'課程地圖',exact:true}).click();await expect(page.locator('.map-list button').nth(2)).toBeDisabled();await page.getByRole('button',{name:'關閉視窗'}).click();
 await page.goto(url+'#page-7');await at(page,1);await page.reload();await at(page,1);
 await page.locator('.prediction-cards button').first().click();await page.getByLabel('改變觀察尺度',{exact:true}).fill('100');await page.getByLabel('觀察後，我認為',{exact:true}).selectOption('details');
 await expect(page.locator('.intro-roadmap article')).toHaveCount(5);await expect(page.locator('.intro-roadmap button, .intro-roadmap a, .intro-roadmap [tabindex]')).toHaveCount(0);
 await page.getByRole('button',{name:'記下發現，完成導讀'}).click();await expect(next(page)).toBeEnabled();
 await expect(page.locator('.intro-answer').getByRole('button',{name:'前往觀察尺度'})).toBeEnabled();await page.reload();await at(page,1);
 await page.locator('.intro-answer').getByRole('button',{name:'前往觀察尺度'}).click();await at(page,2);
 for(let n=2;n<=6;n++){
  await expect(next(page)).toBeDisabled();
  for(let i=0;i<questions[n].length;i++){
   await page.getByRole('tab').nth(i).click();
   if(n===2&&i===0){await page.locator('[data-question="o1"] .options').getByRole('button',{name:'肉眼',exact:false}).click();await page.getByRole('button',{name:'檢查答案'}).click();await expect(next(page)).toBeDisabled();await page.getByRole('button',{name:'重新作答',exact:true}).click();}
   await answerPractice(page,questions[n][i]);
   if(i<questions[n].length-1)await expect(next(page)).toBeDisabled();
  }
  await expect(next(page)).toBeEnabled();await page.reload();await at(page,n);await expect(next(page)).toBeEnabled();await next(page).click();await at(page,n+1);
 }
 await expect(next(page)).toBeDisabled();
 for(let i=0;i<assessment.length;i++){
  await page.locator('.number-grid button').nth(i).click();await page.locator('.exam-question .options').getByRole('button',{name:assessment[i].answer,exact:false}).click();
 }
 await expect(next(page)).toBeDisabled();await page.getByRole('button',{name:'提交評量',exact:true}).click();await page.getByRole('button',{name:'確定提交',exact:true}).click();await expect(next(page)).toBeEnabled();await next(page).click();await at(page,8);
 await expect(next(page)).toBeDisabled();await page.getByRole('button',{name:'開始分類'}).click();
 for(let i=0;i<gameCards.length;i++){
  const name=await page.locator('.specimen-ticket h2').textContent();const q=gameCards.find(c=>c.name===name);
  await page.locator('.sorting-bins button').filter({has:page.getByText(q.answer,{exact:true})}).click();await expect(next(page)).toBeDisabled();await page.getByRole('button',{name:i===gameCards.length-1?'查看本局成果':'下一張卡片',exact:false}).click();
 }
 await expect(next(page)).toBeEnabled();await next(page).click();await at(page,9);
 await page.getByRole('button',{name:'準備好了，開始'}).click();for(let i=0;i<3;i++)await answerChallenge(page,false);
 await expect(next(page)).toBeDisabled();await expect(page.getByRole('button',{name:'查看學習成果',exact:true})).toBeDisabled();
 await page.goto(url+'#page-10');await at(page,9);await page.reload();await at(page,9);
 await page.getByRole('button',{name:'準備好了，開始'}).click();for(let i=0;i<challengeBank.length;i++)await answerChallenge(page,true);
 await expect(next(page)).toBeEnabled();await page.getByRole('button',{name:'再挑戰一次',exact:true}).click();for(let i=0;i<3;i++)await answerChallenge(page,false);
 await expect(next(page)).toBeEnabled();await next(page).click();await at(page,10);await page.reload();await at(page,10);
 const db=await record(page);expect(db.sessions[db.active].challenge.maxAnswered).toBe(19);expect(db.sessions[db.active].challenge.first).toBe(0);
 await page.getByRole('button',{name:'尺度探索站首頁',exact:true}).click();await page.getByRole('button',{name:'以相同身分重新學習',exact:true}).click();await page.getByRole('button',{name:'開始新場次',exact:false}).click();await at(page,1);await expect(next(page)).toBeDisabled();
 const restarted=await record(page);expect(restarted.active).not.toBe(db.active);expect(restarted.sessions[db.active]).toEqual(db.sessions[db.active]);
 expect(errors).toEqual([]);
});

test('password unlocks every page only in teacher mode; exit and reload restore student lock',async({page})=>{
 await page.goto(url);const before=await record(page);
 await page.getByRole('button',{name:'教師模式',exact:true}).click();await page.getByLabel('預覽密碼').fill('wrong');await page.getByRole('button',{name:'進入教師預覽'}).click();await expect(page.getByRole('alert')).toContainText('密碼不正確');
 await page.getByLabel('預覽密碼').fill('55688');await page.getByRole('button',{name:'進入教師預覽'}).click();
 for(let n=0;n<11;n++){await page.goto(url+'#page-'+n);await at(page,n);}
 await page.goto(url+'#page-2');await answerPractice(page,questions[2][0]);
 expect(await record(page)).toEqual(before);
 await page.getByRole('button',{name:'離開預覽',exact:true}).click();await at(page,0);expect(await record(page)).toEqual(before);
 await page.getByRole('button',{name:'教師模式',exact:true}).click();await page.getByLabel('預覽密碼').fill('55688');await page.getByRole('button',{name:'進入教師預覽'}).click();await page.goto(url+'#page-10');await at(page,10);await page.reload();await at(page,0);
});

test('old out-of-order records cannot skip unfinished earlier pages and are preserved',async({page})=>{
 await page.goto(url);
 await page.evaluate(()=>{const db=JSON.parse(localStorage.getItem('scale-learning-v4'));const s=db.sessions[db.active];s.identity={classroom:'測試班',seat:'02',name:'舊紀錄測試'};s.solved.o1={points:3,attempt:1};s.challenge={first:0,best:100,answered:3};localStorage.setItem('scale-learning-v4',JSON.stringify(db));});
 await page.reload();await page.goto(url+'#page-10');await at(page,1);
 const db=await record(page);expect(db.sessions[db.active].solved.o1.points).toBe(3);expect(db.sessions[db.active].challenge.best).toBe(100);
});

test('intro completion and static roadmap remain usable at desktop, tablet and phone sizes',async({page})=>{
 for(const width of [1440,768,390]){
  await page.setViewportSize({width,height:1000});await page.goto(url);
  await page.getByRole('button',{name:'教師模式',exact:true}).click();await page.getByLabel('預覽密碼').fill('55688');await page.getByRole('button',{name:'進入教師預覽'}).click();await page.goto(url+'#page-1');
  await page.locator('.prediction-cards button').first().click();await page.getByLabel('改變觀察尺度',{exact:true}).fill('100');await page.getByLabel('觀察後，我認為',{exact:true}).selectOption('details');await page.getByRole('button',{name:'記下發現，完成導讀'}).click();
  await expect(page.locator('.intro-roadmap article')).toHaveCount(5);await expect(page.locator('.intro-roadmap button, .intro-roadmap a')).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.locator('.intro-answer').screenshot({path:`../output/intro-answer-${width}.png`});await page.locator('.intro-roadmap').screenshot({path:`../output/intro-roadmap-${width}.png`});
  await page.locator('.intro-answer').getByRole('button',{name:'前往觀察尺度'}).click();await at(page,2);
  await page.locator('.teacher-button').click();
 }
});
