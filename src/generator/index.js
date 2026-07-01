import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { searchTrends } from '../search.js';
import { readHistory, appendHistory } from '../memory/history.js';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});
const MODEL = 'deepseek-chat';
const __dir = dirname(fileURLToPath(import.meta.url));

// Editorial ratios
const CONTENT_TYPES = {
  story:     { weight: 0.40, label: 'Histoire vraie',      emoji: '📖' },
  framework: { weight: 0.30, label: 'Framework / Méthode', emoji: '⚡' },
  opinion:   { weight: 0.20, label: 'Opinion / Analyse',   emoji: '💡' },
  news:      { weight: 0.10, label: 'Actualité commentée', emoji: '🤖' },
};

const EMOTIONS = ['stress', 'doute', 'frustration', 'surprise', 'curiosité', 'conflit', 'déclic', 'fierté'];

// File loaders
const load = (rel) => readFile(join(__dir, rel), 'utf8');
const loadJSON = (rel) => load(rel).then(JSON.parse);

// ─── Pickers ─────────────────────────────────────────────────────────────────

function pickContentType(history) {
  const recentTypes = history.slice(-3).map(h => h.contentType);
  let chosen = 'story';
  const rand = Math.random();
  let cum = 0;
  for (const [type, { weight }] of Object.entries(CONTENT_TYPES)) {
    cum += weight;
    if (rand < cum) { chosen = type; break; }
  }
  // Avoid 2 identical types in a row
  if (recentTypes.slice(-2).every(t => t === chosen)) {
    const others = Object.keys(CONTENT_TYPES).filter(t => t !== chosen);
    chosen = others[Math.floor(Math.random() * others.length)];
  }
  return chosen;
}

function pickFromLibrary(items, history, historyKey) {
  const recentIds = new Set(history.slice(-14).map(h => h[historyKey]).filter(Boolean));
  const pool = items.filter(item => !recentIds.has(item.id));
  const source = pool.length > 0 ? pool : items;
  return source[Math.floor(Math.random() * source.length)];
}

function pickEmotion(history, storyEmotion) {
  if (storyEmotion) return storyEmotion;
  const recent = new Set(history.slice(-3).map(h => h.emotion));
  const pool = EMOTIONS.filter(e => !recent.has(e));
  const source = pool.length > 0 ? pool : EMOTIONS;
  return source[Math.floor(Math.random() * source.length)];
}

function pickCTA(ctas, history) {
  const recentIdx = new Set(history.slice(-5).map(h => h.ctaIndex).filter(i => i != null));
  const pool = ctas.map((c, i) => ({ c, i })).filter(({ i }) => !recentIdx.has(i));
  const source = pool.length > 0 ? pool : ctas.map((c, i) => ({ c, i }));
  const picked = source[Math.floor(Math.random() * source.length)];
  return { text: picked.c, index: picked.i };
}

// ─── Prompt builders ──────────────────────────────────────────────────────────

function buildSystemPrompt(k) {
  return [
    '# VOIX\n' + k.voice,
    '# CONVICTIONS\n' + k.beliefs,
    '# STYLE D\'ÉCRITURE\n' + k.style,
    '# PHRASES INTERDITES — si tu en écris une, recommence ce bloc\n' + k.antiPatterns,
    '# ALGORITHME LINKEDIN\n' + k.algorithm,
    '---',
    'Génère UNIQUEMENT le texte du post. Commence directement par la première phrase d\'accroche. Zéro introduction, zéro "voici le post", zéro séparateur (---). Post brut, prêt à coller sur LinkedIn.',
  ].join('\n\n');
}

function buildUserPrompt({ contentType, story, framework, hook, cta, trends, emotion, recentPosts }) {
  const typeInfo = CONTENT_TYPES[contentType];
  let p = `TYPE : ${typeInfo.label}\nÉMOTION DOMINANTE : ${emotion}\n\n`;

  if (story) {
    p += `HISTOIRE À RACONTER :\n`;
    p += `Industrie : ${story.industry}\n`;
    p += `Contexte : ${story.context}\n`;
    p += `Problème : ${story.problem}\n`;
    p += `Insight clé : ${story.insight}\n`;
    p += `Leçon : ${story.lesson}\n\n`;
  }

  if (framework && contentType !== 'opinion') {
    p += `FRAMEWORK À ENSEIGNER :\n`;
    p += `Nom : "${framework.name}"\n`;
    p += `Description : ${framework.description}\n`;
    p += `Étapes : ${framework.steps.map((s, i) => `${i + 1}. ${s}`).join(' | ')}\n\n`;
  }

  if (hook) {
    p += `HOOK PATTERN (inspire-toi — ne copie pas mot pour mot) :\n`;
    p += `Type : ${hook.type}\n`;
    p += `Pattern : ${hook.pattern}\n`;
    p += `Exemple : "${hook.example}"\n\n`;
  }

  p += `CALL TO ACTION FINAL :\n${cta.text}\n\n`;

  if (trends.length > 0) {
    p += `ACTUALITÉS RÉCENTES (injecte naturellement si pertinent) :\n`;
    p += trends.slice(0, 3).map(t => `• ${t.title}${t.date ? ` (${t.date})` : ''} — ${t.snippet}`).join('\n');
    p += '\n\n';
  }

  const topPosts = recentPosts
    .filter(p => p.stats?.vues)
    .sort((a, b) => (b.stats.vues || 0) - (a.stats.vues || 0))
    .slice(0, 2);
  if (topPosts.length > 0) {
    p += `MEILLEURS POSTS RÉCENTS (ce qui a résonné) :\n`;
    p += topPosts.map(post => `• ${post.theme || post.contentType} (${post.stats.vues} vues) — "${post.excerpt}"`).join('\n');
    p += '\n\n';
  }

  p += `ANGLE OBLIGATOIRE : écris pour un CEO, fondateur ou directeur digital — pas pour un designer. Le lecteur ne connaît pas le jargon design. Il reconnaît : ses utilisateurs qui partent, son support qui sature, son app qui ne convertit pas, son budget mal investi. Traduis tout en langage business et résultats concrets.

Génère le post maintenant.`;
  return p;
}

