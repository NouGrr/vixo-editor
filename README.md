# Vixo

Vixo est un éditeur vidéo directement utilisable dans le navigateur. Il fonctionne côté client : les vidéos importées restent sur votre appareil et aucune installation n’est nécessaire.

## Ouvrir Vixo en ligne

👉 [Ouvrir Vixo](https://nougrr.github.io/vixo-editor/)

## Utilisation rapide

1. Ouvrez [Vixo](https://nougrr.github.io/vixo-editor/).
2. Cliquez sur **Importer une vidéo**, ou déposez un fichier dans la zone centrale.
3. Sélectionnez un outil dans la barre de gauche : **Couper**, **Recadrer**, **Compresser**, **Texte**, **Audio** ou **GIF**.
4. Réglez votre vidéo avec les contrôles disponibles et vérifiez l’aperçu.
5. Cliquez sur **Exporter**, choisissez vos réglages, puis sur **Exporter ma vidéo**.
6. Une fois le traitement terminé, cliquez sur **Télécharger** pour récupérer le résultat.

## Fonctionnalités

### Espace de montage

- timeline avec vignettes de la vidéo source ;
- zoom de 100 % à 800 % et ajustement à la largeur ;
- curseur déplaçable sur la règle, à la souris ou au toucher ;
- sélection des passages et affichage de leurs bornes ;
- bande de texte cliquable pour accéder à ses réglages ;
- panneau **Média** avec les informations du fichier importé ;
- annulation et rétablissement des 80 dernières modifications, pendant la session ;
- raccourcis **Espace** (lecture/pause), **S** (couper), **Suppr** (retirer), **Ctrl/Cmd+Z** (annuler) et **Ctrl/Cmd+Maj+Z** (rétablir).

La timeline représente la vidéo source : les passages rayés sont exclus de la lecture et de l’export. La bande de texte sert à ouvrir les réglages ; le texte reste affiché pendant tout l’extrait conservé.

### Couper

- bouton **Couper ici** pour scinder la vidéo à la position du curseur ;
- sélection, suppression et rétablissement des passages dans la timeline ;
- lecture et export des passages conservés dans leur ordre d’origine ;
- réglage du début et de la fin de l’extrait ;
- sélection depuis la timeline ou saisie des temps en secondes ;
- aperçu de l’extrait ;
- vitesse de lecture de 0,5× à 2×.

### Recadrer

- format original ;
- paysage 16:9 ;
- Story et Reel 9:16 ;
- carré 1:1 ;
- portrait 4:5 ;
- rotation par pas de 90 degrés ;
- aperçu du cadrage avant export.

Le recadrage est centré. Les modifications sont appliquées au fichier exporté ; la vidéo originale reste intacte.

### Compresser et convertir

- export en MP4 ou WebM ;
- résolutions 480p, 720p ou 1080p selon la source ;
- conservation de la résolution source pour les vidéos plus petites ;
- compression légère, équilibrée ou forte ;
- progression pendant l’encodage ;
- téléchargement sans filigrane.

La taille finale dépend de la vidéo et des réglages choisis. Une compression ne garantit pas un fichier plus petit que l’original.

### Texte

- ajout d’un texte affiché pendant tout l’extrait ;
- taille et couleur personnalisables ;
- position en bas, au centre ;
- aperçu et intégration dans les exports vidéo.

### Audio

- réglage du volume ;
- suppression du son ;
- extraction de la bande sonore de l’extrait au format WAV, à sa vitesse d’origine.

### GIF et capture d’image

- création d’un GIF à partir d’un extrait de 30 secondes maximum ;
- animation à 12 images par seconde, avec une largeur maximale de 640 pixels ;
- export GIF sans son ni texte ajouté ;
- capture de l’image affichée au format PNG.

## Traitement vidéo

Vixo utilise FFmpeg.wasm directement dans le navigateur. Le moteur est chargé depuis le site au premier export ; ce premier lancement peut demander quelques instants.

Gardez l’onglet ouvert pendant le traitement. Les performances dépendent de votre appareil, de la durée de la vidéo et des réglages d’export.

## Formats pris en charge

L’import accepte les fichiers **MP4**, **MOV** et **WebM**, selon les codecs pris en charge par votre navigateur. La taille maximale d’import est de **500 Mo**.

Les exports disponibles sont :

- MP4 et WebM pour les vidéos ;
- WAV pour l’audio ;
- GIF pour les animations ;
- PNG pour les captures d’image.

Cette version est conçue pour les clips courts. La fusion de clips et la timeline multipiste ne sont pas encore disponibles.

## Développement local

Vixo utilise Next.js, TypeScript et Tailwind CSS. Installez Node.js 22 ou supérieur, puis lancez :

```sh
npm ci
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

Pour vérifier le projet :

```sh
npm run typecheck
npm test
npm run build
```

Les fichiers statiques sont générés dans `out/`. Après une mise à jour de FFmpeg, exécutez `node scripts/prepare-ffmpeg.mjs` pour actualiser les fichiers du moteur.

## Publication

Le site est publié avec GitHub Pages. Les modifications envoyées sur la branche `main` sont testées, construites et déployées automatiquement par le workflow [`.github/workflows/pages.yml`](https://github.com/NouGrr/vixo-editor/blob/main/.github/workflows/pages.yml).

Pour reproduire le build GitHub Pages en local :

```sh
NEXT_PUBLIC_BASE_PATH=/vixo-editor npm run build
```

## Confidentialité

Le montage et les exports sont réalisés côté navigateur. Les vidéos importées ne sont pas envoyées à un serveur Vixo. Aucun compte n’est nécessaire.

## Identité visuelle

Vixo reprend la charte graphique et le favicon de [Pixo](https://nougrr.github.io/pixo-editor/) : fonds bleu nuit, accents lavande et dégradés violet–cyan.
