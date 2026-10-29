import type {Metadata} from 'next';
import './globals.css';
import {siteURL,localPath} from '@/lib/site';
export const metadata:Metadata={metadataBase:new URL(siteURL),icons:{icon:{url:localPath('favicon.svg'),type:'image/svg+xml'}},alternates:{canonical:siteURL},title:{default:'Vixo — Vos vidéos, en toute simplicité.',template:'%s · Vixo'},description:'Coupez, recadrez, compressez et convertissez vos vidéos gratuitement dans votre navigateur. Sans inscription, sans filigrane.',robots:{index:true,follow:true}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="fr" suppressHydrationWarning><body>{children}</body></html>}
