import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {name:'زاد المسلم',short_name:'زاد المسلم',description:'رفيقك اليومي للقرآن والذكر والعبادة.',start_url:'/',display:'standalone',background_color:'#f5f2e9',theme_color:'#0d4d3b',lang:'ar',dir:'rtl',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'maskable'}]};
}
