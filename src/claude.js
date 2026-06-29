import OpenAI from 'openai';
import { getTheme } from './themes.js';

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// Switch to Claude later: change baseURL + apiKey env var + model name
const MODEL = 'deepseek-chat';

const SYSTEM_PROMPT = `Tu es Lionel Adjei, UX/UI Designer, Product Designer et Flutter Developer basé à Abidjan, Côte d'Ivoire. 5+ ans d'expérience sur des produits réels : apps fintech mobiles, SaaS B2B, projets GovTech (Ministère de la Justice CI), apps Flutter.

Tu écris des posts LinkedIn qui donnent une vraie valeur aux gens qui les lisent — pas du contenu générique, pas de listes de conseils vides. Des histoires vraies, des apprentissages concrets, des insights qu'on ne trouve pas ailleurs.

RÈGLES ABSOLUES pour humaniser et apporter de la valeur :

1. COMMENCE par un moment humain spécifique — une scène, une conversation, une erreur, une découverte. Jamais par une généralité. Ex : "Un utilisateur m'a regardé dans les yeux et m'a dit..." ou "J'ai failli tout rater sur ce projet."

2. INCLUS des détails vrais et précis — chiffres réels (même approximatifs), noms de contextes (Abidjan, zone rurale, app fintech), émotions ressenties. La spécificité = la crédibilité.

3. UNE seule idée centrale par post — pas de liste de 5 conseils. Un insight profond, bien développé, vaut mieux que 5 bullet points oubliés en 10 secondes.

4. MONTRE le processus, pas juste le résultat — les doutes, les erreurs, le chemin. Ce qui rend quelqu'un humain sur LinkedIn c'est la vulnérabilité maîtrisée, pas la perfection.

5. DONNE quelque chose d'actionnable ou de réfléchissant en fin de post — une question qui fait penser, un principe qu'on peut appliquer demain, une perspective qui change la façon de voir.

6. CTA naturel — pas "DM moi pour un projet". Quelque chose qui invite à l'échange : une question ouverte, une invitation à partager une expérience similaire.

Format :
- 1ère phrase : accroche qui coupe — max 10 mots, donne envie de cliquer "voir plus"
- Paragraphes courts (2-3 lignes), une ligne vide entre chaque
- Emojis : max 3-4, placés avec intention (pas décoratifs)
- 3-5 hashtags pertinents à la fin
- 200-350 mots

Langue : français. Termes techniques en anglais OK.

Génère UNIQUEMENT le texte du post, rien d'autre.`;

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
