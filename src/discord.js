const DISCORD_API = 'https://discord.com/api/v10';

async function discordRequest(method, path, body) {
  const res = await fetch(`${DISCORD_API}${path}`, {
    method,
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Discord API ${method} ${path} failed (${res.status}): ${error}`);
  }

  return res.status === 204 ? null : res.json();
}

export async function sendPost(channelId, theme, content) {
  const separator = '─'.repeat(40);
  const message = [
    `📝 **POST LINKEDIN DU JOUR** | ${theme.emoji} ${theme.name}`,
    '',
    separator,
    '',
    content,
    '',
    separator,
    '',
    '📊 Après avoir posté sur LinkedIn, reviens noter tes résultats avec `/stats`',
  ].join('\n');

  return discordRequest('POST', `/channels/${channelId}/messages`, { content: message });
}

export async function sendMessage(channelId, content) {
  return discordRequest('POST', `/channels/${channelId}/messages`, { content });
}

export async function sendEmbed(channelId, embed) {
  return discordRequest('POST', `/channels/${channelId}/messages`, { embeds: [embed] });
}

export function interactionResponse(type, data = {}) {
  return { type, data };
}

export const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5,
};
