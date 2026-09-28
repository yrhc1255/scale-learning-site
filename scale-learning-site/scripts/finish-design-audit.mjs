import {readFileSync,writeFileSync} from 'node:fs';
let s=readFileSync('src/ActivitiesRev.jsx','utf8').replace('<select value={reason}', '<select aria-label="觀察後，我認為" value={reason}');writeFileSync('src/ActivitiesRev.jsx',s);
s=readFileSync('src/DesignSystem.jsx','utf8').replace('0:[639,110,543,381]','0:[0,60,1182,440]');writeFileSync('src/DesignSystem.jsx',s);
