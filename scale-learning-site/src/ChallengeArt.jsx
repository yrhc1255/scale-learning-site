import React from 'react';

const ink='#173342',teal='#348b91',mint='#b9d8bd',gold='#d4ae58';
function Label({x=240,y=40,children,...rest}){return <text x={x} y={y} textAnchor="middle" fill={ink} fontSize="19" {...rest}>{children}</text>;}
function Line({x=65,y=235,width=100,label}){return <g stroke={ink} strokeWidth="3"><path d={`M${x} ${y-7}v14m0 -7h${width}m0 -7v14`}/><Label x={x+width/2} y={y+32} stroke="none">{label}</Label></g>;}
function Cell({x=240,y=140,width=160,height=64}){return <g><ellipse cx={x} cy={y} rx={width/2} ry={height/2} fill={mint} stroke={teal} strokeWidth="3"/><ellipse cx={x} cy={y} rx={Math.min(width/7,14)} ry={height/5} fill={gold}/></g>;}
function Plant({x=240,bottom=220,height=130}){return <g stroke={teal} strokeWidth="4" fill={mint}><path d={`M${x} ${bottom}v-${height}`}/><path d={`M${x} ${bottom-height*.6}q-55 0 -45 -38q42 0 45 38m0 -20q55 0 45 -38q-42 0 -45 38`}/><path d={`M${x-42} ${bottom}h84`} stroke={gold}/></g>;}
function Ratio({ratio,bar,actual,objectLabel}){const segment=ratio>4?55:90,object=segment*ratio;return <><Label>{objectLabel||'物體與比例尺的長度比較'}</Label><Cell width={object} height={Math.min(64,object*.35)}/><Line x={240-object/2} y={88} width={object} label={actual||`${ratio} 個線段長`}/><Line x={60} width={segment} label={bar}/></>;}

export const challengeVisualLabels={
 ch1:'微小生物長 0.06 mm，換算成微米',ch2:'幼苗高 4.2 cm，換算成毫米',ch3:'薄膜厚 3 μm，換算成奈米',ch4:'科學步道長 2.4 km，換算成公尺',
 ch5:'樣本 A 長 90 μm，樣本 B 長 0.12 mm',ch6:'生物長為線段的 3 倍，線段代表 30 μm',ch7:'細胞長為線段的一半，線段代表 80 μm',ch8:'樣本實際長 72 μm，圖長為線段的 6 倍',ch9:'圖上物體長 6 cm，線段長 2 cm 且代表 40 μm',ch10:'照片與比例尺同步縮至四分之一',ch11:'參照物圖長 2 cm、實際長 8 mm，種子圖長 3 cm',ch12:'幼苗從 12 mm 長到 3.2 cm',
 ch13:'校園平面圖中有 6 棵樹',ch14:'兩片葉子的表皮細胞排列',ch15:'視野左上方的生物與中央位置',ch16:'低倍率視野與準備切換高倍率',ch17:'伸出可變形突起並包圍食物的生物',ch18:'具有細微分支的貼片甲與印有圖案的貼片乙',ch19:'比較有無微小突起的兩個表面'
};

