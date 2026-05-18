// Build EN/FR translation overlays for the manuale and appendice.
// We translate: part titles, chapter titles, section titles, short intros.
// The long chapter body remains in Italian (original prose) with a banner.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Intermediate JSONs live in scripts/data/ (committed) — kept out of public/ so they aren't deployed.
const MANUALE = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'manuale.json'), 'utf-8'));
const APPENDICE = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'appendice.json'), 'utf-8'));

// Optional body translations live in scripts/translations/. Missing file = no overrides.
function loadBody(lang) {
  const p = path.join(__dirname, 'translations', `manuale_body.${lang}.json`);
  if (!fs.existsSync(p)) return { preamble: null, parts: {}, chapters: {} };
  const j = JSON.parse(fs.readFileSync(p, 'utf-8'));
  return { preamble: j.preamble || null, parts: j.parts || {}, chapters: j.chapters || {} };
}
function loadApp(lang) {
  const p = path.join(__dirname, 'translations', `appendice_body.${lang}.json`);
  if (!fs.existsSync(p)) return { preamble: null, sections: {} };
  const j = JSON.parse(fs.readFileSync(p, 'utf-8'));
  return { preamble: j.preamble || null, sections: j.sections || {} };
}
const BODY = { en: loadBody('en'), fr: loadBody('fr') };
const APP_BODY = { en: loadApp('en'), fr: loadApp('fr') };

