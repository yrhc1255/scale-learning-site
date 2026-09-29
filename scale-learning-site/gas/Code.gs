const COURSE_ID='scale-learning-11501';
const COHORT_ID='115-1';
const BOOK_TITLE='尺度探索站_115-1_成績總表';
const SHEET_NAME='學生成績';
const INDEX_NAME='同步索引';
const RANK_STATE_NAME='排行榜管理';
const HEADERS=['更新時間','班級','座號','姓名','學習練習','形成性評量','分類遊戲最近','分類遊戲最高','極限挑戰首次','極限挑戰最高','完成練習題數','完成進度','學習場次','測試資料'];

function doGet(e){if(e&&e.parameter&&e.parameter.action==='leaderboard'){try{return json_(leaderboard_());}catch(error){return json_({ok:false,error:'排行榜暫時無法讀取'});}}let ready=false;try{ready=Boolean(PropertiesService.getScriptProperties().getProperty('SCORE_SHEET_ID'));}catch(_){}return json_({ok:true,courseId:COURSE_ID,cohortId:COHORT_ID,ready:ready,leaderboardVersion:1});}
function doPost(e){try{const data=JSON.parse(e.postData.contents);const result=upsert_(data);result.eventId=data.eventId;return json_(result);}catch(error){return json_({ok:false,error:String(error&&error.message||error)});}}
function setup(){const book=getBook_();getSheet_(book,SHEET_NAME,HEADERS);getSheet_(book,INDEX_NAME,['eventId','studentKey','updatedAt']).hideSheet();return book.getUrl();}

function upsert_(data){
 validate_(data);const lock=LockService.getScriptLock();lock.waitLock(30000);
 try{
  const book=getBook_(),sheet=getSheet_(book,SHEET_NAME,HEADERS),index=getSheet_(book,INDEX_NAME,['eventId','studentKey','updatedAt']);
  const eventIds=index.getLastRow()>1?index.getRange(2,1,index.getLastRow()-1,1).getDisplayValues().flat():[];
  if(eventIds.includes(data.eventId))return {ok:true,duplicate:true};
  const key=[text_(data.identity.classroom),seat_(data.identity.seat),text_(data.identity.name)].join('|');
  const scores=data.scores,at=new Date(data.submittedAt||Date.now());
  const incoming=[at,text_(data.identity.classroom),seat_(data.identity.seat),text_(data.identity.name),scores.learningTotal,scores.assessment,scores.gameLatest,scores.gameBest,scores.challengeFirst,scores.challengeBest,data.completedPractice,data.completionPercent,text_(data.sessionId),Boolean(data.testMarker)];
  const rows=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,HEADERS.length).getValues():[];let row=-1;
  const rankState=rankState_(book,rows),cutoff=Number(rankState.get(key)?.resetAt||0);
  if(cutoff){
   const fresh=Date.parse(data.challengeCompletedAt||'')>cutoff&&Number.isInteger(data.challengeLatest);
   incoming[8]=fresh?data.challengeLatest:null;incoming[9]=fresh?data.challengeLatest:null;
  }
  for(let i=0;i<rows.length;i++){if([text_(rows[i][1]),seat_(rows[i][2]),text_(rows[i][3])].join('|')===key){row=i+2;break;}}
  if(row<0)sheet.appendRow(incoming);else{
   const old=sheet.getRange(row,1,1,HEADERS.length).getValues()[0];
   incoming[6]=latest_(old[6],incoming[6]);incoming[7]=max_(old[7],incoming[7]);incoming[8]=old[8]===''?incoming[8]:old[8];incoming[9]=max_(old[9],incoming[9]);
   sheet.getRange(row,1,1,HEADERS.length).setValues([incoming]);
  }
  index.appendRow([data.eventId,key,new Date()]);index.hideSheet();sheet.setFrozenRows(1);sheet.autoResizeColumns(1,HEADERS.length);rankState_(book,sheet.getRange(2,1,sheet.getLastRow()-1,HEADERS.length).getValues());return {ok:true,duplicate:false};
 }finally{lock.releaseLock();}
}

