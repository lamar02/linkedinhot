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
        { generateWeeklySummary, getLastUntrackedPost },
        { getPostDaysLabel },
        { getHistorySummary },
      ] = await Promise.all([
        import('../src/storage.js'),
        import('../src/stats.js'),
        import('../src/scheduler.js'),
        import('../src/memory/history.js'),
      ]);

      if (name === 'next') {
        const [schedule, historySummary] = await Promise.all([
          readOrInit('schedule.json'),
          getHistorySummary(),
        ]);
        const postDays = getPostDaysLabel();
        const lines = [
          `📅 **Prochain post — GhostWriter v2**`,
          `Jours de post cette semaine : ${postDays}`,
          `Posts générés au total : ${schedule.postCount}`,
        ];
        if (historySummary) {
          const { typeCounts, avgScore, totalPosts } = historySummary;
          const typeList = Object.entries(typeCounts).map(([t, n]) => `${t}: ${n}`).join(', ');
          lines.push(`📊 Score moyen : ${avgScore}/10 (${totalPosts} posts)`);
          lines.push(`📁 Répartition : ${typeList}`);
        } else {
          lines.push(`🤖 Le GhostWriter choisit le type dynamiquement (ratios: 40% histoire, 30% framework, 20% opinion, 10% actu)`);
        }
        await followUp(appId, token, lines.join('\n'));
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
        const [schedule, postsData] = await Promise.all([
          readOrInit('schedule.json'),
          readOrInit('posts.json'),
        ]);
        await followUp(appId, token, `⏳ GhostWriter en cours de génération…`);

        const { generatePost } = await import('../src/generator/index.js');
        const { sendPost } = await import('../src/discord.js');

        const { content, themeName, themeEmoji, meta } = await generatePost(postsData.posts.slice(-10));
        const discordMsg = await sendPost(process.env.DISCORD_CHANNEL_ID, { name: themeName, emoji: themeEmoji }, content);

        postsData.posts.push({
          id:              new Date().toISOString().split('T')[0] + '-forced',
          date:            new Date().toISOString(),
          theme:           themeName,
          contentType:     meta.contentType,
          excerpt:         content.slice(0, 120),
          content,
          discordMessageId: discordMsg?.id ?? null,
          forced:          true,
          meta,
          stats: { vues: null, likes: null, commentaires: null, clics: null, updatedAt: null },
        });
        await writeData('posts.json', postsData);
        schedule.postCount = (schedule.postCount || 0) + 1;
        await writeData('schedule.json', schedule);
        await followUp(appId, token, `✅ Post envoyé ! Type: ${themeEmoji} ${themeName} | Score reviewer: ${meta.score}/10 | Rewrites: ${meta.rewriteCount}`);
      }

      else {
        await followUp(appId, token, '❓ Commande inconnue.');
      }
  } catch (err) {
    console.error('[interactions]', name, err);
    await followUp(appId, token, `⚠️ Erreur : ${err.message}`).catch(() => {});
  }
}