// --- Manuale: Part titles ---
const partsTr = {
  'I': {
    en: { title: 'Before we start', intro: 'Pina the Turtle lives on a paper island full of grid squares. Every day she wakes up, puts on her green cap, picks up her brush and waits for someone to tell her where to go. Today that someone is you.' },
    fr: { title: 'Avant de commencer', intro: 'Pina la Tortue vit sur une île de papier quadrillé. Chaque jour elle se réveille, enfile son petit chapeau vert, prend son pinceau et attend que quelqu’un lui dise où aller. Aujourd’hui, ce quelqu’un, c’est toi.' },
  },
  'II': {
    en: { title: 'Meet Pina the Turtle', intro: 'On the kitchen table there is a big white sheet of paper. Pina arrives slowly, brush in mouth. She stops in the centre. She looks straight ahead. She waits. “What should I do?” she asks silently. You have five minutes to tell her: the grandparents are coming to see the drawing.' },
    fr: { title: 'Découvre Pina la Tortue', intro: 'Sur la table de la cuisine se trouve une grande feuille blanche. Pina arrive doucement, le pinceau dans la bouche. Elle s’arrête au centre, regarde droit devant elle et attend. « Qu’est-ce que je dois faire ? » demande-t-elle sans voix. Tu as cinq minutes pour le lui dire : les grands-parents arrivent pour voir le dessin.' },
  },
  'III': {
    en: { title: 'Shapes and drawings', intro: 'Pina wants to build a little house for her friend Hedgehog. Four walls, a pointed roof, a round window. “Sounds easy” thinks Pina. Then she looks again: each wall is a square, the roof is a triangle, the window is a circle. To build a house, you first need to know how to make shapes.' },
    fr: { title: 'Formes et dessins', intro: 'Pina veut construire une petite maison pour son ami Hérisson. Quatre murs, un toit pointu, une fenêtre ronde. « Ça a l’air facile », pense Pina. Puis elle regarde mieux : chaque mur est un carré, le toit un triangle, la fenêtre un cercle. Pour faire une maison, il faut d’abord savoir faire les formes.' },
  },
  'IV': {
    en: { title: 'Variables and creative freedom', intro: 'Pina has learned to draw squares big and small, but she has to rewrite the program every time. “There must be a smarter way,” she thinks. She sees her friend Mousy the programmer slipping a slip of paper into a shoebox. “What’s that box?” asks Pina. “It’s a variable,” smiles Mousy. “It’s about to change your life.”' },
    fr: { title: 'Variables et liberté créative', intro: 'Pina a appris à dessiner des carrés grands et petits, mais elle doit réécrire le programme à chaque fois. « Il doit y avoir un moyen plus malin », pense-t-elle. Elle voit son amie Sourisette la programmeuse glisser un papier dans une boîte à chaussures. « C’est quoi cette boîte ? » demande Pina. « C’est une variable », sourit Sourisette. « Elle va changer ta vie. »' },
  },
  'V': {
    en: { title: 'Decisions: the turtle that thinks', intro: 'Pina has learned to draw, but everything she does is always the same. Today she wants something different: she wants Pina to decide on her own — if it’s raining outside, draw a cloud; if it’s sunny, draw a sun.' },
    fr: { title: 'Décisions : la tortue qui réfléchit', intro: 'Pina a appris à dessiner, mais tout ce qu’elle fait se ressemble toujours. Aujourd’hui elle veut autre chose : que Pina décide toute seule — s’il pleut dehors, dessine un nuage ; s’il fait beau, dessine un soleil.' },
  },
  'VI': {
    en: { title: 'Functions: name your ideas', intro: 'Pina has invented a way to draw a beautiful flower, but each time she has to rewrite all the steps. “Why don’t I give a name to my whole flower recipe?” she wonders. That name is a function.' },
    fr: { title: 'Fonctions : donne un nom à tes idées', intro: 'Pina a inventé une jolie fleur, mais à chaque fois elle doit réécrire toutes les étapes. « Et si je donnais un nom à toute ma recette de fleur ? » se dit-elle. Ce nom, c’est une fonction.' },
  },
  'VII': {
    en: { title: 'Mini-games', intro: 'Pina has decided to become a game designer. She wants you to be able to play with her, not just watch her. Today we build small games.' },
    fr: { title: 'Mini-jeux', intro: 'Pina a décidé de devenir créatrice de jeux. Elle veut que tu puisses jouer avec elle, pas seulement la regarder. Aujourd’hui on fabrique de petits jeux.' },
  },
  'VIII': {
    en: { title: 'Debugging: the art of finding mistakes', intro: 'Errors are not enemies. They are friends who bring information. Every programmer in the world spends most of the day looking for bugs. Welcome to the club.' },
    fr: { title: 'Débogage : l’art de trouver les erreurs', intro: 'Les erreurs ne sont pas des ennemies. Ce sont des amies qui apportent de l’information. Tous les programmeurs et programmeuses du monde passent la plupart de leur journée à chercher des bugs. Bienvenue dans le club.' },
  },
  'IX': {
    en: { title: 'Critical thinking and creativity', intro: 'Now you have all the tools. The question is no longer “how do I do it?” but “what do I want to make?” This part is about ideas, remixes, and your own programmer’s diary.' },
    fr: { title: 'Pensée critique et créativité', intro: 'Maintenant tu as tous les outils. La question n’est plus « comment faire ? » mais « qu’est-ce que je veux créer ? ». Cette partie parle d’idées, de remix et de ton propre journal de programmeuse.' },
  },
  'X': {
    en: { title: 'Tracking and growth', intro: 'A path that doesn’t end. A final gallery, a skills checklist, and many doors to keep walking through.' },
    fr: { title: 'Suivi et progression', intro: 'Un parcours qui ne s’arrête pas. Une galerie finale, une liste de compétences, et de nombreuses portes à franchir pour continuer.' },
  },
};

