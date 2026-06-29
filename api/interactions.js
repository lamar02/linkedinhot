import { verifyKey } from 'discord-interactions';
import { waitUntil } from '@vercel/functions';

export const config = { api: { bodyParser: false } };

const DISCORD_API = 'https://discord.com/api/v10';

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function followUp(appId, token, content) {
  await fetch(`${DISCORD_API}/webhooks/${appId}/${token}/messages/@original`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  const isValid = verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);
  if (!isValid) return res.status(401).end('Invalid signature');

  const interaction = JSON.parse(rawBody.toString());

  if (interaction.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  if (interaction.type === 2) {
    const { name, options = [] } = interaction.data;
    const appId = process.env.DISCORD_APPLICATION_ID;
    const token = interaction.token;
    const opt = (key) => options.find(o => o.name === key)?.value ?? null;

    // Garder la fonction Vercel active jusqu'à la fin du travail async
    waitUntil(handleCommand(name, opt, appId, token));

    // Répondre immédiatement à Discord (< 3s)
    return res.status(200).json({ type: 5, data: { flags: 64 } });
  }

  return res.status(400).end();
}

async function handleCommand(name, opt, appId, token) {
  try {
      const [
        { readOrInit, writeData },
        { getTheme },
        { generateWeeklySummary, getLastUntrackedPost },
        { getPostDaysLabel },
      ] = await Promise.all([
        import('../src/storage.js'),
        import('../src/themes.js'),
        import('../src/stats.js'),
        import('../src/scheduler.js'),
      ]);

      if (name === 'next') {
        const schedule = await readOrInit('schedule.json');
        const theme = getTheme(schedule.themeIndex);
        const postDays = getPostDaysLabel();
        await followUp(appId, token, [
          `📅 **Prochain post**`,
          `Thème : ${theme.emoji} **${theme.name}**`,
          `Jours de post cette semaine : ${postDays}`,
          `Posts générés au total : ${schedule.postCount}`,
        ].join('\n'));
      }

      else if (name === 'stats') {
        const postsData = await readOrInit('posts.json');
        const post = getLastUntrackedPost(postsData.posts);
        if (!post) {
          await followUp(appId, token, '❌ Aucun post sans stats. Génère un post avec `/generate`.');
          return;
        }
        post.stats = {
          vues: opt('vues'), likes: opt('likes'),
          commentaires: opt('commentaires'), clics: opt('clics'),
          updatedAt: new Date().toISOString(),
        };
        await writeData('posts.json', postsData);
        const lines = [
          `✅ **Stats sauvegardées** — ${post.id} (${post.theme})`,
          opt('vues') ? `👀 ${Number(opt('vues')).toLocaleString('fr-FR')} vues` : null,
          opt('likes') ? `❤️ ${opt('likes')} likes` : null,
          opt('commentaires') ? `💬 ${opt('commentaires')} commentaires` : null,
          opt('clics') ? `🔗 ${opt('clics')} clics` : null,
        ].filter(Boolean).join('\n');
        await followUp(appId, token, lines);
      }

      else if (name === 'summary') {
        const postsData = await readOrInit('posts.json');
        await followUp(appId, token, generateWeeklySummary(postsData.posts));
      }

      else if (name === 'generate') {
        const schedule = await readOrInit('schedule.json');
        const postsData = await readOrInit('posts.json');
        const theme = getTheme(schedule.themeIndex);
        await followUp(appId, token, `⏳ Génération en cours — thème : ${theme.emoji} ${theme.name}`);

        const { generatePost } = await import('../src/claude.js');
        const { sendPost } = await import('../src/discord.js');

        const content = await generatePost(schedule.themeIndex, postsData.posts.slice(-10));
        const discordMsg = await sendPost(process.env.DISCORD_CHANNEL_ID, theme, content);

        postsData.posts.push({
          id: new Date().toISOString().split('T')[0] + '-forced',
          date: new Date().toISOString(),
          theme: theme.name, themeIndex: schedule.themeIndex,
          excerpt: content.slice(0, 120), content,
          discordMessageId: discordMsg?.id ?? null, forced: true,
          stats: { vues: null, likes: null, commentaires: null, clics: null, updatedAt: null },
        });
        await writeData('posts.json', postsData);
        schedule.themeIndex = (schedule.themeIndex + 1) % 7;
        schedule.postCount = (schedule.postCount || 0) + 1;
        await writeData('schedule.json', schedule);
        await followUp(appId, token, `✅ Post envoyé dans #linkedin-posts !`);
      }

      else {
        await followUp(appId, token, '❓ Commande inconnue.');
      }
  } catch (err) {
    console.error('[interactions]', name, err);
    await followUp(appId, token, `⚠️ Erreur : ${err.message}`).catch(() => {});
  }
}
