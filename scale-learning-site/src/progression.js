import {pages,questions,challengeBank} from './data.js';

export function introComplete(session){
 const response=session.introResponse;
 return session.intro===true&&['details','larger'].includes(response?.prediction)&&response?.reason==='details'&&Number.isFinite(response?.zoom)&&response.zoom>=0&&response.zoom<=100;
}

export function pageCompletion(session){
 const challengeComplete=(session.challenge?.maxAnswered??session.challenge?.answered??0)>=challengeBank.length;
 const done=pages.map(({id})=>id===0?!!session.identity:id===1?introComplete(session):id<=6?questions[id].every(q=>!!session.solved[q.id]):id===7?!!session.assessment:id===8?!!session.game:id===9?challengeComplete:false);
 done[10]=done.slice(0,10).every(Boolean);
 return done;
}

export function lastUnlockedPage(done){
 const firstIncomplete=done.findIndex(complete=>!complete);
 return firstIncomplete<0?done.length-1:firstIncomplete;
}