// --- Chapter titles 1..42 (kept short and faithful) ---
const chapterTr = {
  1:  { en: 'Who this book is for', fr: 'À qui s’adresse ce livre' },
  2:  { en: 'The philosophy: four ideas for learning well', fr: 'La philosophie : quatre idées pour bien apprendre' },
  3:  { en: 'The parent-coach: three golden rules', fr: 'Le parent-coach : trois règles d’or' },
  4:  { en: 'Setup: install Python and the editor', fr: 'Installation : Python et l’éditeur' },
  5:  { en: 'Meet Pina', fr: 'Qui est Pina' },
  6:  { en: 'Your first program (PRIMM in action)', fr: 'Ton premier programme (PRIMM en action)' },
  7:  { en: 'Pina’s basic commands', fr: 'Les commandes de base de Pina' },
  8:  { en: 'Unplugged activity: become the turtle', fr: 'Activité débranchée : deviens la tortue' },
  9:  { en: 'The square by hand', fr: 'Le carré à la main' },
  10: { en: 'Your first `for`: organised laziness', fr: 'Ta première boucle `for` : la paresse organisée' },
  11: { en: 'Triangle, pentagon, hexagon', fr: 'Triangle, pentagone, hexagone' },
  12: { en: 'The circle and the star', fr: 'Le cercle et l’étoile' },
  13: { en: 'Colours and thick pen', fr: 'Couleurs et stylo épais' },
  14: { en: 'Mandalas, snowflakes, rainbows', fr: 'Mandalas, flocons, arcs-en-ciel' },
  15: { en: 'The box with a label', fr: 'La boîte avec une étiquette' },
  16: { en: 'Input: the first dialogue with Pina', fr: 'Input : le premier dialogue avec Pina' },
  17: { en: 'Chance: random numbers', fr: 'Le hasard : les nombres aléatoires' },
  18: { en: 'Teleport: `goto` and `setheading`', fr: 'Téléportation : `goto` et `setheading`' },
  19: { en: 'Art project: Pina’s garden', fr: 'Projet d’art : le jardin de Pina' },
  20: { en: '`if`/`else`: the first decision', fr: '`if`/`else` : la première décision' },
  21: { en: 'Comparing numbers', fr: 'Comparer des nombres' },
  22: { en: 'Events: keys and mouse clicks', fr: 'Événements : touches et clics' },
  23: { en: 'Project: the magic whiteboard', fr: 'Projet : le tableau magique' },
  24: { en: 'What is a function', fr: 'Qu’est-ce qu’une fonction' },
  25: { en: 'Build a new command', fr: 'Construire une nouvelle commande' },
  26: { en: 'Parameters: the changing function', fr: 'Paramètres : la fonction qui change' },
  27: { en: 'Project: house with a garden', fr: 'Projet : maison et jardin' },
  28: { en: 'The game loop', fr: 'La boucle de jeu' },
  29: { en: 'Mini-game 1: catch the apple', fr: 'Mini-jeu 1 : attrape la pomme' },
  30: { en: 'Mini-game 2: the labyrinth', fr: 'Mini-jeu 2 : le labyrinthe' },
  31: { en: 'Mini-game 3: Pina’s Pong', fr: 'Mini-jeu 3 : le Pong de Pina' },
  32: { en: 'Mini-game 4: mini Snake', fr: 'Mini-jeu 4 : mini Snake' },
  33: { en: 'Errors are our friends', fr: 'Les erreurs sont nos amies' },
  34: { en: 'The five-step bug liturgy', fr: 'La liturgie du bug en cinq étapes' },
  35: { en: 'Rubber duck debugging', fr: 'Le débogage du canard en plastique' },
  36: { en: 'The five most common mistakes at age 8', fr: 'Les cinq erreurs les plus fréquentes à 8 ans' },
  37: { en: 'Investigate patterns', fr: 'Enquêter sur les motifs' },
  38: { en: 'Remix-first: start from someone else’s code', fr: 'Remix d’abord : partir du code d’un·e autre' },
  39: { en: 'Twenty ideas to go further', fr: 'Vingt idées pour aller plus loin' },
  40: { en: 'The programmer’s diary', fr: 'Le journal de la programmeuse' },
  41: { en: 'Mastery checklist', fr: 'Liste de compétences' },
  42: { en: 'The final gallery and what comes next', fr: 'La galerie finale et la suite' },
};

