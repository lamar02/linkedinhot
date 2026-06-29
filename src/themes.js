export const THEMES = [
  {
    index: 0,
    name: 'UX Research & Insights',
    emoji: '🔍',
    promptHint: `Partage une découverte de recherche utilisateur, une méthodologie efficace, ou une insight surprenante tirée de tes expériences avec de vraies apps (fintech, GovTech, mobile en Afrique). Sois précis et concret. Inclus des données ou chiffres si possible.`,
    hooks: [
      "Ce que j'ai découvert en testant les apps fintech africaines",
      "5 patterns UX que chaque startup devrait connaître",
      "Ce que disent vraiment les utilisateurs vs ce qu'ils font réellement",
    ],
  },
  {
    index: 1,
    name: 'Product Design Stories',
    emoji: '📖',
    promptHint: `Raconte un cas d'étude réel (ou composite) en format narratif : quel était le problème, quelle solution as-tu conçue, et quels résultats ont été obtenus. Format: situation → insight clé → décision de design → résultat. Sois honnête sur les challenges rencontrés.`,
    hooks: [
      "Comment j'ai redesigné l'expérience d'une app fintech en 6 semaines",
      "Le problème qu'on ne voyait pas jusqu'aux tests utilisateur",
      "Quand le brief dit X mais les users ont besoin de Y",
    ],
  },
  {
    index: 2,
    name: 'Flutter Development Tips',
    emoji: '⚡',
    promptHint: `Partage un conseil pratique sur Flutter, l'intégration design/dev, ou comment tu travailles en tant que designer qui code. Montre que tu comprends les deux mondes. Peut être une astuce technique, un pattern d'architecture UI, ou une leçon sur la collaboration designer-développeur.`,
    hooks: [
      "Comment j'intègre le design directement dans Flutter",
      "5 erreurs Flutter que je vois souvent côté design",
      "Pourquoi savoir coder change mon approche du design",
    ],
  },
  {
    index: 3,
    name: 'Design System & Best Practices',
    emoji: '🎨',
    promptHint: `Aborde les design systems, la cohérence visuelle, les composants réutilisables, l'accessibilité mobile, ou les bonnes pratiques de conception. Partage une approche concrète que tu utilises vraiment dans tes projets. Évite les généralités — donne un exemple précis.`,
    hooks: [
      "Comment j'ai construit un design system pour une startup en croissance",
      "L'accessibilité mobile : ce qu'on oublie presque toujours",
      "Design tokens : pourquoi j'aurais voulu les connaître plus tôt",
    ],
  },
  {
    index: 4,
    name: 'GovTech & Fintech Cases',
    emoji: '🏛️',
    promptHint: `Partage des apprentissages spécifiques au GovTech (ex: projet avec Ministère de la Justice de Côte d'Ivoire) ou à la fintech (apps de paiement mobile, épargne, crédit) en Afrique. Mets en avant les contraintes uniques de ces secteurs — faible alphabétisation digitale, connectivité limitée, confiance — et comment tu les as adressées.`,
    hooks: [
      "Leçons tirées du design pour le Ministère de la Justice de Côte d'Ivoire",
      "La fintech africaine, c'est un autre niveau de complexité UX",
      "Ce que j'ai appris en designant pour des utilisateurs peu familiers avec le digital",
    ],
  },
  {
    index: 5,
    name: 'Expérience & Challenges',
    emoji: '💡',
    promptHint: `Raconte une histoire personnelle et authentique : comment tu as appris quelque chose d'important, un échec formateur, un moment de doute suivi d'une décision courageuse, ou l'évolution de ta carrière de designer à Abidjan. Sois vulnérable et honnête. Les gens s'identifient aux vraies histoires.`,
    hooks: [
      "Comment j'ai appris le Product Design (l'histoire honnête)",
      "Le projet qui m'a appris à dire non",
      "5 ans plus tard, voici ce que je ferais différemment",
    ],
  },
  {
    index: 6,
    name: 'Product Strategy & Business',
    emoji: '📈',
    promptHint: `Parle de l'impact business du design : comment le design réduit l'attrition, augmente la conversion, accélère l'onboarding, ou justifie son ROI. Donne des exemples concrets avec des métriques si possible. Le message clé : le design n'est pas un coût, c'est un investissement stratégique.`,
    hooks: [
      "Comment le design a réduit l'attrition sur une app mobile",
      "Pourquoi commencer par la recherche utilisateur, pas le wireframe",
      "Le ROI du design : une vraie conversation avec des startups",
    ],
  },
];

export function getTheme(index) {
  return THEMES[index % THEMES.length];
}

export function getNextThemeIndex(currentIndex) {
  return (currentIndex + 1) % THEMES.length;
}
