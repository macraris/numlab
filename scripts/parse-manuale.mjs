// Parse MANUALE.md and APPENDICE_ESERCIZI.md into structured JSON chapters.
// Produces public/data/manuale.json and public/data/appendice.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_MANUALE = 'C:/Users/admin/Desktop/namExo/bestWayMoltiplication/python/MANUALE.md';
const SRC_APPENDICE = 'C:/Users/admin/Desktop/namExo/bestWayMoltiplication/python/APPENDICE_ESERCIZI.md';
const OUT_MANUALE = path.join(ROOT, 'public', 'data', 'manuale.json');
const OUT_APPENDICE = path.join(ROOT, 'public', 'data', 'appendice.json');

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Rewrite asset paths inside markdown to site paths.
function rewriteAssets(md) {
  // ![alt](esempi/output/xxx.png) -> /assets/turtle/xxx.png
  md = md.replace(/!\[([^\]]*)\]\(esempi\/output\/([^)]+)\)/g, (_m, alt, file) => {
    return `![${alt}](/assets/turtle/${file})`;
  });
  // links to esempi/xxx.py inside code comments or `# vedi esempi/...` - leave as code text
  return md;
}

function parseManuale(md) {
  md = rewriteAssets(md);
  const lines = md.split('\n');
  const parts = [];
  let currentPart = null;
  let currentChapter = null;
  let bufferIntro = []; // for top-level intro before first part
  let i = 0;

  // The file starts with title; we capture preamble as part 0 "Introduzione".
  // Collect everything until first "# Parte"
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
    const mPart = line.match(/^# Parte\s+(\S+)\s+—\s+(.+)$/);
    const mChap = line.match(/^## Capitolo\s+(\d+)\s+—\s+(.+)$/);
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
      // Capture optional blockquote intro line(s) until next "## Capitolo"
      while (i < lines.length && !lines[i].startsWith('## Capitolo')) {
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
    // Stop at horizontal rule between parts? We already handle parts above.
    if (currentChapter) {
      currentChapter._buf.push(line);
    }
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

  while (i < lines.length && !lines[i].match(/^## Sezione/)) {
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

  while (i < lines.length) {
    const line = lines[i];
    const mSec = line.match(/^## Sezione\s+(\d+)\s+—\s+(.+)$/);
    if (mSec) {
      push();
      current = {
        id: 'sezione-' + mSec[1],
        number: parseInt(mSec[1], 10),
        title: mSec[2].trim(),
        slug: slugify(mSec[2]),
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

const manualeSrc = fs.readFileSync(SRC_MANUALE, 'utf-8');
const appendiceSrc = fs.readFileSync(SRC_APPENDICE, 'utf-8');

const manuale = parseManuale(manualeSrc);
const appendice = parseAppendice(appendiceSrc);

fs.mkdirSync(path.dirname(OUT_MANUALE), { recursive: true });
fs.writeFileSync(OUT_MANUALE, JSON.stringify(manuale, null, 2), 'utf-8');
fs.writeFileSync(OUT_APPENDICE, JSON.stringify(appendice, null, 2), 'utf-8');

const totalChapters = manuale.parts.reduce((s, p) => s + p.chapters.length, 0);
console.log(`Manuale: ${manuale.parts.length} parti, ${totalChapters} capitoli`);
console.log(`Appendice: ${appendice.sections.length} sezioni`);
