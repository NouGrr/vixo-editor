export const basePath=process.env.NEXT_PUBLIC_BASE_PATH || '';
export const siteURL='https://nougrr.github.io/vixo-editor/';
export function localPath(path:string){return `${basePath}/${path.replace(/^\/+/, '')}`;}
