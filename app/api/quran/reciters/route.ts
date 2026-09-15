import {NextResponse} from 'next/server';
import {reciters as fallback} from '../../../../lib/api';

const preferred = [
  'ياسر الدوسري','ماهر المعيقلي','مشاري العفاسي','عبدالرحمن السديس','سعود الشريم',
  'محمد صديق المنشاوي','محمود خليل الحصري','عبدالباسط عبدالصمد','أحمد بن علي العجمي','سعد الغامدي',
  'فارس عباد','خالد الجليل','ناصر القطامي','إدريس أبكر','هاني الرفاعي','صلاح بو خاطر',
  'عبدالله عواد الجهني','علي جابر','محمد جبريل','إسلام صبحي'
];

export async function GET(){
  try {
    const r = await fetch('https://mp3quran.net/api/v3/reciters?language=ar', { next:{revalidate:86400} });
    if(!r.ok) throw new Error('RECITERS_API');
    const j = await r.json();
    const all = Array.isArray(j.reciters) ? j.reciters : [];
    const mapped = preferred.map(name => {
      const x = all.find((item:any) => item.name === name || item.name?.replaceAll(' ','') === name.replaceAll(' ',''));
      if(!x) return null;
      const m = (x.moshaf || []).find((v:any)=>v.server && String(v.surah_list||'').split(',').includes('114')) || (x.moshaf||[]).find((v:any)=>v.server);
      if(!m) return null;
      return {id:String(x.id),name:x.name,edition:m.name,url:String(m.server).replace(/\/$/,''),featured:true};
    }).filter(Boolean);
    return NextResponse.json({reciters:mapped.length >= 10 ? mapped : fallback});
  } catch {
    return NextResponse.json({reciters:fallback,offline:true});
  }
}
