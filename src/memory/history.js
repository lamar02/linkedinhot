import { readData, writeData } from '../storage.js';

const KEY = 'ghostwriter_history.json';
const MAX_ENTRIES = 50;

export async function readHistory() {
  const data = await readData(KEY);
  return data?.entries ?? [];
}

export async function appendHistory(entry) {
  try {
    const data = await readData(KEY);
    const entries = [...(data?.entries ?? []), entry].slice(-MAX_ENTRIES);
    await writeData(KEY, { entries });
  } catch (err) {
    console.warn('[history] Could not save history entry:', err.message);
  }
}

export async function getHistorySummary() {
  const entries = await readHistory();
  if (entries.length === 0) return null;

  const typeCounts = {};
  const emotionCounts = {};
  const scoredEntries = entries.filter(e => e.score);

  for (const e of entries) {
    typeCounts[e.contentType] = (typeCounts[e.contentType] || 0) + 1;
    if (e.emotion) emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
  }

  const avgScore = scoredEntries.length
    ? (scoredEntries.reduce((s, e) => s + e.score, 0) / scoredEntries.length).toFixed(1)
    : null;

  return { typeCounts, emotionCounts, avgScore, totalPosts: entries.length };
}
