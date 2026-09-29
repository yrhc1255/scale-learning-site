import test from 'node:test';
import assert from 'node:assert/strict';
import {questions,assessment,challengeBank,gameCards} from '../src/data.js';
import {newSession,gradeAssessment} from '../src/engine.js';
import {introComplete,pageCompletion,lastUnlockedPage} from '../src/progression.js';

function completeSession(){return {...newSession({classroom:'test',seat:'01',name:'test'}),intro:true,introResponse:{prediction:'details',reason:'details',zoom:100},solved:Object.fromEntries(Object.values(questions).flat().map(q=>[q.id,{answer:q.answer,points:3,attempt:1}])),assessment:gradeAssessment(assessment,Object.fromEntries(assessment.map(q=>[q.id,q.answer]))),game:{score:0,total:gameCards.length*30},challenge:{maxAnswered:challengeBank.length}};}

test('legacy completion flag without a saved intro answer cannot unlock later saved pages',()=>{
 const s=completeSession();delete s.introResponse;
 assert.equal(introComplete(s),false);assert.equal(lastUnlockedPage(pageCompletion(s)),1);
 for(const response of [{},{prediction:'',reason:'details',zoom:100},{prediction:'details',reason:'grow',zoom:100},{prediction:'details',reason:'details'}]){s.introResponse=response;assert.equal(lastUnlockedPage(pageCompletion(s)),1);}
 s.introResponse={prediction:'larger',reason:'details',zoom:100};assert.equal(lastUnlockedPage(pageCompletion(s)),10);
});

test('each unfinished page blocks every later page even when later results exist',()=>{
 for(let p=2;p<=6;p++)for(const q of questions[p]){const s=completeSession();delete s.solved[q.id];assert.equal(lastUnlockedPage(pageCompletion(s)),p);}
 for(const [p,field] of [[7,'assessment'],[8,'game'],[9,'challenge']]){const s=completeSession();s[field]=null;assert.equal(lastUnlockedPage(pageCompletion(s)),p);}
 const s=completeSession();s.challenge.maxAnswered=challengeBank.length-1;assert.equal(lastUnlockedPage(pageCompletion(s)),9);
 s.intro=false;assert.equal(lastUnlockedPage(pageCompletion(s)),1);
});
