import test from 'node:test';
import assert from 'node:assert/strict';
import {newSession} from '../src/engine.js';
import {scoreSnapshot,shouldSync,enqueueScore,readScoreQueue,flushScoreQueue} from '../src/score-sync.js';

function storage(){const map=new Map();return{getItem:key=>map.get(key)??null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key)};}

test('score snapshot queues one latest item per session and acknowledges a confirmed upload',async()=>{
 global.localStorage=storage();const session=newSession({classroom:'701',seat:'01',name:'測試生'});session.solved.q={points:3};
 assert.equal(shouldSync(session),true);const snapshot=scoreSnapshot(session,10);assert.equal(snapshot.scores.learningTotal,3);assert.equal(snapshot.identity.seat,'01');
 assert.equal(enqueueScore(snapshot),true);assert.equal(enqueueScore(snapshot),false);assert.equal(readScoreQueue().length,1);
 global.fetch=async(_url,options)=>({ok:true,json:async()=>({ok:true,eventId:JSON.parse(options.body).eventId})});
 assert.deepEqual(await flushScoreQueue('https://example.invalid/exec'),{sent:1,pending:0});assert.equal(readScoreQueue().length,0);
});

test('failed upload keeps the queued score for retry',async()=>{
 global.localStorage=storage();const session=newSession({classroom:'702',seat:'02',name:'測試生'});session.assessment={score:8};enqueueScore(scoreSnapshot(session,20));
 global.fetch=async()=>({ok:false});await assert.rejects(()=>flushScoreQueue('https://example.invalid/exec'));assert.equal(readScoreQueue().length,1);
});
