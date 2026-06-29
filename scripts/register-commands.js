const DISCORD_API = 'https://discord.com/api/v10';

const commands = [
  {
    name: 'stats',
    description: 'Enregistre les stats LinkedIn du dernier post non tracké',
    options: [
      { type: 4, name: 'vues', description: 'Nombre de vues', required: false },
      { type: 4, name: 'likes', description: 'Nombre de likes', required: false },
      { type: 4, name: 'commentaires', description: 'Nombre de commentaires', required: false },
      { type: 4, name: 'clics', description: 'Nombre de clics sur le lien', required: false },
    ],
  },
  {
    name: 'summary',
    description: 'Affiche le résumé de performance de la semaine',
    options: [],
  },
  {
    name: 'next',
    description: 'Affiche le prochain thème et les jours de post',
    options: [],
  },
  {
    name: 'generate',
    description: 'Force la génération et l\'envoi d\'un post maintenant',
    options: [],
  },
];

async function register() {
  const appId = process.env.DISCORD_APPLICATION_ID;
  const token = process.env.DISCORD_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!appId || !token) {
    console.error('Missing DISCORD_APPLICATION_ID or DISCORD_TOKEN');
    process.exit(1);
  }

  const endpoint = guildId
    ? `${DISCORD_API}/applications/${appId}/guilds/${guildId}/commands`
    : `${DISCORD_API}/applications/${appId}/commands`;

  const scope = guildId ? `guild ${guildId} (instant)` : 'global (up to 1h delay)';
  console.log(`Registering ${commands.length} commands — scope: ${scope}`);

  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Failed:', err);
    process.exit(1);
  }

  const result = await res.json();
  console.log(`✅ Registered ${result.length} commands:`);
  result.forEach(cmd => console.log(`  /${cmd.name} — ${cmd.description}`));
}

register();
