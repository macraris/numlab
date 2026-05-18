// Build EN/FR translation overlays for the moltiplicazioni manuale and appendice.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const MANUALE = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'data', 'manuale_math.json'), 'utf-8'));
const APPENDICE = JSON.parse(fs.readFileSync(path.join(ROOT, 'public', 'data', 'appendice_math.json'), 'utf-8'));

// Optional body translations live in scripts/translations/. Missing file = no overrides.
function loadBody(lang) {
  const p = path.join(__dirname, 'translations', `manuale_math_body.${lang}.json`);
  if (!fs.existsSync(p)) return { preamble: null, parts: {}, chapters: {} };
  const j = JSON.parse(fs.readFileSync(p, 'utf-8'));
  return { preamble: j.preamble || null, parts: j.parts || {}, chapters: j.chapters || {} };
}
const BODY = { en: loadBody('en'), fr: loadBody('fr') };

// Optional appendix body translations.
function loadAppBody(lang) {
  const p = path.join(__dirname, 'translations', `appendice_math_body.${lang}.json`);
  if (!fs.existsSync(p)) return { preamble: null, sections: {} };
  const j = JSON.parse(fs.readFileSync(p, 'utf-8'));
  return { preamble: j.preamble || null, sections: j.sections || {} };
}
const APP_BODY = { en: loadAppBody('en'), fr: loadAppBody('fr') };

const partsTr = {
  'I': { en: { title: 'Before we start' }, fr: { title: 'Avant de commencer' } },
  'II': { en: { title: 'Foundations of multiplicative thinking' }, fr: { title: 'Fondements de la pensée multiplicative' } },
  'III': { en: { title: 'Times tables one by one' }, fr: { title: 'Les tables une par une' } },
  'IV': { en: { title: 'Cross-cutting strategies and flexible calculation' }, fr: { title: 'Stratégies transversales et calcul flexible' } },
  'V': { en: { title: 'Multiplication in real life' }, fr: { title: 'La multiplication dans la vie réelle' } },
  'VI': { en: { title: 'Developing critical thinking' }, fr: { title: 'Développer la pensée critique' } },
  'VII': { en: { title: 'Games and challenges' }, fr: { title: 'Jeux et défis' } },
  'VIII': { en: { title: 'Tracking progress' }, fr: { title: 'Suivi des progrès' } },
};

const chapterTr = {
  1:  { en: 'Who this manual is for and how to use it',           fr: 'À qui s’adresse ce manuel et comment l’utiliser' },
  2:  { en: 'The philosophy of the method',                       fr: 'La philosophie de la méthode' },
  3:  { en: 'How the parent-coach behaves',                       fr: 'Comment se comporte le parent-coach' },
  4:  { en: 'Practical setup: materials, environment, timing',    fr: 'Mise en place : matériel, environnement, durée' },
  5:  { en: 'What multiplication really is (the five faces)',     fr: 'Ce qu’est vraiment la multiplication (les cinq visages)' },
  6:  { en: 'The three magic properties',                         fr: 'Les trois propriétés magiques' },
  7:  { en: 'Initial diagnosis: what stage is my child at?',      fr: 'Diagnostic initial : à quel stade en est ma fille ?' },
  8:  { en: 'The 2 times table',                                  fr: 'La table de 2' },
  9:  { en: 'The 10 times table',                                 fr: 'La table de 10' },
  10: { en: 'The 5 times table',                                  fr: 'La table de 5' },
  11: { en: 'The 4 times table',                                  fr: 'La table de 4' },
  12: { en: 'The 3 times table',                                  fr: 'La table de 3' },
  13: { en: 'The 9 times table',                                  fr: 'La table de 9' },
  14: { en: 'The 6 times table',                                  fr: 'La table de 6' },
  15: { en: 'The 7 times table',                                  fr: 'La table de 7' },
  16: { en: 'The 8 times table',                                  fr: 'La table de 8' },
  17: { en: 'Double one, halve the other',                        fr: 'Double l’un, divise l’autre par deux' },
  18: { en: 'The distributive property as a superpower',          fr: 'La propriété distributive comme superpouvoir' },
  19: { en: 'Singapore Bar Model: draw before calculating',       fr: 'Bar Model de Singapour : dessiner avant de calculer' },
  20: { en: 'Number Talks: the 10 most powerful minutes',         fr: 'Number Talks : les 10 minutes les plus puissantes' },
  21: { en: 'Egyptian multiplication by doubling',                fr: 'La multiplication égyptienne par doublement' },
  22: { en: 'The three types of multiplicative problems',         fr: 'Les trois types de problèmes multiplicatifs' },
  23: { en: 'Thirty everyday problems solved',                    fr: 'Trente problèmes du quotidien résolus' },
  24: { en: 'Estimation and quick mental calculation',            fr: 'Estimation et calcul mental rapide' },
  25: { en: 'Pólya’s four-step method',                           fr: 'La méthode de Pólya en quatre étapes' },
  26: { en: 'The question "why?" as engine',                      fr: 'La question « pourquoi ? » comme moteur' },
  27: { en: 'Inventing problems (problem posing)',                fr: 'Inventer des problèmes (problem posing)' },
  28: { en: 'The multiplication table as a laboratory',           fr: 'La table de Pythagore comme laboratoire' },
  29: { en: 'Olympiad problems within reach',                     fr: 'Problèmes olympiques à portée d’enfant' },
  30: { en: 'Ten games with cards, dice, board',                  fr: 'Dix jeux avec cartes, dés et plateaux' },
  31: { en: 'Games of the world',                                 fr: 'Jeux du monde' },
  32: { en: 'Apps and recommended digital tools',                 fr: 'Applis et outils numériques recommandés' },
  33: { en: 'The parent’s weekly journal',                        fr: 'Le journal hebdomadaire du parent' },
  34: { en: 'Mastery checklist for each table',                   fr: 'Liste de maîtrise pour chaque table' },
  35: { en: 'When to move on to division, fractions, big numbers',fr: 'Quand passer à la division, aux fractions, aux grands nombres' },
};

