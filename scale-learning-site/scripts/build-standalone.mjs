import {build} from 'esbuild';
import {writeFileSync,readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const project=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const result=await build({
  absWorkingDir:project,
  entryPoints:['src/main.jsx'],
  outfile:'standalone.js',
  bundle:true,
  format:'iife',
  platform:'browser',
  target:['es2020'],
  jsx:'automatic',
  minify:true,
  write:false,
  define:{'process.env.NODE_ENV':'"production"','import.meta.env.BASE_URL':'"./scale-learning-site/public/"'},
  legalComments:'none'
});
const js=result.outputFiles.find(f=>f.path.endsWith('.js')).text.replace(/<\/script/gi,'<\\/script');
const css=result.outputFiles.find(f=>f.path.endsWith('.css')).text;
const html=`<!doctype html>
<html lang="zh-Hant">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#087f82"><title>尺度探索站</title>
<style>${css}</style></head>
<body><div id="root"></div><noscript>請開啟瀏覽器的 JavaScript 功能，以使用尺度探索站。</noscript>
<script>${js}</script>
</body></html>`;
const output=resolve(project,'..','index.html');
writeFileSync(output,html,'utf8');
console.log(JSON.stringify({output,bytes:Buffer.byteLength(html),externalScripts:0,externalStyles:0,imageFolder:'scale-learning-site/public/designs'},null,2));