// --- Chapter short summaries (1-2 sentences each, in EN/FR) used at the top of each chapter page ---
const chapterSummary = {
  1: {
    en: 'A short letter explaining who the book is for: a child aged 7-9 and a parent-coach. No previous coding experience required.',
    fr: 'Une courte lettre expliquant à qui s’adresse ce livre : un enfant de 7 à 9 ans et un parent-coach. Aucune expérience en programmation requise.',
  },
  2: {
    en: 'The four ideas that drive this book: low floor / high ceiling / wide walls; body-syntonic learning; Concrete-Pictorial-Abstract; PRIMM.',
    fr: 'Les quatre idées qui guident ce livre : low floor / high ceiling / wide walls ; apprentissage par le corps ; Concret-Imagé-Abstrait ; PRIMM.',
  },
  3: {
    en: 'Three golden rules for the parent-coach: pair programming, three magic questions, and the bug liturgy.',
    fr: 'Trois règles d’or pour le parent-coach : pair programming, trois questions magiques, et la liturgie du bug.',
  },
  4: {
    en: 'Install Python and pick a kid-friendly editor (Mu Editor recommended). Includes a minimal first program to test the setup.',
    fr: 'Installer Python et choisir un éditeur adapté aux enfants (Mu Editor recommandé). Inclut un premier programme minimal pour tester l’installation.',
  },
  5: {
    en: 'Who Pina is, where she lives on the screen, and her three pieces of self-knowledge: position, heading, and pen state.',
    fr: 'Qui est Pina, où elle vit sur l’écran, et ses trois informations essentielles : position, orientation et état du stylo.',
  },
  6: {
    en: 'Your very first three-line program — `forward(200)` — explored with the PRIMM cycle: Predict, Run, Investigate, Modify, Make.',
    fr: 'Ton tout premier programme de trois lignes — `forward(200)` — exploré avec le cycle PRIMM : Prédire, Exécuter, Enquêter, Modifier, Créer.',
  },
  7: {
    en: 'The six commands you need to know by heart: forward, backward, right, left, penup, pendown.',
    fr: 'Les six commandes à connaître par cœur : forward, backward, right, left, penup, pendown.',
  },
  8: {
    en: 'Five unplugged activities away from the computer: walk like Pina, command cards, the blindfolded robot, binary cards, the sorting net.',
    fr: 'Cinq activités débranchées loin de l’ordinateur : marcher comme Pina, cartes-commandes, robot aux yeux bandés, cartes binaires, réseau de tri.',
  },
  9: {
    en: 'Draw a square by writing each command line by line. Feel the repetition before we hide it in a loop.',
    fr: 'Dessine un carré en écrivant chaque commande ligne par ligne. Ressens la répétition avant de la cacher dans une boucle.',
  },
  10: {
    en: 'The `for` loop turns eight lines into two. The first pattern-recognition exercise in the book.',
    fr: 'La boucle `for` transforme huit lignes en deux. Le premier exercice de reconnaissance de motifs du livre.',
  },
  11: {
    en: 'Regular polygons: turn 360°/N at each side. The geometric secret behind every shape Pina can draw.',
    fr: 'Polygones réguliers : tourne de 360°/N à chaque côté. Le secret géométrique derrière chaque forme.',
  },
  12: {
    en: 'The `circle` command and the magic 144° that draws a five-pointed star (a pentagram).',
    fr: 'La commande `circle` et le magique 144° qui dessine une étoile à cinq branches (un pentagramme).',
  },
  13: {
    en: 'Border colour, fill colour, pen size and speed. Plus a culture moment: drawing the Italian flag.',
    fr: 'Couleur du contour, couleur de remplissage, taille du stylo et vitesse. Plus une note culturelle : dessiner le drapeau italien.',
  },
  14: {
    en: 'Nested loops produce mandalas, snowflakes, rainbows and Adinkra symbols. The mathematics of radial art.',
    fr: 'Les boucles imbriquées produisent mandalas, flocons, arcs-en-ciel et symboles Adinkra. La mathématique de l’art radial.',
  },
  15: {
    en: 'A variable is a box with a label. The greatest invention in all of mathematics, brought to your turtle.',
    fr: 'Une variable est une boîte étiquetée. La plus grande invention des mathématiques, au service de ta tortue.',
  },
  16: {
    en: 'Pina speaks: the `input()` function lets you have a conversation. Type your name and Pina greets you.',
    fr: 'Pina parle : la fonction `input()` permet une vraie conversation. Écris ton prénom et Pina te salue.',
  },
  17: {
    en: 'Random numbers turn a copy into a surprise. Every run produces something new.',
    fr: 'Les nombres aléatoires transforment une copie en surprise. Chaque exécution produit quelque chose de nouveau.',
  },
  18: {
    en: 'Teleport Pina anywhere with `goto(x, y)` and tell her where to look with `setheading(angle)`.',
    fr: 'Téléporte Pina partout avec `goto(x, y)` et indique-lui la direction avec `setheading(angle)`.',
  },
  19: {
    en: 'Your first big creative project: a whole garden of random flowers with stems, petals and grass.',
    fr: 'Ton premier grand projet créatif : un jardin entier de fleurs aléatoires avec tiges, pétales et herbe.',
  },
  20: {
    en: 'The `if`/`else` keyword introduces choice. Pina branches like a path in a fairy-tale forest.',
    fr: 'Le mot-clé `if`/`else` introduit le choix. Pina se ramifie comme un chemin dans une forêt de conte.',
  },
  21: {
    en: 'Comparing numbers: greater than, less than, equal to. The grammar of decisions.',
    fr: 'Comparer des nombres : plus grand, plus petit, égal. La grammaire des décisions.',
  },
  22: {
    en: 'Make Pina respond to key presses and mouse clicks. Welcome to interactive art.',
    fr: 'Fais réagir Pina aux touches et aux clics. Bienvenue dans l’art interactif.',
  },
  23: {
    en: 'A full project: a magic whiteboard you draw on with mouse and keyboard. Save a screenshot when you’re done.',
    fr: 'Un projet complet : un tableau magique sur lequel tu dessines à la souris et au clavier. Sauvegarde une capture d’écran à la fin.',
  },
  24: {
    en: 'A function gives a name to a recipe. The fourth thinking skill of computational thinking: abstraction.',
    fr: 'Une fonction donne un nom à une recette. La quatrième compétence de la pensée informatique : l’abstraction.',
  },
  25: {
    en: 'Build your own command with `def`. You become the designer, not just the user.',
    fr: 'Construis ta propre commande avec `def`. Tu deviens créatrice, plus seulement utilisatrice.',
  },
  26: {
    en: 'Add parameters to your function. Now the same function can draw a thousand different things.',
    fr: 'Ajoute des paramètres à ta fonction. La même fonction peut alors dessiner mille choses différentes.',
  },
  27: {
    en: 'Big finishing project for Part VI: a complete house with garden, using functions you wrote yourself.',
    fr: 'Grand projet final de la Partie VI : une maison avec un jardin, construite avec tes propres fonctions.',
  },
  28: {
    en: 'A game is just a loop that listens for the player. Meet the game loop.',
    fr: 'Un jeu, c’est juste une boucle qui écoute la joueuse. Voici la boucle de jeu.',
  },
  29: {
    en: 'Mini-game: catch the apple before it falls. Your first playable game.',
    fr: 'Mini-jeu : attrape la pomme avant qu’elle ne tombe. Ton premier jeu jouable.',
  },
  30: {
    en: 'Mini-game: navigate a labyrinth without touching the walls.',
    fr: 'Mini-jeu : traverse un labyrinthe sans toucher les murs.',
  },
  31: {
    en: 'Mini-game: classic Pong with the keyboard. Two paddles, one ball.',
    fr: 'Mini-jeu : le Pong classique au clavier. Deux raquettes, une balle.',
  },
  32: {
    en: 'Mini-game: build a small Snake. A snake that grows when it eats.',
    fr: 'Mini-jeu : construis un petit Snake. Un serpent qui grandit en mangeant.',
  },
  33: {
    en: 'Errors are friends bringing information. The first rule of debugging.',
    fr: 'Les erreurs sont des amies qui apportent de l’information. La première règle du débogage.',
  },
  34: {
    en: 'The five-step bug liturgy used in Argentina’s public schools — and now in our kitchen.',
    fr: 'La liturgie du bug en cinq étapes, utilisée dans les écoles publiques argentines — et désormais dans notre cuisine.',
  },
  35: {
    en: 'Talk to the rubber duck. Explain your code out loud. The bug will surface by itself.',
    fr: 'Parle au canard en plastique. Explique ton code à voix haute. Le bug se montrera tout seul.',
  },
  36: {
    en: 'The five most common mistakes a child of eight makes, and how to recognise each one in three seconds.',
    fr: 'Les cinq erreurs les plus courantes à 8 ans, et comment les reconnaître en trois secondes.',
  },
  37: {
    en: 'Investigate someone else’s code. Predict, run, modify. The art of reading code.',
    fr: 'Enquête sur le code de quelqu’un d’autre. Prédire, exécuter, modifier. L’art de lire le code.',
  },
  38: {
    en: 'Start from existing code and remix it. Originality is overrated; remix is real life.',
    fr: 'Pars d’un code existant et remixe-le. L’originalité est surestimée ; le remix, c’est la vraie vie.',
  },
  39: {
    en: 'Twenty project ideas to keep going for the next year, from snowflake generator to family quiz game.',
    fr: 'Vingt idées de projets pour continuer pendant un an : du générateur de flocons au quiz familial.',
  },
  40: {
    en: 'Keep a programmer’s diary: what you tried, what failed, what you learned. The single most powerful habit.',
    fr: 'Tiens un journal de programmeuse : ce que tu as essayé, ce qui n’a pas marché, ce que tu as appris. L’habitude la plus puissante.',
  },
  41: {
    en: 'A checklist to know what you have mastered and what is still to come.',
    fr: 'Une liste pour savoir ce que tu maîtrises et ce qui reste à venir.',
  },
  42: {
    en: 'The final gallery, what to learn next, and a note from Pina.',
    fr: 'La galerie finale, la suite du voyage, et un mot de Pina.',
  },
};

