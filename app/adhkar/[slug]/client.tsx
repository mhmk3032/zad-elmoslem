'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {getAdhkarCategory} from '../../../lib/adhkar/data';

export default function AdhkarCategory({slug}:{slug:string}){
 const category=getAdhkarCategory(slug);
 if(!category)return <div className="page"><div className="wrap"><div className="card"><h1>القسم غير موجود</h1><Link className="btn" href="/adhkar">العودة للأذكار</Link></div></div></div>;
 const key=`adhkar-progress-${category.slug}`;
 const [counts,setCounts]=useState<number[]>(()=>category.items.map(()=>0));
 const [fav,setFav]=useState<string[]>([]);
 const [search,setSearch]=useState('');
 const [index,setIndex]=useState(0);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(key)||'null'); if(Array.isArray(saved))setCounts(saved); const f=JSON.parse(localStorage.getItem('adhkar-favorites')||'[]');if(Array.isArray(f))setFav(f); const params=new URLSearchParams(location.search); const i=Number(params.get('i')); const last=JSON.parse(localStorage.getItem('adhkar-last')||'null');setIndex(Number.isInteger(i)&&i>=0?Math.min(i,category.items.length-1):last?.slug===category.slug?Math.min(last.index||0,category.items.length-1):0)}catch{}}
 ,[category.slug,key,category.items.length]);
 useEffect(()=>{localStorage.setItem(key,JSON.stringify(counts));localStorage.setItem('adhkar-last',JSON.stringify({slug:category.slug,index}))},[counts,index,key,category.slug]);
 useEffect(()=>{localStorage.setItem('adhkar-favorites',JSON.stringify(fav))},[fav]);
 const done=counts.reduce((a,n,i)=>a+(n>=category.items[i].count?1:0),0);
 const progress=Math.round(done/category.items.length*100);
 const filtered=useMemo(()=>category.items.map((x,i)=>({x,i})).filter(({x})=>(x.title+' '+x.text+' '+x.source).includes(search.trim())),[category.items,search]);
 const add=(i:number)=>{setCounts(a=>a.map((n,j)=>j===i?Math.min(n+1,category.items[j].count):n));setIndex(i)};
 const reset=(i:number)=>setCounts(a=>a.map((n,j)=>j===i?0:n));
 const toggleFav=(id:string)=>setFav(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
 const go=(n:number)=>{const ni=Math.max(0,Math.min(category.items.length-1,index+n));setIndex(ni);window.scrollTo({top:0,behavior:'smooth'})};
 return <div className="page"><div className="wrap">
  <div className="page-head"><div><Link className="muted" href="/adhkar">← كل الأقسام</Link><h1>{category.icon} {category.title}</h1><p className="muted">{category.description}</p></div><div className="badge">{category.items.length} ذكرًا</div></div>
  <div className="progress-card card"><div className="progress-top"><b>نسبة الإنجاز</b><strong>{progress}%</strong></div><div className="progress"><span style={{width:`${progress}%`}}/></div><small className="muted">تم إنجاز {done} من {category.items.length}</small></div>
  <div className="search full"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 ابحث داخل الأذكار..."/><button className="chip" onClick={()=>setSearch('')}>مسح</button></div>
  <div className="dhikr-list">{filtered.map(({x,i})=>{const complete=counts[i]>=x.count;return <article className={`card zikr ${complete?'completed':''}`} key={x.id}>
    <div className="zikr-head"><span className="eyebrow">الذكر {i+1}</span><button className={`favorite ${fav.includes(x.id)?'active':''}`} onClick={()=>toggleFav(x.id)} aria-label="المفضلة">{fav.includes(x.id)?'★':'☆'}</button></div>
    <h2>{x.title}</h2><p className="arabic zikr-text">{x.text}</p><div className="source"><span>📖 {x.source}</span><span>🔢 {x.countLabel}</span></div>
    <div className="counter"><button className="btn counter-btn" onClick={()=>add(i)} disabled={complete}>{complete?'✓ تم الإنجاز':'اضغط للتكرار'}</button><span className="count">{counts[i]} / {x.count}</span><button className="chip" onClick={()=>reset(i)}>🔄 إعادة</button></div>
  </article>})}</div>
  {!search&&<div className="pager"><button className="chip" disabled={index===0} onClick={()=>go(-1)}>→ السابق</button><b>{index+1} / {category.items.length}</b><button className="chip" disabled={index===category.items.length-1} onClick={()=>go(1)}>التالي ←</button></div>}
 </div></div>
}
