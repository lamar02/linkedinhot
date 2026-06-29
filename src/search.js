const SERPER_API = 'https://google.serper.dev/news';

const THEME_QUERIES = {
  'UX Research & Insights': [
    'UX research insights 2026 site:nngroup.com OR site:uxdesign.cc',
    'user research method discovery product 2026',
  ],
  'Product Design Stories': [
    'product design case study redesign results 2026',
    'app redesign UX impact business 2026',
  ],
  'Tech & Startups en Afrique': [
    'startup tech Afrique Côte d\'Ivoire Abidjan 2026',
    'African tech ecosystem fintech mobile 2026',
    'Afrique numérique innovation startup 2026',
  ],
  'Design System & Flutter': [
    'Figma Config 2026 update features',
    'Flutter 3 update mobile development 2026',
    'design system component library team 2026',
  ],
  'Actualités Tech & IA': [
    'AI tools designers product 2026',
    'Figma AI feature announcement 2026',
    'intelligence artificielle design UX 2026',
    'Apple Google Microsoft AI product update 2026',
  ],
  'Expérience & Vie de Créatif': [
    'freelance designer career Africa remote work 2026',
    'créatif indépendant Afrique travail 2026',
  ],
  'Business & Impact': [
    'design ROI business impact startup 2026',
    'UX conversion rate business growth 2026',
    'digital business Côte d\'Ivoire 2026',
  ],
};

const GLOBAL_QUERIES = [
  'Figma major update AI 2026',
  'tech news Africa startup funding 2026',
  'AI product design tools update 2026',
  'application mobile tendance Afrique 2026',
];

export async function searchTrends(themeName) {
  if (!process.env.SERPER_API_KEY) return [];

  const themeQueries = THEME_QUERIES[themeName] || [];
  const queries = [...themeQueries.slice(0, 1), GLOBAL_QUERIES[Math.floor(Math.random() * GLOBAL_QUERIES.length)]];

  const results = [];

  await Promise.all(queries.map(async (query) => {
    try {
      const res = await fetch(SERPER_API, {
        method: 'POST',
        headers: {
          'X-API-KEY': process.env.SERPER_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ q: query, num: 3, tbs: 'qdr:m' }),
      });
      if (!res.ok) return;
      const data = await res.json();
      for (const item of data.news || []) {
        results.push({ title: item.title, snippet: item.snippet, date: item.date });
      }
    } catch {}
  }));

  return results.slice(0, 5);
}
