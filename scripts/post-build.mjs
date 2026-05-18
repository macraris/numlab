// Post-build: verify required assets are present.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');

const required = [
  'index.html',
  'css/app.css',
  'js/app.js',
  'js/md.js',
  'i18n/it.json',
  'i18n/en.json',
  'i18n/fr.json',
  'data/manuale.it.json',
  'data/manuale.en.json',
  'data/manuale.fr.json',
  'data/appendice.it.json',
  'data/tecniche.json',
  'data/gallery.json',
  'trucco9/index.html',
];

let missing = 0;
for (const f of required) {
  const p = path.join(PUB, f);
  if (!fs.existsSync(p)) {
    console.error(`MISSING: ${f}`);
    missing++;
  }
}
const turtleCount = fs.readdirSync(path.join(PUB, 'assets', 'turtle')).filter(f => f.endsWith('.png')).length;
const codeCount = fs.readdirSync(path.join(PUB, 'assets', 'code')).filter(f => f.endsWith('.py')).length;

const tecnicheCounts = {};
for (const lang of ['it', 'en', 'fr']) {
  const dir = path.join(PUB, 'assets', 'tecniche', lang);
  if (!fs.existsSync(dir)) {
    console.error(`MISSING tecniche dir for lang ${lang}: assets/tecniche/${lang}/`);
    missing++;
    continue;
  }
  tecnicheCounts[lang] = fs.readdirSync(dir).filter(f => f.endsWith('.png')).length;
}

console.log(`✓ ${turtleCount} turtle PNG, ${codeCount} .py examples`);
console.log(`✓ tecniche PNG per lang: ${JSON.stringify(tecnicheCounts)}`);

if (missing > 0) {
  console.error(`Build incomplete: ${missing} required files missing.`);
  process.exit(1);
}

// Clean up build intermediates: the un-suffixed *.json sources are only inputs
// to translate.mjs/translate-math.mjs; the runtime app only fetches .it/.en/.fr.
const intermediates = [
  'data/manuale.json',
  'data/manuale_math.json',
  'data/appendice.json',
  'data/appendice_math.json',
];
let bytesFreed = 0;
for (const f of intermediates) {
  const p = path.join(PUB, f);
  if (fs.existsSync(p)) {
    bytesFreed += fs.statSync(p).size;
    fs.unlinkSync(p);
  }
}
if (bytesFreed > 0) {
  console.log(`✓ Trimmed ${(bytesFreed / 1024).toFixed(0)} KB of build intermediates from public/`);
}

console.log('Build OK ✓');
