export const THEMES = [
  {
    index: 0,
    name: 'UX Research & Insights',
    emoji: '🔍',
    promptHint: `Raconte une vraie découverte de terrain — un moment précis où un utilisateur t'a surpris, contredit tes assumptions, ou t'a forcé à repenser tout ton approach. Donne le contexte réel : où tu étais, qui tu observais, ce qui s'est passé. Termine avec l'insight que tu en as tiré et que d'autres designers peuvent appliquer demain.

NE PAS faire : une liste de "5 conseils UX".
FAIRE : une histoire → une tension → une révélation → une leçon.`,
    hooks: [
      "Un utilisateur a détruit 3 semaines de design en 30 secondes.",
      "J'ai passé 2 jours sur le terrain à Abobo. Ce que j'ai vu a changé ma façon de designer.",
      "Tout le monde testait en labo. Moi j'ai testé sous un manguier. Voilà la différence.",
    ],
  },
  {
    index: 1,
    name: 'Product Design Stories',
    emoji: '📖',
    promptHint: `Raconte un projet réel de A à Z en format narratif court — le brief (et ce qui clochait), le moment où tu as compris le vrai problème, la décision de design que tu as prise et pourquoi, et le résultat honnête (pas forcément parfait). Inclus un moment de doute ou d'erreur — ça rend le récit humain.

Structure : situation → tension → décision → résultat + ce que tu ferais différemment.`,
    hooks: [
      "Le client voulait un redesign. Ce dont il avait besoin, c'était tout autre chose.",
      "J'ai livré ce projet. Le client était content. J'avais tort tous les deux.",
      "3 mois de design. Les users n'utilisaient pas la feature principale. Voici pourquoi.",
    ],
  },
  {
    index: 2,
    name: 'Flutter Development Tips',
    emoji: '⚡',
    promptHint: `Partage un moment où le fait de savoir coder en Flutter a changé quelque chose dans ton travail de designer — une décision de design influencée par la technique, une collaboration améliorée avec un dev, une contrainte qui t'a forcé à être plus créatif. Ou une erreur technique que tu as faite et ce qu'elle t'a appris.

Angle : designer qui code = perspective unique. Montre cette dualité concrètement.`,
    hooks: [
      "Le dev m'a dit 'c'est impossible à coder'. J'ai ouvert Flutter et codé moi-même.",
      "Quand tu designes ET tu codes, tu fais des choix différents. Voici un exemple.",
      "J'ai cassé l'app en prod un vendredi soir. Ce que j'ai appris est resté.",
    ],
  },
  {
    index: 3,
    name: 'Design System & Best Practices',
    emoji: '🎨',
    promptHint: `Partage une vraie décision de design system ou de process que tu as prise sur un projet réel — pourquoi tu l'as prise, ce qui s'est passé, et l'impact concret. Évite les définitions génériques ("un design system c'est..."). Entre directement dans la situation : le chaos avant, la décision, l'ordre après.

Focus : une seule décision, bien expliquée, avec impact mesurable ou observable.`,
    hooks: [
      "L'équipe avait 47 nuances de bleu différentes dans le même produit.",
      "J'aurais pu livrer en 2 semaines. J'ai pris 4. Voici pourquoi c'était la bonne décision.",
      "On m'a dit qu'un design system était un luxe pour les startups. J'ai prouvé le contraire.",
    ],
  },
  {
    index: 4,
    name: 'GovTech & Fintech Cases',
    emoji: '🏛️',
    promptHint: `Raconte une expérience spécifique du secteur GovTech (projet Ministère de la Justice CI) ou fintech africaine — les vraies contraintes que tu as rencontrées (faible alphabétisation digitale, feature phones, méfiance envers le numérique, connectivité limitée) et comment tu les as adressées concrètement. Ce que les designers dans d'autres contextes ne comprennent pas forcément.

Ce post doit faire réaliser au lecteur que designer pour l'Afrique, c'est une discipline à part entière.`,
    hooks: [
      "Designer pour le Ministère de la Justice, c'est designer pour des gens qui n'ont jamais eu de smartphone.",
      "En Europe, on design pour des users qui pardonnent les bugs. En Côte d'Ivoire, tu n'as pas cette chance.",
      "60% de nos utilisateurs testaient sur feature phone. Voilà comment ça change tout.",
    ],
  },
  {
    index: 5,
    name: 'Expérience & Challenges',
    emoji: '💡',
    promptHint: `Raconte une histoire personnelle honnête sur ton parcours — un moment où tu as douté, une décision difficile que tu as prise, quelque chose que tu as appris à la dure. Pas de success story lisse. Les meilleures histoires LinkedIn parlent d'un moment de vulnérabilité transformé en force.

Sois précis sur le contexte (Abidjan, ta situation à l'époque, ce qui se passait vraiment). Termine par ce que cette expérience t'a appris — quelque chose que le lecteur peut appliquer à sa propre situation.`,
    hooks: [
      "Pendant 6 mois, j'ai designé des produits que personne n'utilisait. Voici ce que j'ai compris.",
      "J'ai raté ma première mission client. Complètement. Voici ce qui s'est passé.",
      "Un senior designer m'a dit que mon portfolio était moyen. Il avait raison.",
    ],
  },
  {
    index: 6,
    name: 'Product Strategy & Business',
    emoji: '📈',
    promptHint: `Partage une réflexion concrète sur l'impact business du design — mais ancrée dans une situation réelle, pas dans des abstractions. Un moment où le design a changé une métrique, évité une catastrophe, ou convaincu un stakeholder sceptique. Montre que tu comprends le business, pas seulement l'esthétique.

Le message implicite : engager un bon designer, c'est un investissement, pas un coût. Prouve-le avec une histoire, pas avec une affirmation.`,
    hooks: [
      "Le CEO voulait couper le budget UX. Je lui ai montré un seul chiffre. Il a doublé le budget.",
      "On a redesigné l'onboarding en 2 semaines. L'activation a augmenté de 35%.",
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