// --- Appendix section translations ---
const sectionTr = {
  1: { en: '50 challenges by ascending difficulty', fr: '50 défis par difficulté croissante' },
  2: { en: '20 free-theme project ideas', fr: '20 idées de projets à thème libre' },
  3: { en: '30 debugging exercises', fr: '30 exercices de débogage' },
  4: { en: 'Printable cards', fr: 'Fiches à imprimer' },
  5: { en: 'Self-assessment rubric', fr: 'Grille d’auto-évaluation' },
  6: { en: 'Kid-friendly glossary', fr: 'Glossaire pour enfants' },
  7: { en: 'Curiosities and stories', fr: 'Curiosités et histoires' },
  8: { en: 'For the parent: lesson plans (45 minutes each)', fr: 'Pour le parent : plans de leçon (45 min chacun)' },
  9: { en: 'Chapter-to-session map', fr: 'Carte chapitres-séances' },
  10: { en: 'Follow-up resources', fr: 'Ressources pour aller plus loin' },
  11: { en: 'Thematic mini-projects', fr: 'Mini-projets thématiques' },
  12: { en: 'Code reading exercises (PRIMM Investigate)', fr: 'Lectures de code (phase Investigate du PRIMM)' },
  13: { en: 'A visual concept map', fr: 'Une carte visuelle des concepts' },
  14: { en: 'Sentences you will remember forever', fr: 'Phrases que tu retiendras toujours' },
};

