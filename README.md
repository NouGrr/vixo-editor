# Vixo

MVP de montage vidéo local en français. Next.js App Router, TypeScript, Tailwind CSS et Lucide. 

## Démarrage

Node.js 22 ou supérieur :

```sh
npm ci
npm run dev
```

Le moteur FFmpeg mono-thread est servi depuis `public/ffmpeg` : aucun téléversement vidéo, ni dépendance à un CDN pendant le traitement. Son Web Worker est fourni par le bundler Next.js. Pour remettre à jour les fichiers du moteur après une mise à jour de dépendance : `node scripts/prepare-ffmpeg.mjs` (le moteur est réparti en deux fichiers sous la limite de 25 Mo par ressource).

## Vérifications

```sh
npm run typecheck
npm test
npm run build
```

## Périmètre

Import MP4/MOV/WebM selon codecs du navigateur, coupe début/fin, recadrage centré, rotation, vitesse, texte fixe, volume, export MP4/WebM, compression, capture PNG, GIF (30 secondes maximum) et audio WAV. Les vidéos ne quittent pas le navigateur. Limite d’import : 500 Mo. Utiliser des clips courts : FFmpeg.wasm peut épuiser la mémoire du navigateur. Les fichiers temporaires sont effacés après export et les URL objets révoquées après remplacement. Le GIF ne contient pas le texte.

La fusion de clips, la suppression de passages intermédiaires, la timeline multipiste et les abonnements restent à développer dans les phases suivantes. shadcn/ui n’est pas encore intégré ; les contrôles utilisent des éléments HTML natifs. Une validation manuelle sur Safari/iOS et Firefox, ainsi que sur fichiers MOV HEVC et vidéos volumineuses, reste nécessaire avant mise en production publique.

Déploiement statique : `out/`. L’origine de production des canonical et du sitemap est définie dans `app/layout.tsx`, `app/robots.ts` et `app/sitemap.ts`. L’export n’est déclaré terminé qu’après un code de sortie FFmpeg égal à zéro et lecture effective du fichier résultat.

Tests navigateur : `npx playwright install chromium`, servir `out/` sur le port 3000, puis `npx playwright test`. Test validé sous Chromium : import WebM synthétique avec audio, recadrage carré et texte, export MP4, réimport du résultat (240 × 240), extraction WAV, GIF et accueil mobile sans débordement.
