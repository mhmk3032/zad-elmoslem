'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
const items=[['⌂','الرئيسية','/'],['📖','القرآن','/quran'],['🤲','الأذكار','/adhkar'],['🌿','وردي','/daily'],['⚙','الإعدادات','/settings']];
export default function MobileNav(){const path=usePathname();return <div className="mobile-nav">{items.map(([icon,label,href])=><Link className={path===href|| (href!=='/'&&path.startsWith(href))?'active':''} href={href} key={href}><span>{icon}</span><small>{label}</small></Link>)}</div>}
