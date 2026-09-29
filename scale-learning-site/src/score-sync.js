import {learningTotal} from './engine.js';
import {COURSE_ID,COHORT_ID} from './sync-config.js';

const QUEUE_KEY='scale-learning-11501:score-queue:v1';
const ACK_KEY='scale-learning-11501:score-ack:v1';

function readJson(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}}
export function readScoreQueue(){const value=readJson(QUEUE_KEY,[]);return Array.isArray(value)?value:[];}
function fingerprint(value){const {eventId,submittedAt,...stable}=value;return JSON.stringify(stable);}

export function scoreSnapshot(session,completionPercent){
 return {courseId:COURSE_ID,cohortId:COHORT_ID,sessionId:session.id,revision:session.updatedAt,challengeCompletedAt:session.challenge?.at??null,challengeLatest:session.challenge?.score??null,identity:{classroom:session.identity.classroom,seat:session.identity.seat,name:session.identity.name},scores:{learningTotal:learningTotal(session),assessment:session.assessment?.score??null,gameLatest:session.game?.score??null,gameBest:session.game?.best??null,challengeFirst:session.challenge?.first??null,challengeBest:session.challenge?.best??null},completedPractice:Object.keys(session.solved).length,completionPercent,submittedAt:new Date().toISOString()};
}

export function shouldSync(session){return !!session.identity&&(Object.keys(session.solved).length>0||!!session.assessment||!!session.game||!!session.challenge);}

export function enqueueScore(snapshot){
 const ack=readJson(ACK_KEY,{}),fp=fingerprint(snapshot);if(ack[snapshot.sessionId]===fp)return false;
 const queued=readScoreQueue();if(queued.some(item=>fingerprint(item)===fp))return false;
 const item={...snapshot,eventId:crypto.randomUUID()};
 localStorage.setItem(QUEUE_KEY,JSON.stringify([...queued.filter(old=>old.sessionId!==snapshot.sessionId),item]));return true;
}

function acknowledge(item){const ack=readJson(ACK_KEY,{});ack[item.sessionId]=fingerprint(item);localStorage.setItem(ACK_KEY,JSON.stringify(ack));localStorage.setItem(QUEUE_KEY,JSON.stringify(readScoreQueue().filter(old=>old.eventId!==item.eventId)));}

export async function flushScoreQueue(endpoint){
 if(!endpoint)return {sent:0,pending:readScoreQueue().length};let sent=0;
 for(const item of readScoreQueue()){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(item),redirect:'follow',signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error('成績服務未回應');const receipt=await response.json();
  if(receipt.ok!==true||receipt.eventId!==item.eventId)throw new Error(receipt.error||'成績表尚未確認');acknowledge(item);sent++;
 }
 return {sent,pending:readScoreQueue().length};
}