export function ChallengeArt({question}){
 const id=question.id;let drawing;
 switch(id){
  case 'ch1':drawing=<><Label>微小生物量測紀錄</Label><Cell width={240}/><Line x={120} width={240} label="0.06 mm"/><Label y={95}>換成 μm：？</Label></>;break;
  case 'ch2':drawing=<><Label>幼苗高度</Label><Plant/><path d="M290 90h20m-10 0v130m-10 0h20" stroke={ink} strokeWidth="3" fill="none"/><Label x={360} y={160}>4.2 cm</Label><Label x={120} y={170}>？ mm</Label></>;break;
  case 'ch3':drawing=<><Label>材料薄膜剖面</Label><rect x="70" y="130" width="300" height="50" fill={mint} stroke={teal} strokeWidth="3"/><path d="M390 130h25m-12 0v50m-13 0h25" fill="none" stroke={ink} strokeWidth="3"/><Label x={405} y={108}>3 μm</Label><Label y={240}>換成 nm：？</Label></>;break;
  case 'ch4':drawing=<><Label>科學步道</Label><path d="M70 205Q90 50 230 145T410 90" fill="none" stroke={gold} strokeWidth="12"/><circle cx="70" cy="205" r="9" fill={teal}/><circle cx="410" cy="90" r="9" fill={teal}/><Label x={75} y={240}>起點</Label><Label x={405} y={65}>終點</Label><Label y={75}>全程 2.4 km</Label><Label y={270}>換成 m：？</Label></>;break;
  case 'ch5':drawing=<><Label>先統一單位，再比較</Label><Cell x={225} y={120} width={180}/><Cell x={255} y={220} width={240}/><Label x={70} y={125}>A</Label><Label x={70} y={225}>B</Label><Label x={225} y={85}>90 μm</Label><Label x={255} y={185}>0.12 mm</Label></>;break;
  case 'ch6':drawing=<Ratio ratio={3} bar="30 μm"/>;break;
  case 'ch7':drawing=<Ratio ratio={0.5} bar="80 μm" objectLabel="細胞只有半個線段長"/>;break;
  case 'ch8':drawing=<Ratio ratio={6} bar="？ μm" actual="實際 72 μm；圖長為 6 個線段"/>;break;
  case 'ch9':drawing=<><Ratio ratio={3} bar="40 μm" actual="圖上 6 cm"/><Label x={285} y={243}>線段圖長 2 cm</Label></>;break;
  case 'ch10':drawing=<><Label>照片與線段同步縮小</Label><Cell x={175} y={140} width={240}/><Line x={55} y={210} width={80} label="原比例尺"/><Cell x={395} y={140} width={60} height={16}/><Line x={365} y={210} width={20} label="縮小後"/><Label x={175} y={85}>原先推算 160 μm</Label><Label x={395} y={85}>× ¼</Label><Label y={285}>整張照片縮成原來的四分之一</Label></>;break;
  case 'ch11':drawing=<><Label>同一平面的參照物與種子</Label><rect x="70" y="100" width="160" height="28" rx="4" fill={gold}/><Label x={150} y={82}>參照物：實際 8 mm</Label><Line x={70} y={143} width={160} label="圖上 2 cm"/><ellipse cx="190" cy="213" rx="120" ry="25" fill={mint} stroke={teal} strokeWidth="3"/><Label x={390} y={217}>種子</Label><Line x={70} y={253} width={240} label="圖上 3 cm"/></>;break;
  case 'ch12':drawing=<><Label>同一棵幼苗的生長紀錄</Label><Plant x={130} height={60}/><Plant x={350} height={160}/><Label x={130} y={265}>原本 12 mm</Label><Label x={350} y={265}>後來 3.2 cm</Label><Label y={175}>→</Label></>;break;
  case 'ch13':drawing=<><Label>校園樹木位置紀錄</Label><rect x="50" y="65" width="380" height="205" fill="#fff" stroke={teal}/><path d="M55 165H425M235 70V265" stroke="#dce5df" strokeWidth="20"/>{[[105,105],[170,120],[310,105],[370,135],[120,220],[340,220]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="22" fill={mint} stroke={teal}/><Label x={x} y={y+7}>{i+1}</Label></g>)}</>;break;
  case 'ch14':drawing=<><Label>比較葉片表皮細胞的排列</Label>{[80,270].map((x,i)=><g key={x}><Label x={x+65} y={85}>葉片 {i+1}</Label>{Array.from({length:12},(_,n)=><rect key={n} x={x+n%3*43} y={105+Math.floor(n/3)*36} width="41" height="34" rx={i?12:3} fill={mint} stroke={teal}/>)}</g>)}<Label y={285}>細胞排列示意，應選擇什麼工具？</Label></>;break;
  case 'ch15':drawing=<><Label>將生物影像帶回中央</Label><circle cx="240" cy="177" r="102" fill="#e4efed" stroke={teal} strokeWidth="4"/><path d="M230 177h20m-10 -10v20" stroke={ink} strokeWidth="2"/><Cell x={187} y={123} width={55} height={27}/><Label x={80} y={110}>左上</Label><Label x={340} y={183}>中央</Label></>;break;
  case 'ch16':drawing=<><Label>準備切換倍率</Label><circle cx="165" cy="165" r="80" fill="#e4efed" stroke={teal} strokeWidth="3"/><Cell x={145} y={142} width={40} height={24}/><Label x={165} y={275}>目前：低倍率</Label><Label x={300} y={170}>→</Label><circle cx="385" cy="165" r="48" fill="#e4efed" stroke={teal} strokeWidth="3"/><Label x={385} y={173} fontSize="32">？</Label><Label x={385} y={245}>高倍率</Label></>;break;
  case 'ch17':drawing=<><Label>觀察突起與攝食</Label><path d="M100 150Q70 80 150 88Q190 35 230 108Q305 90 335 125Q350 150 315 148Q285 130 260 155Q300 184 340 165Q365 165 345 190Q300 220 252 203Q190 275 150 218Q70 245 100 150Z" fill={mint} stroke={teal} strokeWidth="4"/><circle cx="178" cy="157" r="20" fill={gold}/><circle cx="321" cy="156" r="8" fill={ink}/><Label x={392} y={160}>食物</Label><Label y={285}>突起可變形，向外延伸並包圍食物</Label></>;break;
  case 'ch18':drawing=<><Label>兩種仿生貼片</Label><rect x="50" y="180" width="160" height="35" fill={mint}/>{[75,115,155,195].map(x=><path key={x} d={`M${x} 180v-40m0 10l-12 -15m12 15l12 -15`} fill="none" stroke={teal} strokeWidth="4"/>)}<rect x="275" y="125" width="155" height="90" fill={mint} stroke={teal}/><Label x={352} y={177}>壁虎圖案</Label><Label x={130} y={90}>甲：細微分支</Label><Label x={352} y={90}>乙：印刷圖案</Label><Label y={270}>比較黏附力，需要什麼證據？</Label></>;break;
  case 'ch19':drawing=<><Label>比較有無微小突起</Label><path d="M40 190h20v-25h20v25h20v-25h20v25h20v-25h20v25h20v-25h20v25h25M275 190h160" fill="none" stroke={teal} strokeWidth="6"/><Label x={130} y={230}>表面 A</Label><Label x={355} y={230}>表面 B</Label><Label y={120}>一次只改變一個條件</Label><Label y={280}>材質與防水性也要一起考慮</Label></>;break;
  default:throw new Error(`Missing challenge illustration: ${id}`);
 }
 return <svg className="challenge-diagram" data-question-art={id} viewBox="0 0 480 320" role="img" aria-label={challengeVisualLabels[id]} style={{width:'100%',height:'auto',maxHeight:320,background:'#f3f7f2',borderRadius:12}}>{drawing}</svg>;
}
