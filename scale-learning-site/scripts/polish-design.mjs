import {readFileSync,writeFileSync} from 'node:fs';
let s=readFileSync('src/Art.jsx','utf8');const a=s.indexOf('export function ScaleArt('),b=s.indexOf('export function Motif(',a);s=s.slice(0,a)+"export {ScaleArt} from './ScientificArt';\n"+s.slice(b);writeFileSync('src/Art.jsx',s);
s=readFileSync('src/DesignSystem.jsx','utf8');s=s.replace('0:[440,60,742,440]','0:[639,110,543,381]').replace('3:[656,115,526,165]','3:[850,121,332,155]').replace('5:[610,108,572,140]','5:[687,112,495,98]').replace('10:[392,110,790,363]','10:[398,113,784,355]');
s=s.replace("return <div className={`hero-art ${className}`} aria-hidden=\"true\"><Photo", "return <div className={`hero-art ${className}`} aria-hidden=\"true\"><Photo");
s=s.replace('[267,451,87,112]','[267,466,87,98]');
// Avoid original mockup selection marks at the top edge of the cell picture.
s=s.replace('[307,435,126,110]','[310,445,116,100]');
writeFileSync('src/DesignSystem.jsx',s);
s=readFileSync('src/ActivitiesRev.jsx','utf8');s=s.replace('[682,219,173,173]','[713,247,112,107]').replace('[881,185,247,237]','[906,211,195,190]').replace('[683,220,171,171]','[713,247,112,107]').replace('[883,188,245,232]','[906,211,195,190]');
s=s.replace('[870,387,238,209]','[876,392,223,186]');
writeFileSync('src/ActivitiesRev.jsx',s);
s=readFileSync('src/Activities.jsx','utf8').replace('<span className="snail-measure"><i/>6 個線段長度<i/></span><span className="snail-unit"><i/>1 個線段</span>','');writeFileSync('src/Activities.jsx',s);
s=readFileSync('src/AssessmentGames.jsx','utf8');s=s.replace('[212,363,377,237]','[213,362,377,207]');
s=s.replace('{q.art&&<ScaleArt ratio={4} bar={25} measure/>}',`{q.art?<ScaleArt ratio={4} bar={25} measure/>:<figure className="exam-context"><Photo page={q.page===6?6:q.page===5?5:q.page===3?3:2} region={q.page===6?[370,602,284,109]:q.page===5?[645,252,430,332]:q.page===3?[43,418,1099,129]:[404,389,694,193]} label="本題觀察情境示意"/><figcaption>觀察圖片提供的線索，再根據題目判斷。</figcaption></figure>}`);
writeFileSync('src/AssessmentGames.jsx',s);
s=readFileSync('src/ResultsRev.jsx','utf8');s=s.replace('<HeroArt page={10}/>','<HeroArt page={10}/>{!done.slice(1,10).every(Boolean)&&<div className="journey-status-stamp">探索進行中<small>持續觀察，繼續發現</small></div>}');writeFileSync('src/ResultsRev.jsx',s);
console.log('Image regions and calibrated draggable ruler updated.');
