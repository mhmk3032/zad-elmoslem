'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {adhkarCategories} from '../../lib/adhkar/data';

export default function AdhkarHome(){
 const [resume,setResume]=useState<{slug:string;index:number}|null>(null);
 useEffect(()=>{try{const x=localStorage.getItem('adhkar-last'); if(x)setResume(JSON.parse(x))}catch{}} ,[]);
 const last=resume?adhkarCategories.find(c=>c.slug===resume.slug):null;
 return <div className="page"><div className="wrap">
  <div className="page-head"><div><h1>📿 قسم الأذكار</h1><p className="muted">أذكار وأدعية منظمة حسب الأبواب، مع النص والعدد والمصدر وعداد مستقل.</p></div><div className="badge">{adhkarCategories.length} قسمًا</div></div>
  {last&&<div className="resume card"><div><b>متابعة {last.title}</b><p className="muted">آخر مكان وصلت إليه: الذكر رقم {(resume?.index||0)+1} من {last.items.length}</p></div><Link className="btn" href={`/adhkar/${last.slug}?i=${resume?.index||0}`}>متابعة الآن ←</Link></div>}
  <div className="adhkar-grid">{adhkarCategories.map(c=><Link key={c.slug} href={`/adhkar/${c.slug}`} className="card adhkar-category"><span className="icon">{c.icon}</span><div><h2>{c.title}</h2><p className="muted">{c.items.length} أذكار</p><small className="muted">فتح القسم ←</small></div></Link>)}</div>
 </div></div>
}
