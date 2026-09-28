import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {pages,designFiles,gameCards,challengeBank} from '../src/data.js';
const browser=await chromium.launch({channel:'msedge'}),context=await browser.newContext(),page=await context.newPage();
const base=pathToFileURL(process.cwd()+'/../index.html').href;
const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()+': '+r.failure()?.errorText));
mkdirSync('audit/after',{recursive:true});mkdirSync('audit/mobile',{recursive:true});mkdirSync('audit/tablet',{recursive:true});mkdirSync('audit/interaction',{recursive:true});
for(const [kind,width,height] of [['after',1182,1000],['tablet',820,1180],['mobile',390,844]]){
 await page.setViewportSize({width,height});
 for(let n=0;n<11;n++){
  await page.goto(base+'#page-'+n);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
  const images=await page.locator('svg image').evaluateAll(async images=>Promise.all(images.map(el=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(true);im.onerror=()=>resolve(false);im.src=el.getAttribute('href');}))));
  await page.screenshot({path:`audit/${kind}/${String(n+1).padStart(2,'0')}.png`,fullPage:true});
  const measurement=await page.evaluate(()=>({height:document.documentElement.scrollHeight,width:document.documentElement.scrollWidth,viewport:innerWidth}));
  checks.push({page:n+1,kind,...measurement,imagesLoaded:images.every(Boolean)});
 }
}
await page.setViewportSize({width:1182,height:1000});
await page.goto(base+'#page-2');await page.getByRole('button',{name:'池水與生物',exact:true}).click();await page.getByLabel('觀察尺度',{exact:true}).fill('2');await page.getByRole('button',{name:'拍下來',exact:true}).click();await page.screenshot({path:'audit/interaction/03.png',fullPage:true});
await page.goto(base+'#page-4');await page.getByRole('slider',{name:'量尺垂直位置'}).first().focus();await page.getByRole('slider',{name:'量尺垂直位置'}).first().press('ArrowDown');await page.screenshot({path:'audit/interaction/05.png',fullPage:true});
await page.goto(base+'#page-5');await page.getByRole('tab').nth(3).click();await page.getByRole('button',{name:'玻片往右下',exact:true}).click();await page.getByRole('button',{name:'檢查答案',exact:false}).click();await page.screenshot({path:'audit/interaction/06.png',fullPage:true});
await page.goto(base+'#page-6');await page.getByRole('tab').nth(4).click();await page.screenshot({path:'audit/interaction/07.png',fullPage:true});
await page.goto(base+'#page-7');await page.locator('.number-grid button').nth(5).click();await page.screenshot({path:'audit/interaction/08.png',fullPage:true});
await page.goto(base+'#page-8');await page.getByRole('button',{name:'開始分類',exact:true}).click();const name=await page.locator('.specimen-ticket h2').textContent();const card=gameCards.find(c=>c.name===name);await page.locator('.sorting-bins>button').filter({has:page.getByText(card.answer,{exact:true})}).click();await page.screenshot({path:'audit/interaction/09.png',fullPage:true});
await page.goto(base+'#page-9');await page.getByRole('button',{name:'準備好了，開始'}).click();await page.getByRole('button',{name:'暫停',exact:true}).click();await page.getByRole('button',{name:'繼續挑戰',exact:true}).click();const prompt=await page.locator('.challenge-question h2').textContent();const q=challengeBank.find(q=>q.prompt===prompt);await page.locator('.challenge-arena .options').getByRole('button',{name:q.answer,exact:true}).click();await page.screenshot({path:'audit/interaction/10.png',fullPage:true});
await browser.close();
writeFileSync('audit/checks.json',JSON.stringify({date:new Date().toISOString(),checks,errors},null,2));
if(errors.length||checks.some(c=>c.width>c.viewport||!c.imagesLoaded))throw Error('Audit failed: see audit/checks.json');
const notes=[
 '恢復滿幅蓮葉與細胞放大視覺、橫列身分表單、五張課程圖片卡及探索旅程帶。',
 '恢復左側提問與三個圓形尺度場景、共用滑桿、圖片預測卡、探究三步驟及五主題地圖。',
 '恢復工具卡與右側三個探索分頁、連續觀察圖、拍照紀錄、點陣比較及圖片選項。',
 '恢復八種物體尺度帶、尺度滑桿、換算工作臺、兩張綠豆觀察照片及圖像配對題。',
 '恢復蜂鳥與手指參照、顯微圖與三步推理雙欄、拖曳量尺及蝸牛反推比例尺。',
 '恢復製片／顯微鏡控制／視野三欄、圖片步驟、觀察筆記及四種生物卡；完整圖鑑展開為 11 種。',
 '恢復蓮葉主視覺、三個案例分頁、照片證據鏈、芒刺與壁虎發明對照及三欄推理題。',
 '恢復顯微鏡主視覺、左右作答與提交側欄、圓形題號、中央圖文題及五概念回顧。',
 '恢復任務卡、四個圖像分類槽、即時回饋與筆記本說明；可選擇起始任務類型。',
 '恢復深色挑戰主視覺、圖文答題雙欄、分數／生命／時間、金色完成結果與雙欄排行榜。',
 '恢復觀察筆記主視覺、四張圖片成績卡、圓形探索足跡、右側回顧與三步觀察方法。'
];
const interactions=new Set([3,5,6,7,8,9,10]);
const cards=pages.map((p,i)=>{const no=String(i+1).padStart(2,'0'),root='scale-learning-site/';return `<section id="p${i+1}"><h2>${no}　${p.name}</h2><p>${notes[i]}</p><div class="compare"><figure><figcaption>原始草圖</figcaption><a href="${root}public/designs/${designFiles[i]}"><img loading="lazy" src="${root}public/designs/${designFiles[i]}" alt="${p.name}草圖"></a></figure><figure><figcaption>修正前網站</figcaption><a href="${root}audit/before/${no}.png"><img loading="lazy" src="${root}audit/before/${no}.png" alt="修正前"></a></figure><figure><figcaption>修正後網站</figcaption><a href="${root}audit/after/${no}.png"><img loading="lazy" src="${root}audit/after/${no}.png" alt="修正後"></a></figure></div><div class="links"><a href="index.html#page-${i}">開啟這一頁操作</a><a href="${root}audit/mobile/${no}.png">手機截圖</a><a href="${root}audit/tablet/${no}.png">平板截圖</a>${interactions.has(i+1)?`<a href="${root}audit/interaction/${no}.png">互動狀態截圖</a>`:''}</div></section>`;}).join('');
writeFileSync('../草圖與網站_11頁逐頁對照.html',`<!doctype html><html lang="zh-Hant"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>尺度探索站｜11 頁草圖與網站對照</title><style>*{box-sizing:border-box}body{margin:0;background:#f3f5ee;color:#133549;font:16px/1.7 'Microsoft JhengHei',sans-serif}header,main{max-width:1600px;margin:auto;padding:24px}h1{font-size:30px}header p{max-width:1000px}nav{display:flex;flex-wrap:wrap;gap:10px}a{color:#087d87;text-underline-offset:4px}nav a,.links a{background:white;border:1px solid #cdded7;border-radius:7px;padding:7px 12px}section{background:white;border:1px solid #dfe7dc;border-radius:12px;padding:20px;margin:24px 0}h2{margin:0;font-size:24px}.compare{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}figure{margin:0;background:#edf2ef;border:1px solid #d8e3dd}figcaption{font-weight:bold;text-align:center;padding:9px;position:sticky;top:0;background:#e5f0e9}img{width:100%;height:auto;display:block}.links{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}.note{background:#e5efe9;padding:16px;border-radius:8px}@media(max-width:700px){header,main{padding:14px}h1{font-size:25px}.compare{gap:6px}figcaption{font-size:11px;padding:6px 2px}section{padding:12px}h2{font-size:20px}.links a{font-size:12px}}</style><header><h1>尺度探索站｜11 頁草圖與網站逐頁對照</h1><p>左：原始設計稿。中：此次修正前的網站。右：此次修正後的網站。三者皆可點圖放大。網站截圖寬度為 1182 px；另附 820 px 平板與 390 px 手機截圖。</p><p class="note">草圖有預填示例答案與成績；網站保留學生真實進度，未作答時顯示空白或 0。第四階段仍全頁開放；頁面長度依文字、操作說明及完整題目調整。圖片是設計示意，比例尺量測線段另以可驗證的 SVG 幾何實作。</p><nav>${pages.map((p,i)=>`<a href="#p${i+1}">${i+1} ${p.short}</a>`).join('')}</nav></header><main>${cards}</main></html>`,'utf8');
console.log(JSON.stringify({screenshots:33,interactionScreenshots:7,errors,comparison:'草圖與網站_11頁逐頁對照.html'},null,2));
