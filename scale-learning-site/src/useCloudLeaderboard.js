import {useEffect,useState,useCallback} from 'react';
import {GAS_ENDPOINT} from './sync-config';

export function useCloudLeaderboard(enabled,revision){
 const [entries,setEntries]=useState([]),[status,setStatus]=useState('loading'),[refreshId,setRefreshId]=useState(0);
 const refresh=useCallback(()=>setRefreshId(n=>n+1),[]);
 useEffect(()=>{
  if(!enabled)return;let active=true,busy=false;const controller=new AbortController();
  async function read(){
   if(busy)return;busy=true;setStatus('loading');
   try{
    const response=await fetch(`${GAS_ENDPOINT}?action=leaderboard&t=${Date.now()}`,{signal:AbortSignal.any([controller.signal,AbortSignal.timeout(20000)])});
    if(!response.ok)throw new Error('排行榜讀取失敗');const result=await response.json();
    if(!result.ok||!Array.isArray(result.entries))throw new Error('排行榜資料格式不正確');
    const rows=result.entries.filter(r=>typeof r.classroom==='string'&&typeof r.seat==='string'&&Number.isFinite(r.score));
    if(active){setEntries(rows);setStatus('ready');}
   }catch{if(active){setEntries([]);setStatus('error');}}finally{busy=false;}
  }
  read();const timer=setInterval(read,30000);window.addEventListener('focus',read);
  return()=>{active=false;controller.abort();clearInterval(timer);window.removeEventListener('focus',read);};
 },[enabled,revision,refreshId]);
 return {entries,status,refresh};
}
