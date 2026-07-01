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
  const header = `📝 **POST LINKEDIN DU JOUR** | ${theme.emoji} ${theme.name}`;
  const footer = '📊 Poste sur LinkedIn, puis reviens noter avec `/stats`';
  const separator = '─'.repeat(40);

  // Discord limit: 2000 chars. Calculate budget for the post content.
  const overhead = header.length + footer.length + separator.length * 2 + 8; // newlines
  const maxContent = 2000 - overhead;
  const trimmedContent = content.length > maxContent
    ? content.slice(0, maxContent - 3).trimEnd() + '…'
    : content;

  const message = [header, '', separator, '', trimmedContent, '', separator, '', footer].join('\n');

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
