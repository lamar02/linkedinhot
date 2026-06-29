export const THEMES = [
  {
    index: 0,
    name: 'UX Research & Insights',
    emoji: '🔍',
    promptHint: `Raconte une vraie découverte de terrain — un moment précis où un utilisateur t'a surpris, contredit tes assumptions, ou t'a forcé à repenser ton approach. Contexte réel : où tu étais, qui tu observais. Termine avec l'insight applicable demain.

NE PAS faire : liste de conseils UX.
FAIRE : histoire → tension → révélation → leçon.`,
    hooks: [
      "Un utilisateur a détruit 3 semaines de design en 30 secondes.",
      "J'ai passé 2 jours à Abobo. Ce que j'ai vu a changé ma façon de designer.",
      "Tout le monde testait en labo. Moi j'ai testé sous un manguier.",
    ],
  },
  {
    index: 1,
    name: 'Product Design Stories',
    emoji: '📖',
    promptHint: `Raconte un projet réel de A à Z : le brief (et ce qui clochait), le vrai problème découvert, la décision prise et pourquoi, le résultat honnête. Inclus un moment de doute ou d'erreur.

Structure : situation → tension → décision → résultat + ce que tu ferais différemment.`,
    hooks: [
      "Le client voulait un redesign. Ce dont il avait besoin, c'était tout autre chose.",
      "J'ai livré ce projet. Le client était content. J'avais tort tous les deux.",
      "3 mois de design. Les users n'utilisaient pas la feature principale.",
    ],
  },
  {
    index: 2,
    name: 'Tech & Startups en Afrique',
    emoji: '🌍',
    promptHint: `Parle de l'écosystème tech africain — une observation sur les startups ivoiriennes ou africaines, une tendance que tu vois émerger à Abidjan, une comparaison entre le marché africain et l'international, ou une réflexion sur les défis et opportunités spécifiques à la tech en Afrique francophone.

Utilise les actualités récentes si pertinent. Angle unique : tu vis à Abidjan, tu travailles sur des produits pour des marchés africains. Tu vois des choses que d'autres ne voient pas.

Ton : observateur curieux, pas conférencier. Partage ce que tu vis réellement.`,
    hooks: [
      "Les startups à Abidjan font des choses que la Silicon Valley ne comprend pas.",
      "J'ai rencontré 3 fondateurs cette semaine. Leur problème commun m'a surpris.",
      "Le digital en Afrique en 2026 : ce que les médias ne montrent pas.",
    ],
  },
  {
    index: 3,
    name: 'Design System & Flutter',
    emoji: '⚡',
    promptHint: `Partage une décision concrète sur un design system ou une expérience Flutter — une règle que tu as instaurée, une erreur technique qui t'a appris quelque chose, ou comment le fait de savoir coder change tes décisions de design. Montre la dualité designer/développeur.

Focus : une seule situation réelle, impact mesurable ou observable.`,
    hooks: [
      "L'équipe avait 47 nuances de bleu différentes dans le même produit.",
      "Le dev m'a dit 'c'est impossible à coder'. J'ai ouvert Flutter et codé moi-même.",
      "J'aurais pu livrer en 2 semaines. J'ai pris 4. Voici pourquoi c'était juste.",
    ],
  },
  {
    index: 4,
    name: 'Actualités Tech & IA',
    emoji: '🤖',
    promptHint: `Réagis à une actualité tech ou IA récente (utilise les actus fournies) en donnant TON point de vue de designer/product designer basé en Afrique. Pas une explication de l'outil — ton analyse de l'impact sur le métier, sur les utilisateurs africains, ou sur la façon dont tu travailles.

Angle : comment cette actu change (ou ne change pas) ta pratique quotidienne ? Qu'est-ce que les médias tech occidentaux ratent dans leur analyse ?

Ton : direct, opiné, pas neutre.`,
    hooks: [
      "Figma vient d'annoncer quelque chose qui change mon workflow. Voici ce que je pense vraiment.",
      "L'IA va remplacer les designers ? Voici ma réponse honnête après 5 ans de terrain.",
      "Une nouvelle app sort. Tout le monde hype. Moi je vois un problème UX majeur.",
    ],
  },
  {
    index: 5,
    name: 'Expérience & Vie de Créatif',
    emoji: '💡',
    promptHint: `Raconte quelque chose de personnel et honnête : un moment difficile dans ta carrière, comment tu gères la vie de freelance à Abidjan, une leçon apprise sur le tard, ou une réflexion sur l'équilibre entre créativité et business.

Pas de success story lisse. Ce qui rend quelqu'un humain sur LinkedIn : la vulnérabilité maîtrisée + une leçon que le lecteur peut appliquer.

Angle possible : vie de créatif en Afrique, travailler avec des clients internationaux depuis Abidjan, construire une réputation sans réseau établi.`,
    hooks: [
      "Pendant 6 mois, j'ai designé des produits que personne n'utilisait.",
      "Un client m'a annulé un contrat 2 jours avant la livraison. Voici ce que j'ai fait.",
      "Travailler depuis Abidjan avec des clients en Europe : la vraie réalité.",
    ],
  },
  {
    index: 6,
    name: 'Business & Impact',
    emoji: '📈',
    promptHint: `Partage une réflexion concrète sur l'impact business du design, une observation économique liée à ton secteur, ou une leçon sur comment faire du business en tant que créatif. Ancrée dans une situation réelle — pas des abstractions.

Peut toucher : le ROI du design, la négociation avec des clients, la valeur perçue du travail créatif en Afrique, comment convaincre un stakeholder sceptique, ou une observation sur le marché du digital en Côte d'Ivoire.`,
    hooks: [
      "Le CEO voulait couper le budget UX. Je lui ai montré un seul chiffre. Il a changé d'avis.",
      "En Côte d'Ivoire, vendre du 'design' c'est encore une bataille. Voici ma stratégie.",
      "La question n'est pas 'combien coûte le design'. C'est 'combien coûte le mauvais design'.",
    ],
  },
];

export function getTheme(index) {
  return THEMES[index % THEMES.length];
}

export function getNextThemeIndex(currentIndex) {
  return (currentIndex + 1) % THEMES.length;
}
