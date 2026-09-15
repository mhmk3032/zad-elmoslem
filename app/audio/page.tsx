'use client';
import {useEffect,useMemo,useState} from 'react';
import {surahNames} from '../../lib/api';

type Reciter={id:string;name:string;edition?:string;url?:string;featured?:boolean};
export default function Audio(){
  const [reciters,setReciters]=useState<Reciter[]>([]),[r,setR]=useState<Reciter|null>(null),[chapter,setChapter]=useState(1),[url,setUrl]=useState('');
  useEffect(()=>{fetch('/api/quran/reciters').then(x=>x.json()).then(d=>{const list=d.reciters||[];setReciters(list);if(list[0])setR(list[0])}).catch(()=>{})},[]);
  useEffect(()=>{if(!r)return;fetch(`/api/quran/audio?reciter=${encodeURIComponent(r.id)}&chapter=${chapter}`).then(x=>x.json()).then(d=>setUrl(d.url)).catch(()=>{})},[r,chapter]);
  useEffect(()=>{if(r)localStorage.setItem('zad-reciter',r.id)},[r]);
  useEffect(()=>{const saved=localStorage.getItem('zad-reciter');if(saved&&reciters.length){const found=reciters.find(x=>x.id===saved);if(found)setR(found)}},[reciters]);
  const selectedName=r?.name||'اختر القارئ';
  return <div className="page"><div className="wrap"><div className="page-head"><div><h1>🎧 مركز التلاوات</h1><p className="muted">اختر القارئ والسورة واستمع مباشرة.</p></div></div>
    <div className="audio-feature"><div><div className="eyebrow light">القارئ المختار</div><h2>{selectedName}</h2><p>{surahNames[chapter-1]} · سورة رقم {chapter}</p>{url&&<audio controls src={url} style={{width:'100%'}} preload="none"/>}</div>
      <div className="audio-controls"><label>القارئ</label><select value={r?.id||''} onChange={e=>setR(reciters.find(x=>x.id===e.target.value)||null)}><option value="">اختر القارئ</option>{reciters.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><label style={{display:'block',marginTop:14}}>السورة</label><select value={chapter} onChange={e=>setChapter(Number(e.target.value))}>{surahNames.map((name,i)=><option value={i+1} key={i}>{i+1} — {name}</option>)}</select></div>
    </div><div className="section-title-row"><h2 className="section-title">القراء</h2><span className="badge">{reciters.length} قارئ</span></div>
    <div className="reciter-dropdown card"><div><b>🎙️ اختر القارئ</b><p className="muted">القائمة تضم مجموعة أكبر من القراء، والاختيار محفوظ على جهازك.</p></div><select value={r?.id||''} onChange={e=>setR(reciters.find(x=>x.id===e.target.value)||null)}>{reciters.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></div>
  </div></div>
}