// Remember manual score/row removals, so an old browser snapshot cannot restore a deleted ranking.
function rankState_(book,rows){
 const existing=book.getSheetByName(RANK_STATE_NAME),sheet=existing||getSheet_(book,RANK_STATE_NAME,['studentKey','resetAt','hasChallenge']);
 const stored=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,3).getValues():[];
 const states=new Map(stored.map(r=>[String(r[0]),{resetAt:Number(r[1])||0,hasChallenge:r[2]===true}]));
 const scored=new Set(rows.filter(r=>r[9]!==''&&r[9]!==null&&Number.isFinite(Number(r[9]))).map(studentKey_));
 const now=Date.now();
 for(const [key,value] of states)if(value.hasChallenge&&!scored.has(key))states.set(key,{resetAt:now,hasChallenge:false});
 for(const row of rows){const key=studentKey_(row),old=states.get(key);states.set(key,{resetAt:old?.resetAt||0,hasChallenge:scored.has(key)});}
 if(!stored.length){const index=book.getSheetByName(INDEX_NAME);if(index&&index.getLastRow()>1){for(const r of index.getRange(2,1,index.getLastRow()-1,3).getValues())if(!states.has(String(r[1])))states.set(String(r[1]),{resetAt:now,hasChallenge:false});}}
 const values=[...states].map(([key,v])=>[key,v.resetAt,v.hasChallenge]);
 if(values.length&&JSON.stringify(values)!==JSON.stringify(stored))sheet.getRange(2,1,values.length,3).setValues(values);if(!existing)sheet.hideSheet();return states;
}
function studentKey_(r){return [text_(r[1]),seat_(r[2]),text_(r[3])].join('|');}
function leaderboard_(){
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try{
  const book=getBook_(),sheet=getSheet_(book,SHEET_NAME,HEADERS);
  const rows=sheet.getLastRow()>1?sheet.getRange(2,1,sheet.getLastRow()-1,HEADERS.length).getValues():[];rankState_(book,rows);
  const best=new Map();for(const r of rows){if(r[13]===true||r[9]===''||r[9]===null||!Number.isFinite(Number(r[9]))||!text_(r[1])||!seat_(r[2]))continue;const key=studentKey_(r),score=Number(r[9]);if(!best.has(key)||score>best.get(key).score)best.set(key,{classroom:text_(r[1]),seat:seat_(r[2]),score});}
  const entries=[...best.values()].sort((a,b)=>b.score-a.score||a.classroom.localeCompare(b.classroom)||Number(a.seat)-Number(b.seat)).slice(0,10);
  return {ok:true,entries,updatedAt:new Date().toISOString()};
 }finally{lock.releaseLock();}
}

function getBook_(){const props=PropertiesService.getScriptProperties();const id=props.getProperty('SCORE_SHEET_ID');if(id){try{return SpreadsheetApp.openById(id);}catch(_){props.deleteProperty('SCORE_SHEET_ID');}}const book=SpreadsheetApp.create(BOOK_TITLE);props.setProperty('SCORE_SHEET_ID',book.getId());return book;}
function getSheet_(book,name,headers){let sheet=book.getSheetByName(name);if(!sheet){sheet=book.insertSheet(name);}if(sheet.getLastRow()===0)sheet.appendRow(headers);return sheet;}
function validate_(d){if(!d||d.courseId!==COURSE_ID||d.cohortId!==COHORT_ID||!text_(d.eventId)||!text_(d.sessionId))throw new Error('資料識別不正確');if(!d.identity)throw new Error('缺少學生資料');for(const key of ['classroom','seat','name'])if(!text_(d.identity[key]))throw new Error('學生資料不完整');if(d.challengeLatest!==undefined)nullableRange_(d.challengeLatest,0,95000,'極限挑戰本次');range_(d.scores.learningTotal,0,75,'學習練習');nullableRange_(d.scores.assessment,0,10,'形成性評量');nullableRange_(d.scores.gameLatest,0,270,'分類遊戲');nullableRange_(d.scores.gameBest,0,270,'分類遊戲最高');nullableRange_(d.scores.challengeFirst,0,95000,'極限挑戰首次');nullableRange_(d.scores.challengeBest,0,95000,'極限挑戰最高');range_(d.completedPractice,0,25,'完成題數');range_(d.completionPercent,0,100,'完成進度');}
function nullableRange_(value,min,max,label){if(value!==null&&value!=='')range_(value,min,max,label);}
function range_(value,min,max,label){if(!Number.isInteger(value)||value<min||value>max)throw new Error(label+'超出範圍');}
function text_(value){return String(value==null?'':value).normalize('NFKC').trim().slice(0,100);}
function seat_(value){return text_(value).replace(/^0+(?=\d)/,'');}
function latest_(oldValue,newValue){return newValue===null||newValue===''?oldValue:newValue;}
function max_(oldValue,newValue){if(newValue===null||newValue==='')return oldValue;if(oldValue===null||oldValue==='')return newValue;return Math.max(Number(oldValue),Number(newValue));}
function cleanupTestData(){const book=getBook_(),sheet=book.getSheetByName(SHEET_NAME);let removed=0;if(sheet&&sheet.getLastRow()>1){const values=sheet.getRange(2,1,sheet.getLastRow()-1,HEADERS.length).getValues();for(let i=values.length-1;i>=0;i--)if(values[i][13]===true){sheet.deleteRow(i+2);removed++;}}const index=book.getSheetByName(INDEX_NAME);if(index&&index.getLastRow()>1){const values=index.getRange(2,1,index.getLastRow()-1,3).getValues();for(let i=values.length-1;i>=0;i--)if(String(values[i][1]).startsWith('測試班|'))index.deleteRow(i+2);}return removed;}
function json_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
