import React,{useState,useId} from 'react';
import {designFiles} from './data';

export function ScaleArt({ratio=3.5,bar=30,zoom=1,broken=false,measure=false}){
 const id=useId().replaceAll(':','');const [rulerY,setRulerY]=useState(76);
 const length=100*ratio, left=320-length*zoom/2;
 function drag(e){if(!e.buttons)return;const box=e.currentTarget.ownerSVGElement.getBoundingClientRect();setRulerY(Math.max(52,Math.min(230,(e.clientY-box.top)/box.height*345)));}
 return <svg className="scale-art" viewBox="0 0 640 345" role="img" aria-label={`生物圖長為線段的 ${ratio} 倍，比例尺 ${bar} 微米`}>
 <defs><radialGradient id={'water-'+id}><stop stopColor="#235774"/><stop offset="1" stopColor="#092b40"/></radialGradient><clipPath id={'body-'+id}><ellipse cx="320" cy="165" rx={length*zoom/2} ry={79*zoom}/></clipPath><filter id={'glow-'+id}><feGaussianBlur stdDeviation="2"/></filter></defs>
 <rect width="640" height="345" rx="9" fill={`url(#water-${id})`}/>
 <g opacity=".22" fill="#c4e3d6">{Array.from({length:54},(_,i)=><circle key={i} cx={i*137%640} cy={i*61%345} r={1+i%5}/>)}</g>
 <g clipPath={`url(#body-${id})`}><svg x={left} y={165-79*zoom} width={length*zoom} height={158*zoom} viewBox="342 594 346 182" preserveAspectRatio="none"><image href={`${import.meta.env.BASE_URL}designs/${designFiles[7]}`} width="1182" height="1330"/></svg></g>
 <ellipse cx="320" cy="165" rx={length*zoom/2} ry={79*zoom} fill="none" stroke="#d2ecde" strokeWidth="1.4"/>
 <g stroke="#c7e5e1" strokeWidth="1" opacity=".85">{Array.from({length:64},(_,i)=>{const a=i/64*Math.PI*2;return <path key={i} d={`M${320+length*zoom/2*Math.cos(a)} ${165+79*zoom*Math.sin(a)} Q${320+(length/2+7)*zoom*Math.cos(a+.015)} ${165+89*zoom*Math.sin(a+.015)} ${320+(length/2+12)*zoom*Math.cos(a+.025)} ${165+94*zoom*Math.sin(a+.025)}`}/>;})}</g>
 {measure&&<g className="movable-ruler" onPointerDown={e=>e.currentTarget.setPointerCapture(e.pointerId)} onPointerMove={drag} style={{cursor:'ns-resize',touchAction:'none'}} role="slider" tabIndex="0" aria-label="量尺垂直位置" aria-valuenow={Math.round(rulerY)} aria-valuemin="52" aria-valuemax="230" onKeyDown={e=>{if(['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();setRulerY(y=>Math.max(52,Math.min(230,y+(e.key==='ArrowUp'?-8:8))));}}}>
 <rect x={left-18} y={rulerY-19} width={length*zoom+36} height="40" fill="transparent"/>
 <path d={`M${left} ${rulerY}H${left+length*zoom}`} stroke="white" strokeWidth="2" strokeDasharray="6 4"/>
 {[left,left+length*zoom].map(x=><g key={x}><path d={`M${x} ${rulerY-15}V${rulerY+15}`} stroke="white"/><circle cx={x} cy={rulerY} r="7" fill="white" stroke="#173543"/></g>)}
 <rect x="213" y={rulerY-44} width="214" height="27" rx="5" fill="#fffffff0"/><text x="320" y={rulerY-25} textAnchor="middle" fill="#153a51" fontSize="14" fontWeight="700">圖上物體長：{ratio} 個比例尺線段</text></g>}
 <g transform={`translate(48 288) scale(${broken?1:zoom})`} stroke="white" fill="white"><path d="M0 -8V8M0 0H100M100 -8V8" strokeWidth="3"/><text x="50" y="28" textAnchor="middle" stroke="none" fontSize="20">{bar} μm</text></g>
 <text x="618" y="324" textAnchor="end" fill="#b9d3dc" fontSize="11">{measure?'拖曳量尺上下移動・亦可用方向鍵':'構造示意・依線段比值推算'}</text>
 </svg>;
}
