'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {surahNames} from '../../lib/api';

function normalizeArabic(value:string){
  return value.normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g,'').replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ة/g,'ه').replace(/[ـ]/g,'').replace(/\s+/g,' ').trim();
}

export default function QuranClient(){
  const params=useSearchParams();
  const initial=params.get('search')||'';
  const [s,setS]=useState<any[]>([]),[q,setQ]=useState(initial),[results,setResults]=useState<any[]>([]),[loading,setLoading]=useState(false),[error,setError]=useState('');
  const arr=s.length?s:surahNames.map((name,i)=>({number:i+1,name,nameArabic:name,numberOfAyahs:0}));

  useEffect(()=>{fetch('/api/quran/chapters').then(r=>r.json()).then(d=>setS(d.chapters||[])).catch(()=>{})},[]);

  useEffect(()=>{
    const value=normalizeArabic(q);
    if(!value){setResults([]);setError('');setLoading(false);return;}
    const t=setTimeout(async()=>{
      setLoading(true);setError('');
      try{
        const r=await fetch(`/api/quran/search?q=${encodeURIComponent(value)}`);
        const d=await r.json();
        if(!r.ok) throw new Error(d.error||'تعذر البحث');
        setResults(d.results||[]);
      }catch(e:any){setResults([]);setError(e?.message||'تعذر البحث الآن');}
      finally{setLoading(false)}
    },350);
    return()=>clearTimeout(t);
  },[q]);

  const visibleResults=useMemo(()=>results.slice(0,20),[results]);

  return <div className="page"><div className="wrap">
    <div className="page-head"><div><h1>القرآن الكريم</h1><p className="muted">المصحف كاملًا مع البحث والاستماع وحفظ آخر موضع.</p></div><Link className="btn" href="/audio">🎧 التلاوات</Link></div>
    <div className="search full"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Escape'&&setQ('')} placeholder="🔎 ابحث عن كلمة أو آية في القرآن..." aria-label="البحث في القرآن"/>{q&&<button className="chip" onClick={()=>setQ('')}>مسح</button>}</div>
    {loading&&<div className="search-status muted">جاري البحث في القرآن…</div>}
    {error&&<div className="notice">⚠️ {error}<br/><small>تأكد من اتصال الإنترنت وحاول مرة أخرى.</small></div>}
    {!loading&&!error&&q.trim()&&!visibleResults.length&&<div className="card search-empty">لم نجد نتائج مطابقة لـ <b>«{q}»</b>. جرّب كلمة أخرى أو اكتب جزءًا من الآية.</div>}
    {visibleResults.length>0&&<div className="results card"><div className="results-head"><h3>نتائج البحث</h3><span className="badge">{results.length} نتيجة</span></div>{visibleResults.map((x:any,i)=><Link className="result" href={`/quran/${x.surah?.number||1}`} key={`${x.number}-${i}`}><span>{x.text}</span><small>{x.surah?.name||surahNames[(x.surah?.number||1)-1]} · الآية {x.numberInSurah}</small></Link>)}</div>}
    {!q.trim()&&<div className="surahs">{arr.map((x:any)=>{const id=x.number||x.id;return <Link href={`/quran/${id}`} className="surah" key={id}><span className="num">{id}</span><div><b>{surahNames[id-1] || x.nameArabic || x.name || x.name_arabic}</b><div className="muted">{x.numberOfAyahs||x.verses_count||''} آية</div></div></Link>})}</div>}
  </div></div>
}
