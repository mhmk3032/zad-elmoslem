import {NextRequest,NextResponse} from 'next/server';
import {reciters as fallback} from '../../../../lib/api';

export async function GET(req:NextRequest){
  const id=req.nextUrl.searchParams.get('reciter')||'yasser';
  const chapter=Number(req.nextUrl.searchParams.get('chapter')||1);
  const local=fallback.find(x=>x.id===id);
  try {
    let server=local?.url;
    let name=local?.name;
    if(!server || /^\d+$/.test(id)) {
      const r=await fetch(`https://mp3quran.net/api/v3/reciters?language=ar&reciter=${encodeURIComponent(id)}`,{next:{revalidate:86400}});
      const j=await r.json(); const x=j.reciters?.[0];
      const m=(x?.moshaf||[]).find((v:any)=>v.server && String(v.surah_list||'').split(',').includes(String(chapter))) || x?.moshaf?.[0];
      if(m?.server){server=String(m.server).replace(/\/$/,'');name=x.name;}
    }
    if(!server) throw new Error('AUDIO_NOT_FOUND');
    const n=String(chapter).padStart(3,'0');
    return NextResponse.json({reciter:name||id,url:`${server}/${n}.mp3`,chapter});
  } catch {
    const r=fallback.find(x=>x.id===id)||fallback[0];
    const n=String(chapter).padStart(3,'0');
    return NextResponse.json({reciter:r.name,url:`${r.url}/${n}.mp3`,chapter,offline:true});
  }
}
