// Owner-only editor verification. Test rows are hidden from the public ranking and always removed.
function verifyLeaderboardDeletion(){
 const id=Utilities.getUuid(),identity={classroom:'驗證專用班',seat:'999',name:'排行榜驗證-'+id};
 const key=[identity.classroom,identity.seat,identity.name].join('|'),book=getBook_();
 const payload={courseId:COURSE_ID,cohortId:COHORT_ID,sessionId:id,eventId:Utilities.getUuid(),identity:identity,testMarker:true,scores:{learningTotal:0,assessment:null,gameLatest:null,gameBest:null,challengeFirst:9000,challengeBest:9000},challengeLatest:9000,challengeCompletedAt:new Date(Date.now()-60000).toISOString(),completedPractice:0,completionPercent:0};
 function check(value,label){if(!value)throw new Error('FAIL: '+label);console.log('PASS: '+label);}
 function ownRow(){const s=book.getSheetByName(SHEET_NAME),rows=s.getDataRange().getValues();const i=rows.findIndex((r,n)=>n>0&&studentKey_(r)===key&&r[13]===true);return {sheet:s,index:i,values:rows[i]};}
 const before=JSON.stringify(leaderboard_().entries);
 try{
  upsert_(payload);let row=ownRow();check(row.index>0&&Number(row.values[9])===9000,'test upload stored');
  row.sheet.deleteRow(row.index+1);leaderboard_();
  payload.eventId=Utilities.getUuid();upsert_(payload);row=ownRow();check(row.values[9]===''||row.values[9]===null,'deleted rank cannot return from stale upload');
  Utilities.sleep(10);payload.eventId=Utilities.getUuid();payload.challengeCompletedAt=new Date().toISOString();payload.challengeLatest=1500;upsert_(payload);row=ownRow();check(Number(row.values[9])===1500,'new attempt uses its own score instead of old best');
  row.sheet.getRange(row.index+1,10).clearContent();payload.eventId=Utilities.getUuid();upsert_(payload);row=ownRow();check(row.values[9]===''||row.values[9]===null,'cleared score cannot return from stale upload');
  check(JSON.stringify(leaderboard_().entries)===before,'public leaderboard excludes test identity');
 }finally{
  for(const name of [SHEET_NAME,INDEX_NAME,RANK_STATE_NAME]){
   const s=book.getSheetByName(name);if(!s)continue;const rows=s.getDataRange().getValues();
   for(let i=rows.length-1;i>=1;i--){const match=name===SHEET_NAME?studentKey_(rows[i])===key&&rows[i][13]===true:name===INDEX_NAME?String(rows[i][1])===key:String(rows[i][0])===key;if(match)s.deleteRow(i+1);}
  }
  console.log('CLEANUP: verification rows removed');
 }
 return {ok:true};
}
