import {NextRequest,NextResponse} from 'next/server';

type HadithItem = {
 title:string;
 text:string;
 source:string;
 reference:string;
 grade?:string;
};

const BOOKS:Record<string,{name:string;slug:string}>={
 bukhari:{name:'صحيح البخاري',slug:'bukhari'},
 muslim:{name:'صحيح مسلم',slug:'muslim'},
 abu_dawud:{name:'سنن أبي داود',slug:'abudawud'},
 tirmidhi:{name:'جامع الترمذي',slug:'tirmidhi'},
 nasai:{name:'سنن النسائي',slug:'nasai'},
 ibn_majah:{name:'سنن ابن ماجه',slug:'ibnmajah'},
 malik:{name:'موطأ مالك',slug:'malik'},
 nawawi40:{name:'الأربعون النووية',slug:'nawawi40'},
 qudsi40:{name:'الأحاديث القدسية الأربعون',slug:'qudsi40'},
};

const fallback=[
 {title:'إنما الأعمال بالنيات',text:'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.',source:'صحيح البخاري',reference:'1'},
 {title:'بني الإسلام على خمس',text:'بُنِيَ الإِسْلَامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَالحَجِّ، وَصَوْمِ رَمَضَانَ.',source:'صحيح البخاري',reference:'8'},
 {title:'من لا يرحم لا يرحم',text:'مَنْ لَا يَرْحَمُ لَا يُرْحَمُ.',source:'صحيح البخاري',reference:'5997'},
 {title:'الدين النصيحة',text:'الدِّينُ النَّصِيحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ، وَلِكِتَابِهِ، وَلِرَسُولِهِ، وَلِأَئِمَّةِ المُسْلِمِينَ وَعَامَّتِهِمْ.',source:'صحيح مسلم',reference:'55'},
 {title:'المسلم من سلم المسلمون من لسانه ويده',text:'المُسْلِمُ مَنْ سَلِمَ المُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ، وَالمُهَاجِرُ مَنْ هَجَرَ مَا نَهَى اللَّهُ عَنْهُ.',source:'صحيح البخاري',reference:'10'},
];

function normalize(raw:any,bookName:string):HadithItem[]{
 const source=raw?.data ?? raw;
 const arr=Array.isArray(source?.items)?source.items:Array.isArray(source)?source:[];
 return arr.map((x:any,i:number)=>{
   const text=x.text || x.arabic?.text || x.arabic?.hadith || x.arabic?.fullHadith || x.hadith || '';
   const reference=x.hadithNumberInBook ?? x.hadithNumber ?? x.number ?? x.id ?? x.reference?.hadithNumberInBook ?? x.reference?.number ?? '';
   return {
     title:x.title || x.chapter?.arabic?.name || x.chapterName || `حديث ${reference||i+1}`,
     text,
     source:x.collection || x.book || bookName,
     reference:String(reference),
     grade:x.grade || x.arabic?.grade || '',
   };
 }).filter((x:any)=>x.text);
}

export async function GET(req:NextRequest){
 const p=req.nextUrl.searchParams;
 const book=p.get('book')||'bukhari';
 const q=(p.get('q')||'').trim();
 const page=Math.max(1,Number(p.get('page')||1));
 const limit=Math.min(50,Math.max(1,Number(p.get('limit')||30)));
 const meta=BOOKS[book]||BOOKS.bukhari;
 try{
   const r=await fetch(`https://i-muslim.com/api/v1/translations/hadith/${meta.slug}/ar`,{next:{revalidate:86400}});
   if(!r.ok) throw new Error(`provider ${r.status}`);
   const j=await r.json();
   let items=normalize(j,meta.name);
   if(q) items=items.filter((x:HadithItem)=>(`${x.title} ${x.text} ${x.source} ${x.reference}`).includes(q));
   const total=items.length;
   const start=(page-1)*limit;
   return NextResponse.json({items:items.slice(start,start+limit),total,page,limit,pages:Math.max(1,Math.ceil(total/limit)),book:meta,offline:false});
 }catch{
   const items=q?fallback.filter(x=>(`${x.title} ${x.text} ${x.source} ${x.reference}`).includes(q)):fallback;
   return NextResponse.json({items,total:items.length,page:1,limit:items.length,pages:1,book:meta,offline:true});
 }
}
