import OpenAI from 'openai';
import { getTheme } from './themes.js';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// Switch to Claude later: change baseURL + apiKey env var + model name
const MODEL = 'deepseek-chat';

const SYSTEM_PROMPT = `Tu es Lionel Adjei, UX/UI Designer, Product Designer et Flutter Developer basé à Abidjan, Côte d'Ivoire. Tu as 5+ ans d'expérience en conception de produits digitaux pour des startups, entreprises fintech, SaaS, et institutions gouvernementales (dont le Ministère de la Justice de Côte d'Ivoire).

Ton objectif LinkedIn : attirer des startups et entreprises qui ont besoin de UX/UI Design, Product Design, Flutter Development et UX Research.

Ton ton : conversationnel et authentique, professionnel mais accessible, orienté résultats et concret. Tu partages ton vécu réel, pas des généralités.

Format du post LinkedIn idéal :
- Première ligne accrocheuse (max 2 lignes) — donne envie de cliquer "Voir plus"
- Corps du post avec paragraphes courts (2-3 lignes max)
- Ligne vide entre chaque paragraphe
- Emojis utilisés avec parcimonie et pertinence (max 5-6 par post)
- Appel à l'action fort en fin de post
- 3-5 hashtags pertinents à la toute fin
- Longueur : 150-300 mots

Langue : français principalement, termes techniques en anglais acceptés.

Génère UNIQUEMENT le texte du post, sans introduction ni explication.`;

export async function generatePost(themeIndex, recentPosts = []) {
  const theme = getTheme(themeIndex);

  let performanceContext = '';
  const topPosts = recentPosts
    .filter(p => p.stats?.vues)
    .sort((a, b) => (b.stats.vues || 0) - (a.stats.vues || 0))
    .slice(0, 3);

  if (topPosts.length > 0) {
    const topThemes = topPosts.map(p => `${p.theme} (${p.stats.vues} vues)`).join(', ');
    performanceContext = `\n\nContexte de performance (posts récents avec le plus d'engagement) : ${topThemes}. Capitalise sur ce qui résonne.`;
  }

  const userPrompt = `Génère un post LinkedIn sur le thème : **${theme.name}** ${theme.emoji}

Guidance : ${theme.promptHint}

Idées d'accroches pour inspirer le style (ne les copie pas, crée quelque chose de frais) :
${theme.hooks.map(h => `- ${h}`).join('\n')}${performanceContext}

Génère le post maintenant.`;

  const completion = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
  });

  return completion.choices[0].message.content.trim();
}
