import { readHistory } from '../memory/history.js';

// Analyse les 20 derniers posts et retourne les patterns qui performent
export async function getPerformanceContext(recentPosts = []) {
  const history = await readHistory();
  const trackedHistory = history.filter(h => h.score);

  // Top content types par score moyen
  const typeScores = {};
  for (const h of trackedHistory) {
    if (!typeScores[h.contentType]) typeScores[h.contentType] = [];
    typeScores[h.contentType].push(h.score);
  }
  const bestType = Object.entries(typeScores)
    .map(([type, scores]) => ({ type, avg: scores.reduce((a, b) => a + b, 0) / scores.length }))
    .sort((a, b) => b.avg - a.avg)[0];

  // Top posts LinkedIn par vues
  const topLinkedIn = recentPosts
    .filter(p => p.stats?.vues)
    .sort((a, b) => (b.stats.vues || 0) - (a.stats.vues || 0))
    .slice(0, 3);

  return { bestType, topLinkedIn };
}

// Retourne des suggestions d'ajustement basées sur les performances
export async function getOptimizationHints(recentPosts = []) {
  const { bestType, topLinkedIn } = await getPerformanceContext(recentPosts);
  const hints = [];

  if (bestType) {
    hints.push(`Le type "${bestType.type}" performe le mieux (score moyen ${bestType.avg.toFixed(1)}/10).`);
  }

  if (topLinkedIn.length > 0) {
    const topThemes = topLinkedIn.map(p => p.theme || p.contentType).join(', ');
    hints.push(`Meilleurs posts LinkedIn récents : ${topThemes}.`);
  }

  return hints;
}