// ─── DeepSeek calls ───────────────────────────────────────────────────────────

async function callDeepSeek(system, user, maxTokens = 1024) {
  const res = await client.chat.completions.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  });
  return res.choices[0].message.content.trim();
}

async function reviewPost(content) {
  const reviewerPrompt = await load('../prompts/reviewer.md');
  const text = await callDeepSeek(
    reviewerPrompt,
    `Évalue ce post LinkedIn :\n\n${content}`,
    400
  );
  const scoreMatch = text.match(/SCORE_TOTAL:\s*(\d+\.?\d*)/);
  const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/);
  return {
    score: scoreMatch ? parseFloat(scoreMatch[1]) : 7.0,
    feedback: feedbackMatch ? feedbackMatch[1].trim() : 'Révise le hook et renforce la valeur actionnable.',
  };
}

async function rewritePost(content, feedback, systemPrompt) {
  const user = `Voici un post LinkedIn à améliorer.\n\nFEEDBACK DU RÉVISEUR :\n${feedback}\n\nPOST ORIGINAL :\n${content}\n\nRéécris ce post en corrigeant exactement les points faibles signalés. Garde la même histoire et le même angle. Ne réécris que ce qui est critiqué.`;
  return callDeepSeek(systemPrompt, user);
}

async function humanDetectorPass(content) {
  const sys = 'Tu es un éditeur expert. Tu détectes les phrases IA-génériques et les remplaces par un langage naturel et personnel.';
  const user = `Lis ce post LinkedIn :\n\n${content}\n\nDétecte les phrases qui sonnent comme du contenu généré par IA : formules creuses, poncifs, conclusions moralisatrices, transitions trop lisses, tout ce qu'un vrai professionnel ne dirait pas naturellement.\n\nRéécris UNIQUEMENT ces phrases avec un ton plus direct, sec, et conversationnel. Garde le reste identique — structure, longueur, hashtags.\n\nRetourne uniquement le post complet final. Aucun commentaire, aucune introduction.`;
  return callDeepSeek(sys, user, 900);
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generatePost(recentPosts = []) {
  // Load everything in parallel
  const [voice, beliefs, style, antiPatterns, algorithm, stories, frameworks, hooks, ctas, history] = await Promise.all([
    load('../knowledge/voice.md'),
    load('../knowledge/beliefs.md'),
    load('../knowledge/writing_style.md'),
    load('../knowledge/anti_patterns.md'),
    load('../knowledge/linkedin_algorithm.md'),
    loadJSON('../stories/stories.json'),
    loadJSON('../frameworks/frameworks.json'),
    loadJSON('../hooks/hooks.json'),
    loadJSON('../cta/cta.json'),
    readHistory(),
  ]);

  const knowledge = { voice, beliefs, style, antiPatterns, algorithm };

  // Pick all elements
  const contentType = pickContentType(history);
  const story       = pickFromLibrary(stories,    history, 'storyId');
  const framework   = pickFromLibrary(frameworks, history, 'frameworkId');
  const hook        = pickFromLibrary(hooks,      history, 'hookId');
  const cta         = pickCTA(ctas, history);
  const emotion     = pickEmotion(history, story?.emotion);

  // News only for news type
  const trends = contentType === 'news'
    ? await searchTrends('Actualités Tech & IA').catch(() => [])
    : [];

  // Generate
  const systemPrompt = buildSystemPrompt(knowledge);
  const userPrompt   = buildUserPrompt({ contentType, story, framework, hook, cta, trends, emotion, recentPosts });
  let content        = await callDeepSeek(systemPrompt, userPrompt);

  // Review + rewrite loop (max 2 attempts)
  const { score, feedback } = await reviewPost(content);
  console.log(`[generator] score=${score} type=${contentType} story=${story?.id} hook=${hook?.id}`);

  let rewriteCount = 0;
  if (score < 8.5) {
    content = await rewritePost(content, feedback, systemPrompt);
    rewriteCount++;

    const { score: s2, feedback: f2 } = await reviewPost(content);
    console.log(`[generator] rewrite1 score=${s2}`);
    if (s2 < 8.5) {
      content = await rewritePost(content, f2, systemPrompt);
      rewriteCount++;
      console.log(`[generator] rewrite2 done`);
    }
  }

  // Human detector pass
  let finalContent = await humanDetectorPass(content);

  // Strip markdown artifacts that slip through
  finalContent = finalContent
    .replace(/^---+$/gm, '')        // separator lines
    .replace(/^#{1,3}\s+/gm, '')    // markdown headers
    .replace(/\n{3,}/g, '\n\n')     // triple+ newlines → double
    .trim();

  // Save to editorial history
  await appendHistory({
    date:        new Date().toISOString().split('T')[0],
    contentType,
    emotion,
    storyId:     story?.id    ?? null,
    frameworkId: framework?.id ?? null,
    hookId:      hook?.id     ?? null,
    ctaIndex:    cta.index,
    score,
    rewriteCount,
  });

  const typeInfo = CONTENT_TYPES[contentType];
  return {
    content:    finalContent,
    themeName:  typeInfo.label,
    themeEmoji: typeInfo.emoji,
    meta: { contentType, score, storyId: story?.id, frameworkId: framework?.id, rewriteCount },
  };
}