const sectionTr = {
  A: { en: 'Worksheets by times table (8 × 20 mixed exercises)',  fr: 'Fiches par table (8 × 20 exercices mélangés)' },
  B: { en: '100 graded real-life problems',                       fr: '100 problèmes du quotidien gradués' },
  C: { en: '50 Olympic problems within reach',                    fr: '50 problèmes olympiques à portée d’enfant' },
  D: { en: 'Blank multiplication table to print',                 fr: 'Table de Pythagore vierge à imprimer' },
  E: { en: 'Self-built playing cards',                            fr: 'Cartes à jouer fabriquées maison' },
  F: { en: 'Quick timed tests (3 levels)',                        fr: 'Tests rapides chronométrés (3 niveaux)' },
  G: { en: 'Progress tracking tables',                            fr: 'Tableaux de suivi des progrès' },
  H: { en: '50 critical thinking questions',                      fr: '50 questions de pensée critique' },
  I: { en: 'Answers and commented solutions',                     fr: 'Réponses et solutions commentées' },
};

const summaryTr = {
  1: { en: 'Who reads it, with which child, why', fr: 'Qui le lit, avec quel enfant, pourquoi' },
  2: { en: 'A mix of the world’s best pedagogies for multiplication', fr: 'Une synthèse des meilleures pédagogies du monde' },
  3: { en: 'Golden rules, mistakes to avoid, handling frustration', fr: 'Règles d’or, erreurs à éviter, gérer la frustration' },
  4: { en: 'Materials to gather, environment, recommended timing', fr: 'Matériel, environnement, durée recommandée' },
  5: { en: 'Equal groups, arrays, area, number line, products', fr: 'Groupes égaux, tableaux, aire, droite numérique, produits' },
  6: { en: 'Commutative, associative, distributive with examples', fr: 'Commutative, associative, distributive avec exemples' },
  7: { en: 'NZ Numeracy Project stages adapted: where is she now?', fr: 'Stades du Numeracy Project NZ : où en est-elle ?' },
  8: { en: 'Why start here, secret patterns, world tricks', fr: 'Pourquoi commencer ici, motifs secrets, astuces' },
  9: { en: 'The 10 as the second anchor of the path', fr: 'Le 10 comme deuxième ancre du parcours' },
  10:{ en: 'Half of 10, mental shortcuts, fingers of one hand', fr: 'Moitié de 10, raccourcis mentaux, doigts d’une main' },
  11:{ en: 'Double of the 2, four legs of the animals', fr: 'Le double du 2, les quatre pattes des animaux' },
  12:{ en: 'Double plus one strategy, divisibility by 3', fr: 'Stratégie double-plus-un, divisibilité par 3' },
  13:{ en: 'The Japanese finger trick + ten-minus-one', fr: 'L’astuce japonaise des doigts + dix-moins-un' },
  14:{ en: 'Double of the 3, triple of the 2, anchors', fr: 'Double du 3, triple du 2, points d’ancrage' },
  15:{ en: 'The "calendar number": distributive 5+2 strategy', fr: 'Le nombre du calendrier : stratégie 5+2' },
  16:{ en: 'Triple doubling, ten-minus-two strategy', fr: 'Triple doublage, dix-moins-deux' },
  17:{ en: 'New Zealand: doubling/halving for friendly numbers', fr: 'Nouvelle-Zélande : doubler/diviser pour nombres amis' },
  18:{ en: 'The superpower of breaking factors into pieces', fr: 'Le superpouvoir de découper les facteurs' },
  19:{ en: 'Singapore: draw bars before writing the operation', fr: 'Singapour : dessiner avant d’écrire l’opération' },
  20:{ en: 'Jo Boaler\'s daily 10-minute routine for fluency', fr: 'La routine quotidienne de 10 min de Jo Boaler' },
  21:{ en: 'Rhind Papyrus algorithm: only doubling needed', fr: 'Algorithme du Papyrus de Rhind : doubler suffit' },
  22:{ en: 'Vergnaud: proportionality, comparison, combinatorics', fr: 'Vergnaud : proportionnalité, comparaison, combinaisons' },
  23:{ en: 'Worked examples spanning shopping, recipes, distances', fr: 'Exemples résolus : courses, recettes, distances' },
  24:{ en: 'Rounding, bracketing, reasonableness check', fr: 'Arrondir, encadrer, vérifier la vraisemblance' },
  25:{ en: 'Understand → plan → execute → verify', fr: 'Comprendre → planifier → exécuter → vérifier' },
  26:{ en: 'Twenty Socratic questions to ask while she works', fr: 'Vingt questions socratiques pendant qu’elle travaille' },
  27:{ en: 'Invent a problem whose answer is 24 (Cuba, Taiwan)', fr: 'Invente un problème qui donne 24 (Cuba, Taïwan)' },
  28:{ en: 'Colour patterns, primes, Pythagorean square jigsaw', fr: 'Motifs colorés, premiers, puzzle de la table' },
  29:{ en: 'OBMEP Mirim and Ñandú: five accessible problems', fr: 'OBMEP Mirim et Ñandú : cinq problèmes accessibles' },
  30:{ en: 'Multiplication War, Bingo, Salute, Fizz-Buzz...', fr: 'Multiplication War, Bingo, Salute, Fizz-Buzz…' },
  31:{ en: 'Mancala, Yupana, Soroban: cultural & mathematical', fr: 'Mancala, Yupana, Soroban : culture et maths' },
  32:{ en: 'Times Tables Rock Stars, YouCubed, Khan Academy', fr: 'Times Tables Rock Stars, YouCubed, Khan Academy' },
  33:{ en: 'Brief weekly notes to track real progress', fr: 'Brèves notes hebdomadaires pour suivre les progrès' },
  34:{ en: 'Mastery indicators for each times table', fr: 'Indicateurs de maîtrise pour chaque table' },
  35:{ en: 'Readiness signals to move beyond multiplication', fr: 'Signes de préparation pour aller au-delà' },
};

