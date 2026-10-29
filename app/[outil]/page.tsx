import Vixo from '@/components/vixo';
import {tools} from '@/lib/tools';
import {siteURL} from '@/lib/site';
import {notFound} from 'next/navigation';
export function generateStaticParams(){return tools.map(t=>({outil:t.slug}));}
export async function generateMetadata({params}:{params:Promise<{outil:string}>}){const {outil}=await params;const t=tools.find(t=>t.slug===outil);return {title:t?.title,description:t?.description,alternates:{canonical:`${siteURL}${outil}/`}};}
export default async function Tool({params}:{params:Promise<{outil:string}>}){const {outil}=await params;const t=tools.find(t=>t.slug===outil);if(!t)notFound();return <Vixo initialTool={t.panel} toolTitle={t.title} toolDescription={t.description}/>}
