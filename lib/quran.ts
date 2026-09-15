let cached:{token:string;expiresAt:number}|null=null;
const env=()=>process.env.QF_ENV==='production'?'production':'prelive';
const bases={prelive:{auth:'https://prelive-oauth2.quran.foundation',api:'https://apis-prelive.quran.foundation'},production:{auth:'https://oauth2.quran.foundation',api:'https://apis.quran.foundation'}};
async function token(){
  if(cached && Date.now()<cached.expiresAt) return cached.token;
  const id=process.env.QF_CLIENT_ID, secret=process.env.QF_CLIENT_SECRET;
  if(!id||!secret) throw new Error('QURAN_API_NOT_CONFIGURED');
  const b=bases[env()];
  const r=await fetch(`${b.auth}/oauth2/token`,{method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials&scope=content',cache:'no-store'});
  if(!r.ok) throw new Error(`QURAN_TOKEN_${r.status}`);
  const d=await r.json(); cached={token:d.access_token,expiresAt:Date.now()+Math.max(60,(d.expires_in||3600)-120)*1000}; return cached.token;
}
export async function qf(path:string,params?:Record<string,string|number|boolean>){
  const t=await token(); const b=bases[env()]; const u=new URL(`${b.api}/content/api/v4${path}`);
  Object.entries(params||{}).forEach(([k,v])=>u.searchParams.set(k,String(v)));
  let r=await fetch(u,{headers:{'x-auth-token':t,'x-client-id':process.env.QF_CLIENT_ID!},cache:'no-store'});
  if(r.status===401){cached=null; const t2=await token(); r=await fetch(u,{headers:{'x-auth-token':t2,'x-client-id':process.env.QF_CLIENT_ID!},cache:'no-store'});}
  if(!r.ok) throw new Error(`QURAN_API_${r.status}`); return r.json();
}
