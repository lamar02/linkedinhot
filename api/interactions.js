import { verifyKey } from 'discord-interactions';
import { readOrInit, writeData } from '../src/storage.js';
import { generatePost } from '../src/claude.js';
import { sendPost, InteractionResponseType } from '../src/discord.js';
import { getTheme } from '../src/themes.js';
import { generateWeeklySummary, getLastUntrackedPost } from '../src/stats.js';
import { getPostDaysLabel } from '../src/scheduler.js';

export const config = { api: { bodyParser: false } };

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function respond(res, type, content) {
  res.status(200).json({ type, data: content ? { content, flags: 64 } : undefined });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  const isValid = verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
  if (!isValid) return res.status(401).end('Invalid signature');

  const interaction = JSON.parse(rawBody.toString());

  // PING
  if (interaction.type === 1) {
    return res.status(200).json({ type: InteractionResponseType.PONG });
  }

  // Slash commands
  if (interaction.type === 2) {
    const { name, options = [] } = interaction.data;
    const opt = (key) => options.find(o => o.name === key)?.value ?? null;

    try {
      if (name === 'stats') {
        const postsData = await readOrInit('posts.json');
        const post = getLastUntrackedPost(postsData.posts);

        if (!post) {
          return respond(res, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            '❌ Aucun post sans stats trouvé. Génère un nouveau post avec `/generate`.');
        }

        post.stats = {
          vues: opt('vues'),
          likes: opt('likes'),
          commentaires: opt('commentaires'),
          clics: opt('clics'),
          updatedAt: new Date().toISOString(),
        };

        await writeData('posts.json', postsData);

        const lines = [
          `✅ **Stats sauvegardées** pour le post du ${post.id} (${post.theme})`,
          opt('vues') ? `👀 Vues : ${Number(opt('vues')).toLocaleString('fr-FR')}` : null,
          opt('likes') ? `❤️ Likes : ${opt('likes')}` : null,
          opt('commentaires') ? `💬 Commentaires : ${opt('commentaires')}` : null,
          opt('clics') ? `🔗 Clics : ${opt('clics')}` : null,
        ].filter(Boolean).join('\n');

        return respond(res, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, lines);
      }

      if (name === 'summary') {
        const postsData = await readOrInit('posts.json');
        const summary = generateWeeklySummary(postsData.posts);
        return respond(res, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, summary);
      }

      if (name === 'next') {
        const schedule = await readOrInit('schedule.json');
        const nextTheme = getTheme(schedule.themeIndex);
        const postDays = getPostDaysLabel();
        const msg = [
          `📅 **Prochain post**`,
          `Thème : ${nextTheme.emoji} **${nextTheme.name}**`,
          `Jours de post cette semaine : ${postDays}`,
          `Posts générés au total : ${schedule.postCount}`,
        ].join('\n');
        return respond(res, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, msg);
      }

      if (name === 'generate') {
        const schedule = await readOrInit('schedule.json');
        const postsData = await readOrInit('posts.json');
        const theme = getTheme(schedule.themeIndex);
        const recentPosts = postsData.posts.slice(-10);

        const content = await generatePost(schedule.themeIndex, recentPosts);
        const channelId = process.env.DISCORD_CHANNEL_ID;
        const discordMsg = await sendPost(channelId, theme, content);

        const newPost = {
          id: new Date().toISOString().split('T')[0] + '-forced',
          date: new Date().toISOString(),
          theme: theme.name,
          themeIndex: schedule.themeIndex,
          excerpt: content.slice(0, 120),
          content,
          discordMessageId: discordMsg?.id ?? null,
          forced: true,
          stats: { vues: null, likes: null, commentaires: null, clics: null, updatedAt: null },
        };

        postsData.posts.push(newPost);
        await writeData('posts.json', postsData);

        schedule.themeIndex = (schedule.themeIndex + 1) % 7;
        schedule.postCount = (schedule.postCount || 0) + 1;
        await writeData('schedule.json', schedule);

        return respond(res, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          `✅ Post généré et envoyé dans #linkedin-posts ! Thème : ${theme.emoji} ${theme.name}`);
      }

      return respond(res, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        '❓ Commande inconnue.');
    } catch (err) {
      console.error('[interactions]', err);
      return respond(res, InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        `⚠️ Erreur : ${err.message}`);
    }
  }

  return res.status(400).end();
}
