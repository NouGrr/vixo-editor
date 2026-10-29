import {siteURL} from '@/lib/site';
import {tools} from '@/lib/tools';
export const dynamic='force-static';
export default function sitemap(){return ['',...tools.map(t=>t.slug)].map(p=>({url:`${siteURL}${p ? `${p}/` : ''}`,changeFrequency:'monthly' as const,priority:p?0.8:1}));}
