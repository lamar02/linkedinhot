export function generateWeeklySummary(posts) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weekPosts = posts.filter(p => new Date(p.date) >= oneWeekAgo);
  const trackedPosts = weekPosts.filter(p => p.stats?.vues != null);
  const untrackedCount = weekPosts.length - trackedPosts.length;

  if (weekPosts.length === 0) {
    return '📊 **Résumé semaine** : Aucun post cette semaine.';
  }

  let summary = `📊 **RÉSUMÉ DE LA SEMAINE**\n${'─'.repeat(35)}\n\n`;
  summary += `📝 Posts publiés : **${weekPosts.length}**\n`;

  if (trackedPosts.length > 0) {
    const avg = (arr, key) => {
      const vals = arr.map(p => p.stats[key]).filter(v => v != null);
      return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    };

    const avgVues = avg(trackedPosts, 'vues');
    const avgLikes = avg(trackedPosts, 'likes');
    const avgCommentaires = avg(trackedPosts, 'commentaires');
    const avgClics = avg(trackedPosts, 'clics');

    if (avgVues) summary += `👀 Moyenne vues : **${avgVues.toLocaleString('fr-FR')}**\n`;
    if (avgLikes) summary += `❤️ Moyenne likes : **${avgLikes}**\n`;
    if (avgCommentaires) summary += `💬 Moyenne commentaires : **${avgCommentaires}**\n`;
    if (avgClics) summary += `🔗 Moyenne clics : **${avgClics}**\n`;

    const best = trackedPosts.sort((a, b) => (b.stats.vues || 0) - (a.stats.vues || 0))[0];
    if (best) {
      summary += `\n🏆 **Meilleur post** : ${best.theme}\n`;
      summary += `   → ${best.stats.vues?.toLocaleString('fr-FR')} vues · ${best.stats.likes} likes\n`;
    }

    const byTheme = {};
    for (const post of trackedPosts) {
      if (!byTheme[post.theme]) byTheme[post.theme] = [];
      byTheme[post.theme].push(post.stats.vues || 0);
    }
    const topTheme = Object.entries(byTheme)
      .map(([theme, vues]) => ({ theme, avg: vues.reduce((a, b) => a + b, 0) / vues.length }))
      .sort((a, b) => b.avg - a.avg)[0];

    if (topTheme) {
      summary += `\n💡 **Recommandation** : Continue avec "${topTheme.theme}" — excellentes performances !\n`;
    }
  }

  if (untrackedCount > 0) {
    summary += `\n⚠️ ${untrackedCount} post(s) sans stats — utilise \`/stats\` pour les mettre à jour.\n`;
  }

  summary += `\n${'─'.repeat(35)}`;
  return summary;
}

export function getLastUntrackedPost(posts) {
  return [...posts]
    .reverse()
    .find(p => p.stats?.vues == null);
}

export function formatPostId(date) {
  return new Date(date).toISOString().split('T')[0];
}
