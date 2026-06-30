import { generatePost } from '../../src/generator/index.js';
import { sendPost, sendMessage } from '../../src/discord.js';
import { isTodayPostDay, alreadyPostedToday, getNextSchedule } from '../../src/scheduler.js';
import { readOrInit, writeData } from '../../src/storage.js';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).end();
  }

  const cronSecret = req.headers['authorization']?.replace('Bearer ', '');
  if (process.env.NODE_ENV === 'production' && cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const schedule = await readOrInit('schedule.json');
    const postsData = await readOrInit('posts.json');

    if (alreadyPostedToday(schedule.lastPostDate)) {
      return res.status(200).json({ skipped: true, reason: 'already_posted_today' });
    }

    const forced = req.query.force === '1';
    if (!forced && !isTodayPostDay()) {
      return res.status(200).json({ skipped: true, reason: 'not_a_post_day' });
    }

    const recentPosts = postsData.posts.slice(-10);
    const { content, themeName, themeEmoji, meta } = await generatePost(recentPosts);

    const theme = { name: themeName, emoji: themeEmoji };
    const discordMsg = await sendPost(process.env.DISCORD_CHANNEL_ID, theme, content);

    const newPost = {
      id:              new Date().toISOString().split('T')[0],
      date:            new Date().toISOString(),
      theme:           themeName,
      contentType:     meta.contentType,
      excerpt:         content.slice(0, 120),
      content,
      discordMessageId: discordMsg?.id ?? null,
      meta,
      stats: { vues: null, likes: null, commentaires: null, clics: null, updatedAt: null },
    };

    postsData.posts.push(newPost);
    await writeData('posts.json', postsData);

    const newSchedule = { ...schedule, ...getNextSchedule(schedule) };
    await writeData('schedule.json', newSchedule);

    return res.status(200).json({ ok: true, theme: themeName, score: meta.score, postCount: newSchedule.postCount });
  } catch (err) {
    console.error('[cron/daily]', err);

    try {
      await sendMessage(
        process.env.DISCORD_CHANNEL_ID,
        `⚠️ **Erreur cron daily** : ${err.message}`
      );
    } catch {}

    return res.status(500).json({ error: err.message });
  }
}
