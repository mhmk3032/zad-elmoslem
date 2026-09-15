import {NextResponse} from 'next/server';
export async function GET(){
 try{const r=await fetch('https://api.alquran.cloud/v1/surah',{next:{revalidate:86400}}); const j=await r.json(); return NextResponse.json({chapters:j.data||[]});}
 catch{return NextResponse.json({chapters:[]},{status:502})}
}
