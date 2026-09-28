import {readFileSync,writeFileSync} from 'node:fs';
let s=readFileSync('src/App.jsx','utf8').replace("import {Assessment,SortingGame,Challenge} from './AssessmentGames';","import {Assessment,Challenge} from './AssessmentGames';\nimport {SortingGame} from './SortingRev';");writeFileSync('src/App.jsx',s);
s=readFileSync('src/AssessmentGames.jsx','utf8');
s=s.replace("import {ScaleArt,Motif,Photo} from './Art';","import {ScaleArt,Motif,Photo} from './Art';\nimport {SpecimenVisual} from './DesignSystem';");
// The challenge artwork remains beside the live question; all choices stay real buttons.
const start=s.indexOf('{!started||finished?<div className="challenge-welcome">'),end=s.indexOf(':<><div className="speed-track"',start);
if(start<0||end<0)throw Error('challenge welcome anchor missing');
s=s.slice(0,start)+`{!started||finished?<><div className="challenge-welcome"><div className="challenge-photo"><Photo page={9} region={[212,363,377,237]} label="植物細胞構造示意" fit="slice"/><span>植物細胞・構造示意</span></div><div><h2>{finished?'每次判斷，都是新的累積。':'準備挑戰你的反應極限。'}</h2><p>讀懂題目，選出答案。愈快答對，得分愈高；答錯或逾時扣 1,000 分並失去 1 次生命。共 {deck.length} 題，3 次失誤結束。</p><p>每題約 16–22 秒。解析時間不計時；切換視窗會自動暫停。</p><button className="primary" onClick={start}>{finished?'再挑戰一次':'準備好了，開始'}<Play size={18}/></button>{finished&&<button className="secondary" onClick={()=>navigate(10)}>查看學習成果<ArrowRight size={18}/></button>}</div></div>{finished&&<div className="challenge-finish"><Trophy size={58}/><h2>本局完成！</h2><div className="challenge-score">{score.toLocaleString()}<span>本次得分</span></div></div>}</>`+s.slice(end);
s=s.replace('<><div className="challenge-question">','<><div className="challenge-round"><div className="challenge-photo">{q.art&&q.art!==\'assessment-scale\'?<SpecimenVisual type={q.art}/>:<Photo page={9} region={[212,363,377,237]} label="細胞構造示意" fit="slice"/>}<span>{q.art&&q.art!==\'assessment-scale\'?\'觀察情境示意・非等比圖\':\'植物細胞・構造示意\'}</span></div><div className="round-content"><div className="challenge-question">');
s=s.replace('</button>)}</div>{feedback&&<div className={`feedback ${feedback.correct?', '</button>)}</div></div></div>{feedback&&<div className={`feedback ${feedback.correct?');
const rStart=s.indexOf('{leaderboard.length?<table>'),rEnd=s.indexOf(':<div className="empty-state">',rStart);
if(rStart<0||rEnd<0)throw Error('rank anchor missing');
s=s.slice(0,rStart)+`{leaderboard.length?<div className="ranking-columns">{[0,5].filter(start=>leaderboard.length>start).map(start=><div key={start}><table><thead><tr><th>排名</th><th>匿名代號</th><th>最高分</th></tr></thead><tbody>{leaderboard.slice(start,start+5).map((r,i)=><tr key={r.key}><td><span className={\`rank rank-\${start+i}\`}>{start+i+1}</span></td><td>{r.alias}</td><td>{r.score.toLocaleString()}</td></tr>)}</tbody></table></div>)}</div>`+s.slice(rEnd);
writeFileSync('src/AssessmentGames.jsx',s);
s=readFileSync('src/Questions.jsx','utf8');
s=s.replace("import {Cell,Motif,ScaleArt,Photo} from './Art';","import {Cell,Motif,ScaleArt,Photo} from './Art';\nimport {SpecimenVisual,ToolVisual} from './DesignSystem';");
s=s.replace("${q.type==='cer'?'cer-rows':''}","${q.type==='cer'?'cer-rows':''} ${q.id==='u1'?'match-illustrated':''}");
s=s.replace('<label key={row}><span>','<label key={row}>{q.id===\'u1\'&&<SpecimenVisual type={[\'euglena\',\'person\',\'mountain\',\'galaxy\'][i]}/>}<span>');
s=s.replace("${q.type==='boolean'?'boolean':''}","${q.type==='boolean'?'boolean':''} ${q.id==='o1'?'illustrated-tools':''}");
s=s.replace('<span>{o}</span></button>;})}',"{q.id==='o1'&&<ToolVisual name={o}/>}<span>{o}</span></button>;})}");
// Different lesson pages retain their individual instructional heading from the sheet.
s=s.replace('練習、修正，真正學會。',"{({2:'把觀察用在新情境',3:'選一個合理的單位',4:'把比例變成判斷',5:'任務練習',6:'為你的設計找證據'})[page]}");
writeFileSync('src/Questions.jsx',s);
console.log('Game, challenge, and illustrated practice layouts updated.');
