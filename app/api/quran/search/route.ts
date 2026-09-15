import {NextRequest,NextResponse} from 'next/server';

function normalizeArabic(value:string){
  return value
    .normalize('NFKC')
    .replace(/[\u064B-\u065F\u0670]/g,'')
    .replace(/[إأآٱ]/g,'ا')
    .replace(/ى/g,'ي')
    .replace(/ؤ/g,'و')
    .replace(/ئ/g,'ي')
    .replace(/ة/g,'ه')
    .replace(/[ـ]/g,'')
    .replace(/\s+/g,' ')
    .trim();
}

export async function GET(req:NextRequest){
  const raw=req.nextUrl.searchParams.get('q')||'';
  const q=raw.trim();
  if(!q) return NextResponse.json({results:[],total:0});
  if(q.length>80) return NextResponse.json({results:[],total:0,error:'البحث طويل جدًا'});

  const editions=['quran-uthmani','ar.quran-uthmani'];
  for(const edition of editions){
    try{
      const url=`https://api.alquran.cloud/v1/search/${encodeURIComponent(q)}/all/${edition}`;
      const r=await fetch(url,{next:{revalidate:3600},headers:{Accept:'application/json'}});
      if(!r.ok) continue;
      const j=await r.json();
      const matches=Array.isArray(j?.data?.matches)?j.data.matches:[];
      return NextResponse.json({
        results:matches.map((x:any)=>({
          text:x.text||'',
          number:x.number,
          numberInSurah:x.numberInSurah,
          surah:{number:x.surah?.number,name:x.surah?.name||''}
        })),
        total:matches.length
      });
    }catch{}
  }

  // The external search service can occasionally be unavailable. Return a
  // useful, explicit status instead of silently pretending there are no hits.
  return NextResponse.json({results:[],total:0,error:'تعذر الوصول إلى خدمة البحث الآن'},{status:502});
}
