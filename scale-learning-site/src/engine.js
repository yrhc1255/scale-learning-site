export const STORAGE_KEY='scale-learning-v4';
export const REVIEW_MODE=true;
export const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
export function checkAnswer(q,value){
 if(q.type==='number')return String(value).trim()!==''&&Number(String(value).replaceAll(',',''))===q.answer;
 if(Array.isArray(q.answer)){if(!Array.isArray(value)||value.length!==q.answer.length)return false;return q.type==='multi'?[...value].sort().join('|')===[...q.answer].sort().join('|'):value.every((v,i)=>v===q.answer[i]);}
 return value===q.answer;
}
export function isComplete(q,v){if(q.type==='multi')return Array.isArray(v)&&v.length===q.required;if(Array.isArray(q.answer))return Array.isArray(v)&&v.length===q.answer.length&&v.every(x=>String(x).trim());return v!==undefined&&v!==null&&String(v).trim()!=='';}
export const pointsForAttempt=n=>n===1?3:n===2?2:1;
export const challengePoints=position=>Math.max(500,Math.floor(5000-position*45));
export function newSession(identity=null){return{id:crypto.randomUUID(),identity,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),attempts:{},solved:{},events:[],intro:false,assessment:null,game:null,challenge:null};}
export const learningTotal=s=>Object.values(s.solved).reduce((n,r)=>n+r.points,0);
export function submitPractice(session,q,value){if(session.solved[q.id])return session;const attempt=(session.attempts[q.id]||0)+1,correct=checkAnswer(q,value),points=correct?pointsForAttempt(attempt):0;return{...session,updatedAt:new Date().toISOString(),attempts:{...session.attempts,[q.id]:attempt},solved:{...session.solved,...(correct?{[q.id]:{answer:value,points,attempt}}:{})},events:[...session.events,{id:crypto.randomUUID(),question:q.id,answer:value,correct,points,attempt,time:new Date().toISOString()}]};}
export function gradeAssessment(items,answers){return{score:items.filter(q=>checkAnswer(q,answers[q.id])).length,total:items.length,answers,weakPages:[...new Set(items.filter(q=>!checkAnswer(q,answers[q.id])).map(q=>q.page))],at:new Date().toISOString()};}
export function csvCell(value){const s=String(value??'');return '"'+(/^[=+@\-\t\r]/.test(s)?"'":'')+s.replaceAll('"','""')+'"';}