function buildLangManuale(lang) {
  const body = BODY[lang] || { preamble: null, parts: {}, chapters: {} };
  const out = {
    preamble: body.preamble || MANUALE.preamble,
    preamble_translated: !!body.preamble,
    parts: [],
  };
  for (const p of MANUALE.parts) {
    const tr = (partsTr[p.roman] || {})[lang] || {};
    const bodyPart = body.parts[p.roman] || {};
    const intro = bodyPart.intro != null ? bodyPart.intro : p.intro;
    const pp = {
      id: p.id,
      roman: p.roman,
      title: tr.title || p.title,
      title_it: p.title,
      intro,
      intro_translated: bodyPart.intro != null,
      chapters: p.chapters.map(c => {
        const translatedContent = body.chapters[c.number];
        return {
          id: c.id,
          number: c.number,
          slug: c.slug,
          title: (chapterTr[c.number] || {})[lang] || c.title,
          title_it: c.title,
          summary: (summaryTr[c.number] || {})[lang] || '',
          content: translatedContent != null ? translatedContent : c.content,
          content_translated: translatedContent != null,
        };
      }),
    };
    out.parts.push(pp);
  }
  return out;
}

function buildLangAppendice(lang) {
  const body = lang === 'it' ? null : APP_BODY[lang];
  return {
    preamble: (body && body.preamble) ? body.preamble : APPENDICE.preamble,
    preamble_translated: !!(body && body.preamble),
    sections: APPENDICE.sections.map(s => {
      const translatedContent = body ? body.sections[s.number] : null;
      return {
        id: s.id,
        number: s.number,
        letter: s.letter,
        slug: s.slug,
        title: (sectionTr[s.letter] || {})[lang] || s.title,
        title_it: s.title,
        content: translatedContent != null ? translatedContent : s.content,
        content_translated: translatedContent != null,
      };
    }),
  };
}

const out = path.join(ROOT, 'public', 'data');
const itManuale = buildLangManuale('it');
// For italian we keep the original titles
for (const p of itManuale.parts) {
  p.title = p.title_it;
  for (const c of p.chapters) {
    c.title = c.title_it;
    c.summary = '';
  }
}
const itApp = buildLangAppendice('it');
for (const s of itApp.sections) s.title = s.title_it;

fs.writeFileSync(path.join(out, 'manuale_math.it.json'), JSON.stringify(itManuale, null, 2), 'utf-8');
fs.writeFileSync(path.join(out, 'manuale_math.en.json'), JSON.stringify(buildLangManuale('en'), null, 2), 'utf-8');
fs.writeFileSync(path.join(out, 'manuale_math.fr.json'), JSON.stringify(buildLangManuale('fr'), null, 2), 'utf-8');
fs.writeFileSync(path.join(out, 'appendice_math.it.json'), JSON.stringify(itApp, null, 2), 'utf-8');
fs.writeFileSync(path.join(out, 'appendice_math.en.json'), JSON.stringify(buildLangAppendice('en'), null, 2), 'utf-8');
fs.writeFileSync(path.join(out, 'appendice_math.fr.json'), JSON.stringify(buildLangAppendice('fr'), null, 2), 'utf-8');

console.log('Translations math: IT/EN/FR written.');
