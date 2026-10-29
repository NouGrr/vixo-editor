import {tools} from '@/lib/tools';
export const dynamic='force-static';
export default function sitemap(){return ['',...tools.map(t=>t.slug)].map(p=>({url:`https://vixo-video-editor.tunedpig4096.chatgpt.site/${p}`,changeFrequency:'monthly' as const,priority:p?0.8:1}));}
