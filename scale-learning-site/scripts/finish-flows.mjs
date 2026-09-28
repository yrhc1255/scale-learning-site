import {readFileSync,writeFileSync} from 'node:fs';
function change(file,replacements){let s=readFileSync(file,'utf8');for(const [a,b] of replacements){if(!s.includes(a))throw Error('Missing target '+a.slice(0,80));s=s.replace(a,b);}writeFileSync(file,s);}
change('src/App.jsx',[
 ['function HomePage({session,start,onIdentityEditing,navigate})','function HomePage({session,start,onIdentityEditing,navigate,restart})'],
 ['<p>進度保存在這個瀏覽器，可稍後繼續。</p></div>','<p>進度保存在這個瀏覽器，可稍後繼續。</p>{session.identity&&<button className="text-button" onClick={restart}><RotateCcw size={15}/>以相同身分重新學習</button>}</div>'],
 ["[reportTopic,setReportTopic]=useState('all');","[reportTopic,setReportTopic]=useState('all'),[reportSession,setReportSession]=useState('all');"],
 ['onIdentityEditing={clearForEditing} navigate={navigate}/>', 'onIdentityEditing={clearForEditing} navigate={navigate} restart={()=>setModal(\'restart\')}/>'],
 ["const records=Object.values(db.sessions).filter(s=>s.identity&&(!reportClass||s.identity.classroom===reportClass));","const classRecords=Object.values(db.sessions).filter(s=>s.identity&&(!reportClass||s.identity.classroom===reportClass));const records=classRecords.filter(s=>reportSession==='all'||s.id===reportSession);"],
 ['onChange={e=>setReportClass(e.target.value)}','onChange={e=>{setReportClass(e.target.value);setReportSession(\'all\');}}'],
 ['<label>題目主題<select','<label>學習場次<select value={reportSession} onChange={e=>setReportSession(e.target.value)}><option value="all">全部場次</option>{classRecords.map(s=><option key={s.id} value={s.id}>{s.identity.name}・{new Date(s.createdAt).toLocaleString(\'zh-TW\')}</option>)}</select></label><label>題目主題<select'],
 ['<th>場次</th><th>練習</th>','<th>場次</th><th>完成練習</th><th>練習分數</th>'],
 ["<td>{s.createdAt.slice(0,16).replace('T',' ')}</td><td>{learningTotal(s)} / 75</td>","<td>{new Date(s.createdAt).toLocaleString('zh-TW')}</td><td>{Object.keys(s.solved).length} / 25</td><td>{learningTotal(s)} / 75</td>"],
 ['<h3>題目答對率與常見錯答</h3>','<h3>題目作答次數、答對率與常見錯答</h3><p className="hint">答對率以所有提交次數計算，包含重試。</p>'],
 [" {modal==='map'&&",` {modal==='restart'&&<Modal title="開始新的學習場次" onClose={()=>setModal(null)}><p>將以目前的班級、座號與姓名重新開始。新場次的進度及分數歸零，先前紀錄仍保留於本機教師檢查中。</p><div className="between"><button className="secondary" onClick={()=>setModal(null)}>保留目前進度</button><button className="primary" onClick={()=>{const s=newSession(session.identity);if(teacher)setTeacherSession(s);else setDb(prev=>({...prev,active:s.id,sessions:{...prev.sessions,[s.id]:s}}));navigate(1);}}>開始新場次<ArrowRight size={17}/></button></div></Modal>}
 {modal==='map'&&`]
]);
change('src/AssessmentGames.jsx',[
 ['setPaused(false);latch.current=false;elapsed.current=0;last.current=performance.now();','setPaused(false);latch.current=false;elapsed.current=0;last.current=performance.now();requestAnimationFrame(()=>document.querySelector(\'.challenge-arena\')?.scrollIntoView({block:\'start\',behavior:\'instant\'}));']
]);
change('src/Art.jsx',[
 ["type==='daphnia'||type==='rotifer'?",`type==='rotifer'?<g><path d="M196 73Q155 150 230 207L220 259L236 221L252 259L246 207Q326 150 280 73" fill="#d5dfb7" stroke="#839873" strokeWidth="3"/><ellipse cx="211" cy="64" rx="35" ry="20" fill="#b7ceac"/><ellipse cx="274" cy="64" rx="35" ry="20" fill="#b7ceac"/>{Array.from({length:20},(_,i)=><line key={i} x1={174+i*7} y1="53" x2={169+i*7} y2="31" stroke="#779b82" strokeWidth="2"/>)}<ellipse cx="242" cy="128" rx="22" ry="40" fill="#aebc94"/><path d="M210 145Q241 168 274 146" stroke="#758c76" strokeWidth="3" fill="none"/></g>:type==='daphnia'?`],
 ['fill="#a8ccbf"/>{cilia}</>', 'fill="#a8ccbf"/>{Array.from({length:22},(_,i)=><line key={i} x1={126+i*11} y1={55-10*Math.sin(i/21*Math.PI)} x2={122+i*11} y2={30-10*Math.sin(i/21*Math.PI)} stroke="#6da0a2" strokeWidth="2"/>)}</>']
]);
