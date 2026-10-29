import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
await mkdir('public/ffmpeg',{recursive:true});
await copyFile('node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js','public/ffmpeg/ffmpeg-core.js');
const data=await readFile('node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.wasm');const size=Math.ceil(data.length/2);
for(let i=0;i<2;i++)await writeFile(`public/ffmpeg/core-${i}.bin`,data.subarray(i*size,(i+1)*size));