// Build manuale.it / manuale.en / manuale.fr (overlays add titles+summaries; body translated when available)
function buildVariant(lang) {
  const body = lang === 'it' ? null : BODY[lang];
  const parts = MANUALE.parts.map(part => {
    const tr = partsTr[part.roman];
    const bodyPart = body ? (body.parts[part.roman] || {}) : {};
    const intro = bodyPart.intro != null
      ? bodyPart.intro
      : (lang === 'it' ? part.intro : (tr ? `> ${tr[lang].intro}` : part.intro));
    const chapters = part.chapters.map(ch => {
      const t = chapterTr[ch.number];
      const sum = chapterSummary[ch.number];
      const translatedContent = body ? body.chapters[ch.number] : null;
      return {
        ...ch,
        title: lang === 'it' ? ch.title : (t ? t[lang] : ch.title),
        title_it: ch.title,
        summary: lang === 'it' ? '' : (sum ? sum[lang] : ''),
        content: translatedContent != null ? translatedContent : ch.content,
        content_translated: translatedContent != null,
      };
    });
    return {
      ...part,
      title: lang === 'it' ? part.title : (tr ? tr[lang].title : part.title),
      title_it: part.title,
      intro,
      intro_translated: bodyPart.intro != null,
      chapters,
    };
  });
  const preamble = (body && body.preamble) ? body.preamble : MANUALE.preamble;
  return { preamble, preamble_translated: !!(body && body.preamble), parts };
}

function buildApp(lang) {
  const body = lang === 'it' ? null : APP_BODY[lang];
  const sections = APPENDICE.sections.map(s => {
    const tr = sectionTr[s.number];
    const translatedContent = body ? body.sections[s.number] : null;
    return {
      ...s,
      title: lang === 'it' ? s.title : (tr ? tr[lang] : s.title),
      title_it: s.title,
      content: translatedContent != null ? translatedContent : s.content,
      content_translated: translatedContent != null,
    };
  });
  const preamble = (body && body.preamble) ? body.preamble : APPENDICE.preamble;
  return { preamble, sections };
}

for (const lang of ['it', 'en', 'fr']) {
  fs.writeFileSync(
    path.join(ROOT, 'public', 'data', `manuale.${lang}.json`),
    JSON.stringify(buildVariant(lang), null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.join(ROOT, 'public', 'data', `appendice.${lang}.json`),
    JSON.stringify(buildApp(lang), null, 2),
    'utf-8'
  );
}

console.log('Wrote IT/EN/FR overlays for manuale and appendice.');
