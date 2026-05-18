# NumLab — sito educativo trilingue IT/EN/FR

Sito 100% trilingue (IT/EN/FR) per bambini 7-9 anni: Python con la Tartaruga Pina + tecniche visive di moltiplicazione + trucco del 9 interattivo.

Live: https://numlab.netlify.app

## Build

```bash
npm install
npm run build      # genera JSON tradotti + verifica asset
npm start          # serve public/ su http://localhost:4173
```

Auto-deploy: ogni push su `master` triggera un build su Netlify via webhook.
