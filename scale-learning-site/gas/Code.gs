const COURSE_ID='scale-learning-11501';
const COHORT_ID='115-1';
const BOOK_TITLE='尺度探索站_115-1_成績總表';
const SHEET_NAME='學生成績';
const INDEX_NAME='同步索引';
const HEADERS=['更新時間','班級','座號','姓名','學習練習','形成性評量','分類遊戲最近','分類遊戲最高','極限挑戰首次','極限挑戰最高','完成練習題數','完成進度','學習場次','測試資料'];

function doGet(){let ready=false;try{ready=Boolean(PropertiesService.getScriptProperties().getProperty('SCORE_SHEET_ID'));}catch(_){}return json_({ok:true,courseId:COURSE_ID,cohortId:COHORT_ID,ready:ready});}
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
  for(let i=0;i<rows.length;i++){if([text_(rows[i][1]),seat_(rows[i][2]),text_(rows[i][3])].join('|')===key){row=i+2;break;}}
  if(row<0)sheet.appendRow(incoming);else{
   const old=sheet.getRange(row,1,1,HEADERS.length).getValues()[0];
   incoming[6]=latest_(old[6],incoming[6]);incoming[7]=max_(old[7],incoming[7]);incoming[8]=old[8]===''?incoming[8]:old[8];incoming[9]=max_(old[9],incoming[9]);
   sheet.getRange(row,1,1,HEADERS.length).setValues([incoming]);
  }
  index.appendRow([data.eventId,key,new Date()]);index.hideSheet();sheet.setFrozenRows(1);sheet.autoResizeColumns(1,HEADERS.length);return {ok:true,duplicate:false};
 }finally{lock.releaseLock();}
}

function getBook_(){const props=PropertiesService.getScriptProperties();const id=props.getProperty('SCORE_SHEET_ID');if(id){try{return SpreadsheetApp.openById(id);}catch(_){props.deleteProperty('SCORE_SHEET_ID');}}const book=SpreadsheetApp.create(BOOK_TITLE);props.setProperty('SCORE_SHEET_ID',book.getId());return book;}
function getSheet_(book,name,headers){let sheet=book.getSheetByName(name);if(!sheet){sheet=book.insertSheet(name);}if(sheet.getLastRow()===0)sheet.appendRow(headers);return sheet;}
function validate_(d){if(!d||d.courseId!==COURSE_ID||d.cohortId!==COHORT_ID||!text_(d.eventId)||!text_(d.sessionId))throw new Error('資料識別不正確');if(!d.identity)throw new Error('缺少學生資料');for(const key of ['classroom','seat','name'])if(!text_(d.identity[key]))throw new Error('學生資料不完整');range_(d.scores.learningTotal,0,75,'學習練習');nullableRange_(d.scores.assessment,0,10,'形成性評量');nullableRange_(d.scores.gameLatest,0,270,'分類遊戲');nullableRange_(d.scores.gameBest,0,270,'分類遊戲最高');nullableRange_(d.scores.challengeFirst,0,95000,'極限挑戰首次');nullableRange_(d.scores.challengeBest,0,95000,'極限挑戰最高');range_(d.completedPractice,0,25,'完成題數');range_(d.completionPercent,0,100,'完成進度');}
function nullableRange_(value,min,max,label){if(value!==null&&value!=='')range_(value,min,max,label);}
function range_(value,min,max,label){if(!Number.isInteger(value)||value<min||value>max)throw new Error(label+'超出範圍');}
function text_(value){return String(value==null?'':value).normalize('NFKC').trim().slice(0,100);}
function seat_(value){return text_(value).replace(/^0+(?=\d)/,'');}
function latest_(oldValue,newValue){return newValue===null||newValue===''?oldValue:newValue;}
function max_(oldValue,newValue){if(newValue===null||newValue==='')return oldValue;if(oldValue===null||oldValue==='')return newValue;return Math.max(Number(oldValue),Number(newValue));}
function cleanupTestData(){const book=getBook_(),sheet=book.getSheetByName(SHEET_NAME);let removed=0;if(sheet&&sheet.getLastRow()>1){const values=sheet.getRange(2,1,sheet.getLastRow()-1,HEADERS.length).getValues();for(let i=values.length-1;i>=0;i--)if(values[i][13]===true){sheet.deleteRow(i+2);removed++;}}const index=book.getSheetByName(INDEX_NAME);if(index&&index.getLastRow()>1){const values=index.getRange(2,1,index.getLastRow()-1,3).getValues();for(let i=values.length-1;i>=0;i--)if(String(values[i][1]).startsWith('測試班|'))index.deleteRow(i+2);}return removed;}
function json_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
