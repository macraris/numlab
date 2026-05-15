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
const tecnicheCount = fs.readdirSync(path.join(PUB, 'assets', 'tecniche')).filter(f => f.endsWith('.png')).length;
const codeCount = fs.readdirSync(path.join(PUB, 'assets', 'code')).filter(f => f.endsWith('.py')).length;

console.log(`✓ ${turtleCount} turtle PNG, ${tecnicheCount} tecnica PNG, ${codeCount} .py examples`);

if (missing > 0) {
  console.error(`Build incomplete: ${missing} required files missing.`);
  process.exit(1);
}
console.log('Build OK ✓');
