import { Suspense } from 'react';
import QuranClient from './client';

export default function QuranPage(){
  return (
    <Suspense fallback={<div className="page"><div className="wrap"><div className="card" style={{padding:'24px',textAlign:'center'}}>جاري تحميل القرآن…</div></div></div>}>
      <QuranClient />
    </Suspense>
  );
}
