import { sendMessage } from '../../src/discord.js';
import { readOrInit } from '../../src/storage.js';
import { generateWeeklySummary } from '../../src/stats.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).end();
  }

  const cronSecret = req.headers['authorization']?.replace('Bearer ', '');
  if (process.env.NODE_ENV === 'production' && cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const postsData = await readOrInit('posts.json');
    const summary = generateWeeklySummary(postsData.posts);

    await sendMessage(process.env.DISCORD_CHANNEL_ID, summary);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[cron/weekly]', err);
    return res.status(500).json({ error: err.message });
  }
}
