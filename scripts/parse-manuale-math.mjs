// Parse moltiplicazioni MANUALE.md and APPENDICE_ESERCIZI.md.
// Same idea as parse-manuale.mjs but for the multiplication manual.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_MANUALE = 'C:/Users/admin/Desktop/namExo/bestWayMoltiplication/MANUALE.md';
const SRC_APPENDICE = 'C:/Users/admin/Desktop/namExo/bestWayMoltiplication/APPENDICE_ESERCIZI.md';
const OUT_MANUALE = path.join(__dirname, 'data', 'manuale_math.json');
const OUT_APPENDICE = path.join(__dirname, 'data', 'appendice_math.json');

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Rewrite asset paths: tecniche_visive_png/XX.png -> /assets/tecniche/XX.png
function rewriteAssets(md) {
  md = md.replace(/!\[([^\]]*)\]\(tecniche_visive_png\/([^)]+)\)/g, (_m, alt, file) => {
    return `![${alt}](/assets/tecniche/${file})`;
  });
  // also handle tecniche_visive_svg if any
  md = md.replace(/!\[([^\]]*)\]\(tecniche_visive_svg\/([^)]+)\)/g, (_m, alt, file) => {
    return `![${alt}](/assets/tecniche_svg/${file})`;
  });
  return md;
}

function parseManuale(md) {
  md = rewriteAssets(md);
  const lines = md.split('\n');
  const parts = [];
  let currentPart = null;
  let currentChapter = null;
  let bufferIntro = [];
  let i = 0;

  while (i < lines.length && !lines[i].startsWith('# Parte ')) {
    bufferIntro.push(lines[i]);
    i++;
  }
  const preamble = bufferIntro.join('\n').trim();

  function pushChapter() {
    if (currentChapter && currentPart) {
      currentChapter.content = currentChapter._buf.join('\n').trim();
      delete currentChapter._buf;
      currentPart.chapters.push(currentChapter);
    }
    currentChapter = null;
  }
  function pushPart() {
    pushChapter();
    if (currentPart) parts.push(currentPart);
    currentPart = null;
  }

  while (i < lines.length) {
    const line = lines[i];
    // Match: "# Parte I — Title" or "# Parte I - Title" (em-dash or hyphen)
    const mPart = line.match(/^# Parte\s+(\S+)\s+[—\-–]\s+(.+)$/);
    // Match: "## Capitolo 1. Title" or "## Capitolo 1 — Title" (dot or em-dash)
    const mChap = line.match(/^## Capitolo\s+(\d+)\s*[.\-—–]\s+(.+)$/);
    if (mPart) {
      pushPart();
      currentPart = {
        id: 'parte-' + slugify(mPart[1]),
        roman: mPart[1],
        title: mPart[2].trim(),
        chapters: [],
        intro: [],
        _introBuf: [],
      };
      i++;
      while (i < lines.length && !lines[i].match(/^## Capitolo\s+\d+/)) {
        currentPart._introBuf.push(lines[i]);
        i++;
      }
      currentPart.intro = currentPart._introBuf.join('\n').trim();
      delete currentPart._introBuf;
      continue;
    }
    if (mChap) {
      pushChapter();
      currentChapter = {
        id: 'cap-' + mChap[1],
        number: parseInt(mChap[1], 10),
        title: mChap[2].trim(),
        slug: slugify(mChap[2]),
        _buf: [],
      };
      i++;
      continue;
    }
    if (currentChapter) currentChapter._buf.push(line);
    i++;
  }
  pushPart();
  return { preamble, parts };
}

function parseAppendice(md) {
  md = rewriteAssets(md);
  const lines = md.split('\n');
  const sections = [];
  let preambleBuf = [];
  let current = null;
  let i = 0;

  // sections start with "## SEZIONE X" (uppercase or "Sezione")
  const secRe = /^## SEZIONE\s+([A-Z\d]+)\s+[—\-–]\s+(.+)$/i;

  while (i < lines.length && !lines[i].match(secRe)) {
    preambleBuf.push(lines[i]);
    i++;
  }
  const preamble = preambleBuf.join('\n').trim();

  function push() {
    if (current) {
      current.content = current._buf.join('\n').trim();
      delete current._buf;
      sections.push(current);
    }
  }

  let counter = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(secRe);
    if (m) {
      push();
      counter += 1;
      current = {
        id: 'sezione-' + counter,
        number: counter,
        letter: m[1],
        title: m[2].trim(),
        slug: slugify(m[2]),
        _buf: [],
      };
      i++;
      continue;
    }
    if (current) current._buf.push(line);
    i++;
  }
  push();
  return { preamble, sections };
}

if (!fs.existsSync(SRC_MANUALE) || !fs.existsSync(SRC_APPENDICE)) {
  console.log(`[parse-manuale-math] SRC markdown not found locally — skipping. Using committed scripts/data/*.json instead.`);
  process.exit(0);
}

const manualeSrc = fs.readFileSync(SRC_MANUALE, 'utf-8');
const appendiceSrc = fs.readFileSync(SRC_APPENDICE, 'utf-8');

const manuale = parseManuale(manualeSrc);
const appendice = parseAppendice(appendiceSrc);

fs.mkdirSync(path.dirname(OUT_MANUALE), { recursive: true });
fs.writeFileSync(OUT_MANUALE, JSON.stringify(manuale, null, 2), 'utf-8');
fs.writeFileSync(OUT_APPENDICE, JSON.stringify(appendice, null, 2), 'utf-8');

const totalChapters = manuale.parts.reduce((s, p) => s + p.chapters.length, 0);
console.log(`Manuale moltiplicazioni: ${manuale.parts.length} parti, ${totalChapters} capitoli`);
console.log(`Appendice moltiplicazioni: ${appendice.sections.length} sezioni`);
