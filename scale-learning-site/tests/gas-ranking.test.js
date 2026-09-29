import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

function environment(){
 class Sheet{
  rows=[];
  getLastRow(){return this.rows.length;}
  appendRow(row){this.rows.push(row.map(v=>v??''));return this;}
  getRange(row,col,height,width){return {getValues:()=>Array.from({length:height},(_,i)=>Array.from({length:width},(_,j)=>this.rows[row-1+i]?.[col-1+j]??'')),getDisplayValues:()=>Array.from({length:height},(_,i)=>Array.from({length:width},(_,j)=>String(this.rows[row-1+i]?.[col-1+j]??''))),setValues:values=>{values.forEach((r,i)=>{this.rows[row-1+i]??=[];r.forEach((v,j)=>{this.rows[row-1+i][col-1+j]=v??'';});});}};}
  hideSheet(){}setFrozenRows(){}autoResizeColumns(){}
 }
 const sheets=new Map(),book={getSheetByName:n=>sheets.get(n),insertSheet:n=>{const s=new Sheet();sheets.set(n,s);return s;}};
 const context=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:()=> 'test-book'})},SpreadsheetApp:{openById:()=>book},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({setMimeType:()=>JSON.parse(text)})}});
 vm.runInContext(readFileSync(new URL('../gas/Code.gs',import.meta.url),'utf8'),context);
 return {api:context,sheets};
}
function payload(overrides={}){return {courseId:'scale-learning-11501',cohortId:'115-1',sessionId:'session-a',eventId:crypto.randomUUID(),identity:{classroom:'測試班',seat:'03',name:'不公開姓名'},scores:{learningTotal:0,assessment:null,gameLatest:null,gameBest:null,challengeFirst:9000,challengeBest:9000},challengeLatest:9000,challengeCompletedAt:'2026-01-01T00:00:00Z',completedPractice:0,completionPercent:0,...overrides};}

test('cloud ranking reads the score sheet without exposing names, keys or test rows',()=>{
 const {api}=environment();api.upsert_(payload());api.upsert_(payload({identity:{classroom:'驗證班',seat:'04',name:'隱藏'},testMarker:true}));
 const result=api.doGet({parameter:{action:'leaderboard'}});assert.equal(result.ok,true);assert.equal(result.entries.length,1);assert.deepEqual(Object.keys(result.entries[0]),['classroom','seat','score']);assert.equal(result.entries[0].seat,'3');assert.ok(!JSON.stringify(result).includes('不公開姓名'));
});

test('deleting a row removes the ranking and stale snapshots cannot restore its old best',()=>{
 const {api,sheets}=environment();api.upsert_(payload());assert.equal(api.leaderboard_().entries.length,1);
 sheets.get('學生成績').rows.splice(1,1);assert.equal(api.leaderboard_().entries.length,0);
 api.upsert_(payload());assert.equal(api.leaderboard_().entries.length,0);
 const fresh=payload({challengeCompletedAt:new Date(Date.now()+1000).toISOString(),challengeLatest:1500});
 api.upsert_(fresh);assert.equal(api.leaderboard_().entries[0].score,1500);
 api.upsert_(payload());assert.equal(api.leaderboard_().entries[0].score,1500);
 api.upsert_({...fresh,eventId:crypto.randomUUID()});assert.equal(api.leaderboard_().entries[0].score,1500);
});

test('clearing only the challenge-best cell also removes rank, even if upload arrives before refresh',()=>{
 const {api,sheets}=environment();api.upsert_(payload());sheets.get('學生成績').rows[1][9]='';
 api.upsert_(payload());assert.equal(api.leaderboard_().entries.length,0);
 assert.equal(sheets.get('學生成績').rows[1][4],0);
});
