'use client';
import {useEffect,useState} from 'react';
const books=[['bukhari','صحيح البخاري'],['muslim','صحيح مسلم'],['abu_dawud','سنن أبي داود'],['tirmidhi','جامع الترمذي'],['nasai','سنن النسائي'],['ibn_majah','سنن ابن ماجه'],['malik','موطأ مالك'],['nawawi40','الأربعون النووية'],['qudsi40','الأحاديث القدسية']];
export default function Hadith(){const [book,setBook]=useState('bukhari'),[q,setQ]=useState(''),[items,setItems]=useState<any[]>([]),[loading,setLoading]=useState(false),[page,setPage]=useState(1),[pages,setPages]=useState(1),[total,setTotal]=useState(0),[offline,setOffline]=useState(false);
 const load=(b=book,query=q,p=1)=>{setLoading(true);fetch(`/api/hadith?book=${b}&q=${encodeURIComponent(query)}&page=${p}&limit=30`).then(r=>r.json()).then(d=>{setItems(d.items||[]);setPages(d.pages||1);setTotal(d.total||0);setOffline(!!d.offline);setPage(p)}).finally(()=>setLoading(false))};
 useEffect(()=>{load('bukhari','',1)},[]);
 return <div className="page"><div className="wrap"><div className="page-head"><div><h1>📚 مكتبة الحديث</h1><p className="muted">كتب حديث متعددة، بحث، صفحات، ومراجع لكل حديث.</p></div><div className="badge">{total.toLocaleString('ar-EG')} نتيجة</div></div>
 <div className="filters"><select value={book} onChange={e=>{setBook(e.target.value);load(e.target.value,q,1)}}>{books.map(b=><option value={b[0]} key={b[0]}>{b[1]}</option>)}</select><div className="search full"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load(book,q,1)} placeholder="ابحث داخل الكتاب..."/><button className="btn" onClick={()=>load(book,q,1)}>بحث</button></div></div>
 {loading&&<div className="card">جاري تحميل الأحاديث...</div>}
 <div className="grid">{items.map((x:any,i)=><article className="card" key={i}><div className="eyebrow">{x.source} · {x.reference}</div><h3>{x.title}</h3><p className="arabic hadith-text">{x.text}</p>{x.reference&&<div className="muted">رقم الحديث: {x.reference}</div>}</article>)}</div>
 <div className="pager"><button className="chip" disabled={page<=1||loading} onClick={()=>load(book,q,page-1)}>السابق</button><span>صفحة {page} من {pages}</span><button className="chip" disabled={page>=pages||loading} onClick={()=>load(book,q,page+1)}>التالي</button></div>
 <div className="notice">{offline?"تعذر الوصول لمصدر الأحاديث الآن، لذلك ظهرت نسخة احتياطية محدودة من الأحاديث المحفوظة داخل الموقع.":"تم تحميل الأحاديث من مصدر عربي مع إبقاء اسم الكتاب ورقم الحديث. لا يعتمد الموقع على API مباشر من المتصفح."}</div>
 </div></div>}
