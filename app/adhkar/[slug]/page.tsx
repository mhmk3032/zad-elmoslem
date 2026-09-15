import {notFound} from 'next/navigation';
import Client from './client';
import {getAdhkarCategory} from '../../../lib/adhkar/data';

export default async function Page({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 if(!getAdhkarCategory(slug)) notFound();
 return <Client slug={slug}/>;
}
