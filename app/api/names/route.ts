import {NextResponse} from 'next/server';
export async function GET(){try{const r=await fetch('https://api.aladhan.com/v1/asmaAlHusna',{next:{revalidate:604800}}); const j=await r.json(); return NextResponse.json(j.data||[]);}catch{return NextResponse.json([],{status:502})}}
