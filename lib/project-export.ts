import type {FFmpeg} from '@ffmpeg/ffmpeg';
import {type Asset,type Clip,type ProjectSettings,clipDuration,clipBox,projectDuration,projectSize} from './project';
export type GifRange={start:number;duration:number};
export async function encodeProject(ff:FFmpeg,assets:Asset[],clips:Clip[],settings:ProjectSettings,kind:'video'|'audio'|'gif',onStatus:(s:string)=>void,gifRange?:GifRange){
 const duration=projectDuration(clips),size=projectSize(assets,settings),ext=kind==='audio'?'wav':kind==='gif'?'gif':settings.format;
 const frameRate=kind==='gif'?12:30;
 if(kind==='gif'&&size.width>640){size.height=Math.max(2,Math.round(size.height*640/size.width/2)*2);size.width=640;}
 const start=kind==='gif'?(gifRange?.start??0):0;
 const exportDuration=kind==='gif'?(gifRange?.duration??Math.min(30,duration)):duration;
 if(kind==='gif'&&(!Number.isFinite(start)||!Number.isFinite(exportDuration)||start<0||exportDuration<.1||exportDuration>30||start+exportDuration>duration+1e-6))throw new Error('Choisissez un extrait GIF de 0,1 à 30 secondes dans le montage.');
 if(kind==='gif'&&!clips.some(c=>assets.some(a=>a.id===c.assetId&&a.kind!=='audio')&&c.start<start+exportDuration&&c.start+clipDuration(c)>start))throw new Error('Ajoutez une vidéo ou une image dans l’extrait GIF.');
 const output=`project.${ext}`,temporary:string[]=[];const used=assets.filter(a=>clips.some(c=>c.assetId===a.id));
 const inputs:string[]=[],audioAssets=new Set<string>();
 try{for(const [i,a] of used.entries()){onStatus(`Préparation du média ${i+1}/${used.length}…`);const name=`asset-${i}`;temporary.push(name);await ff.writeFile(name,new Uint8Array(await a.file.arrayBuffer()));inputs.push(...(a.kind==='image'?['-loop','1','-framerate',String(frameRate)]:a.kind==='video'?['-stream_loop','-1']:[]),'-i',name);if(kind!=='gif'&&a.kind==='audio'){audioAssets.add(a.id);}else if(kind!=='gif'&&a.kind==='video'){const probe=`probe-${i}.json`;temporary.push(probe);const code=await ff.ffprobe(['-v','error','-select_streams','a:0','-show_entries','stream=index','-of','json',name,'-o',probe]);if(code===0){const data=await ff.readFile(probe);if(JSON.parse(typeof data==='string'?data:new TextDecoder().decode(data)).streams?.length)audioAssets.add(a.id);}}}
 const graph:string[]=[];const visual=kind!=='audio',audio=kind!=='gif';let last='background';
 if(visual)graph.push(`color=c=black:s=${size.width}x${size.height}:r=${frameRate}:d=${duration},format=rgba[background]`);
 if(audio)graph.push(`anullsrc=r=48000:cl=stereo:d=${duration}[silence]`);
 const sounds=['[silence]'];let visualIndex=0;
 for(const [ci,c] of [...clips].sort((a,b)=>a.track-b.track).entries()){const asset=used.find(a=>a.id===c.assetId)!;const input=used.indexOf(asset),d=clipDuration(c);if(visual&&asset.kind!=='audio'){const box=clipBox(c,size.width,size.height);const vf=[...(asset.kind==='image'?[]:[`trim=start=${c.in}:duration=${c.out-c.in}`]),`setpts=(PTS-STARTPTS)/${asset.kind==='image'?1:c.speed}`,`fps=${frameRate}`,'format=rgba'];if(c.rotation===90)vf.push('transpose=1');if(c.rotation===180)vf.push('hflip','vflip');if(c.rotation===270)vf.push('transpose=2');if(c.fit==='cover')vf.push(`scale=${box.width}:${box.height}:force_original_aspect_ratio=increase`,`crop=${box.width}:${box.height}`);else vf.push(`scale=${box.width}:${box.height}:force_original_aspect_ratio=decrease`,`pad=${box.width}:${box.height}:(ow-iw)/2:(oh-ih)/2:color=black@0`);
 // The animated zoom is rendered in the live preview; keep the export graph
 // deterministic across FFmpeg.wasm builds by applying the base crop only.
 if(asset.kind==='video')vf.push('tpad=stop_mode=clone:stop_duration=30','loop=loop=1000:size=1:start=-1');vf.push('setsar=1',`colorchannelmixer=aa=${c.opacity/100}`,`setpts=PTS+${c.start}/TB`);graph.push(`[${input}:v]${vf.join(',')}[v${ci}]`);const next=`composite${visualIndex++}`;graph.push(`[${last}][v${ci}]overlay=x=${box.x}:y=${box.y}:eof_action=repeat:repeatlast=1:enable='gte(t,${c.start})*lt(t,${c.start+d})'[${next}]`);last=next;}
 if(audio&&audioAssets.has(c.assetId)&&c.volume>0){graph.push(`[${input}:a]atrim=start=${c.in}:end=${c.out},asetpts=PTS-STARTPTS,atempo=${c.speed},volume=${c.volume/100},aresample=48000,aformat=channel_layouts=stereo,adelay=${Math.round(c.start*1000)}:all=1[a${ci}]`);sounds.push(`[a${ci}]`);}}
 if(kind==='audio'&&sounds.length===1)throw new Error('Le montage ne contient pas de piste audio audible.');
 if(audio)graph.push(`${sounds.join('')}amix=inputs=${sounds.length}:duration=first:normalize=0,alimiter=limit=0.95:level=false:latency=true,atrim=duration=${duration}[outa]`);
 if(visual&&settings.text&&kind!=='gif'){const canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;const ctx=canvas.getContext('2d')!;ctx.font=`600 ${settings.textSize*size.height/720}px sans-serif`;ctx.textAlign='center';ctx.fillStyle=settings.color;ctx.shadowColor='#000';ctx.shadowBlur=4;ctx.fillText(settings.text,size.width/2,size.height*.85,size.width*.9);const blob=await new Promise<Blob|null>(r=>canvas.toBlob(r));if(!blob)throw new Error('Impossible de préparer le texte.');temporary.push('title.png');await ff.writeFile('title.png',new Uint8Array(await blob.arrayBuffer()));inputs.push('-i','title.png');graph.push(`[${last}][${used.length}:v]overlay=0:0[title]`);last='title';}
 if(kind==='gif'){
 // Quantize each frame without retaining the entire animation in WASM memory.
 graph.push(`[${last}]trim=start=${start}:duration=${exportDuration},setpts=PTS-STARTPTS,fps=12,scale=w='min(640,iw)':h=-2:flags=lanczos,split[gifframes][paletteframes]`);
 graph.push('[paletteframes]palettegen=stats_mode=single[palette]');
 graph.push('[gifframes][palette]paletteuse=new=1:dither=sierra2_4a[outv]');
 }else if(visual)graph.push(`[${last}]format=yuv420p[outv]`);
 const crf=settings.quality==='high'?18:settings.quality==='small'?32:24;
 const args=[...inputs,'-filter_complex',graph.join(';'),...(visual?['-map','[outv]']:[]),...(audio?['-map','[outa]']:['-an']),'-t',String(exportDuration),...(kind==='audio'?['-c:a','pcm_s16le']:kind==='gif'?['-c:v','gif','-loop','0']:['-c:v',ext==='mp4'?'libx264':'libvpx-vp9','-crf',String(crf),...(ext==='mp4'?['-preset','ultrafast','-pix_fmt','yuv420p','-movflags','+faststart']:['-b:v','0','-deadline','realtime','-cpu-used','8']),'-c:a',ext==='mp4'?'aac':'libopus']),output];
 onStatus(kind==='gif'?'Création du GIF…':'Encodage du montage multipiste…');temporary.push(output);const code=await ff.exec(args);if(code!==0)throw new Error('Échec de l’export. Essayez une résolution plus basse ou moins de pistes simultanées.');const bytes=await ff.readFile(output);if(typeof bytes==='string')throw new Error('Résultat invalide.');return {blob:new Blob([new Uint8Array(bytes)],{type:kind==='audio'?'audio/wav':kind==='gif'?'image/gif':`video/${ext}`}),ext};
 }finally{for(const name of temporary)try{await ff.deleteFile(name)}catch{}}
}
