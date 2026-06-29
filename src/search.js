const SERPER_API = 'https://google.serper.dev/news';

const THEME_QUERIES = {
  'UX Research & Insights': ['UX research methodology insights site:nngroup.com OR site:smashingmagazine.com OR site:uxdesign.cc 2026', 'user research trends product design 2026'],
  'Product Design Stories': ['product design case study app redesign 2026', 'UX product design lessons learned startup'],
  'Flutter Development Tips': ['Flutter 3 update news 2026 site:flutter.dev OR site:medium.com', 'Flutter mobile app development tips 2026'],
  'Design System & Best Practices': ['Figma new feature update 2026', 'design system component library 2026 product team'],
  'GovTech & Fintech Cases': ['fintech mobile app Africa UX 2026', 'digital payment Africa user experience'],
  'Expérience & Challenges': ['UX designer career growth 2026', 'product designer remote work challenges'],
  'Product Strategy & Business': ['design ROI user experience business impact 2026', 'product strategy UX conversion rate'],
};

const GLOBAL_QUERIES = [
  'Figma AI features update 2026',
  'AI UX design tools product designers 2026',
  'mobile app UX trends 2026 site:uxdesign.cc OR site:smashingmagazine.com',
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
