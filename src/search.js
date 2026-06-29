const SERPER_API = 'https://google.serper.dev/news';

const THEME_QUERIES = {
  'UX Research & Insights': ['UX research insights 2026', 'user research trends design'],
  'Product Design Stories': ['product design case study 2026', 'design thinking startup'],
  'Flutter Development Tips': ['Flutter framework news 2026', 'Flutter mobile development'],
  'Design System & Best Practices': ['design system trends 2026', 'Figma new features'],
  'GovTech & Fintech Cases': ['fintech Africa mobile 2026', 'GovTech digital services'],
  'Expérience & Challenges': ['UX designer career 2026', 'product designer challenges'],
  'Product Strategy & Business': ['design ROI business impact 2026', 'product strategy UX'],
};

const GLOBAL_QUERIES = [
  'Figma update features 2026',
  'AI design tools trending 2026',
  'UX UI design trends 2026',
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
