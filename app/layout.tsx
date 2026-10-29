import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://vixo-video-editor.tunedpig4096.chatgpt.site'),alternates:{canonical:'/'},title:{default:'Vixo — Vos vidéos, en toute simplicité.',template:'%s · Vixo'},description:'Coupez, recadrez, compressez et convertissez vos vidéos gratuitement dans votre navigateur. Sans inscription, sans filigrane.',robots:{index:true,follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="fr" suppressHydrationWarning><body>{children}</body></html>}
