import React from 'react';
import {ArrowRight, Leaf, Ruler, Search, Droplets, Fingerprint, BookOpen, FlaskConical, PencilLine,Binoculars} from 'lucide-react';
import {Photo, Motif} from './Art';
import {pages} from './data';

const heroRegions={0:[0,60,1182,440],2:[596,121,586,169],3:[0,115,1182,165],4:[436,114,746,317],5:[0,108,1182,140],6:[597,120,585,427],7:[572,158,610,254],10:[398,113,784,355]};
const heroCopy={
 2:['從一個熟悉的對象，進入看不見的世界','看見整體，也看見細節','同一個對象，觀察目的不同，使用的工具也可能不同。'],
 3:['為大小選單位','從奈米到光年，為大小找到合適的語言','同一個世界，有微小的精緻，也有巨大的浩瀚。選對單位，才能準確描述、比較與思考。'],
 4:['圖片裡的真實大小',<>照片會放大，<br/>真實大小不會。</>,'找出比例尺，讓看不見的大小變成能推理的證據。'],
 5:['從一滴池水，發現意想不到的生命。','一滴池水，就是一座微型世界。','看似平靜的池水中，住著形形色色的微小生物。牠們正忙著生長、移動與生存。'],
 6:['向大自然借點子',<>大自然，<br/>早就藏著設計的答案。</>,'從巨觀現象出發，尋找微觀構造，再把原理用在生活中。'],
 7:['尺度自我檢查','把觀察，變成你的判斷。','共 10 題，全部作答後再一起提交。'],
 8:['尺度快判','快看、快分，把尺度放對位置！','觀察線索，為每個物件找到合適的位置。'],
 9:['尺度極限挑戰',<>看準尺度，挑戰你的<em>反應極限。</em></>,'答得正確，也答得俐落。']
};
export function HeroArt({page,className=''}){return <div className={`hero-art ${className}`} aria-hidden="true"><Photo page={page} region={heroRegions[page]} label="" fit="slice"/></div>;}
export function DesignHero({page,children}){const c=heroCopy[page];return <section className={`design-hero design-hero-${page}`}>
 {heroRegions[page]&&<HeroArt page={page}/>}
 <div className="design-hero-copy"><span className="eyebrow">{c[0]}</span><h1>{c[1]}</h1><p>{c[2]}</p>{page===4&&<div className="hero-scale-note"><div className="mini-ruler"/><p>比例尺的線段代表實際長度。<br/>比較圖上的物體與線段，就能推算物體的實際大小。</p></div>}{page===7&&<p className="hand-note">科學不只看見現象，<br/>更在於做出合理的判斷。</p>}{children}</div>
 </section>;}
export function Landscape(){return <div className="landscape" aria-hidden="true"><Photo page={3} region={[0,1184,865,65]} label="" fit="slice"/></div>;}
const trailTitles=['觀察尺度','選擇單位','比例尺判讀','池水生物','仿生設計'];
const trailDescriptions=['從日常事物出發，發現不同的尺度。','認識長度單位，選擇合適的方式描述。','從圖片推理，估計真實的大小。','觀察一滴池水，發現肉眼看不見的世界。','從自然中學習，思考如何應用到生活。'];
export function TopicTrail({navigate,compact=false,done,questions,session}){return <div className={compact?'topic-trail compact':'topic-trail'}>{[2,3,4,5,6].map((p,i)=><button key={p} onClick={()=>navigate(p)}><span className="trail-image"><Photo page={0} region={[[33,823,204,153],[264,823,201,153],[495,823,192,153],[720,823,197,153],[950,823,194,153]][i]} label={pages[p].name}/>{done&&<span className={'trail-check '+(done[p]?'complete':'')}>{done[p]?'✓':questions[p].filter(q=>session.solved[q.id]).length+'/5'}</span>}</span><strong>{trailTitles[i]}</strong><p>{trailDescriptions[i]}</p></button>)}</div>;}
export function MethodStrip(){return <section className="method-strip"><h2>帶走一個觀察方法</h2><div>{[[Search,'先問：我要看什麼？','選定對象，提出問題，決定觀察的重點。'],[FlaskConical,'再選：用什麼工具？','依照尺度大小，選擇合適的觀察工具與單位。'],[PencilLine,'最後：證據告訴我什麼？','從觀察結果推理，說明你的發現。']].map(([Icon,t,d],i)=><article key={t}><span className="method-icon"><Icon size={43} strokeWidth={1.2}/></span><div><h3><b>{i+1}</b>{t}</h3><p>{d}</p></div></article>)}</div></section>;}
export function ReviewTopics({navigate}){return <section className="review-topics"><div><h2>準備好了嗎？</h2><p>回顧關鍵概念，<br/>讓你更有信心完成評量。</p></div>{[Leaf,Ruler,Search,Droplets,Fingerprint].map((Icon,i)=><button key={i} onClick={()=>navigate(i+2)}><span><Icon size={30}/></span><strong>{trailTitles[i]}</strong><small>{['細胞與微生物','km · m · cm · mm · μm','從圖上推算真實大小','水滴裡的豐富生命','向大自然學習'][i]}</small></button>)}</section>;}

// Image regions contain illustrations only. Labels and controls stay as accessible HTML.
const specimenImages={
 atom:[3,[43,431,95,113]],virus:[3,[168,435,96,110]],cell:[3,[310,445,116,100]],seed:[3,[459,442,99,100]],sprout:[3,[572,425,113,119]],person:[3,[715,413,70,130]],mountain:[3,[792,442,201,102]],galaxy:[3,[1009,413,138,131]],
 leaf:[0,[33,823,204,153]],bread:[2,[431,403,162,160]],paramecium:[5,[602,832,102,120]],euglena:[5,[881,832,88,120]],hydra:[5,[35,832,95,120]],daphnia:[5,[320,832,98,120]],snail:[4,[48,991,398,174]],burr:[6,[45,880,145,118]],gecko:[6,[614,880,170,118]]
};
export function SpecimenVisual({type='cell',className=''}){const source=specimenImages[type];return <div className={`specimen-visual ${className}`}>{source?<Photo page={source[0]} region={source[1]} label={`${type} 觀察示意`}/>:<Motif type={type}/>}</div>;}
export function ToolVisual({name}){const i=name.includes('顯微鏡')?2:name.includes('放大鏡')?1:name==='肉眼'?0:-1;return i<0?<Binoculars size={38}/>:<Photo page={2} region={[[43,458,94,104],[153,455,97,107],[267,466,87,98]][i]} label={name}/>;}
