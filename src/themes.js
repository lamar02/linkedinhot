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
      "J'ai analysé 23 sessions de test en 2 semaines. 80% des abandons venaient du même endroit.",
      "Tout le monde parle d'empathie. J'ai arrêté d'en parler. Voilà ce que je fais à la place.",
      "Mon client m'a dit 'les utilisateurs adorent l'app'. Les vrais utilisateurs m'ont dit autre chose.",
      "Mauvaise nouvelle reçue en plein test utilisateur. Ce que j'ai fait ensuite a changé le projet.",
    ],
  },
  {
    index: 1,
    name: 'Product Design Stories',
    emoji: '📖',
    promptHint: `Raconte un projet réel de A à Z : le brief (et ce qui clochait), le vrai problème découvert, la décision prise et pourquoi, le résultat honnête. Inclus un moment de doute ou d'erreur.

Structure : situation → tension → décision → résultat + ce que tu ferais différemment.`,
    hooks: [
      "J'ai livré ce projet. Le client était ravi. 6 semaines plus tard, le taux d'abandon avait doublé.",
      "Le brief disait 'redesign complet'. Le vrai problème était dans 3 lignes de code.",
      "3 mois de travail. 47 maquettes. Les utilisateurs n'ouvraient pas la feature principale.",
      "J'ai failli refuser ce projet. C'est devenu le meilleur cas d'étude de ma carrière.",
      "Le stakeholder voulait ajouter 5 features. J'en ai supprimé 2. Le résultat : +34% de rétention.",
    ],
  },
  {
    index: 2,
    name: 'Tech & Startups en Afrique',
    emoji: '🌍',
    promptHint: `Parle de l'écosystème tech africain avec fierté et réalisme — une observation sur les startups ivoiriennes ou africaines, une tendance que tu vois émerger, un succès africain à l'international, ou une réflexion sur ce que le monde rate dans son analyse de la tech africaine.

CONTEXTE CHAUD 2026 à utiliser si pertinent :
- Côte d'Ivoire à VivaTech 2026 Paris : 20 startups + 10 PME numériques présentes — une première africaine historique
- Macron s'est arrêté au stand ivoirien à VivaTech
- Startups CI qui signent des deals en Europe (Kaydan, etc.)
- Ministère de la Transition Numérique CI très actif
- Accélération du numérique en Afrique francophone

Angle unique : tu vis et travailles à Abidjan. Tu vois ce que ni les VCs étrangers ni les journalistes tech ne voient de Paris ou New York.

Célèbre les succès africains avec pride, pas avec condescendance. Ton : observateur curieux avec une perspective insider.`,
    hooks: [
      "J'ai rencontré 4 fondateurs de startups ivoiriennes ce mois-ci. Ils avaient tous le même problème.",
      "La Côte d'Ivoire avait 20 startups à VivaTech Paris. Ce que j'ai retenu de ce moment historique.",
      "Most African founders think branding starts with a logo. Voilà par où ça commence vraiment.",
      "Les VCs étrangers analysent l'Afrique depuis Paris. Ce qu'ils ratent complètement.",
      "L'écosystème tech ivoirien en 2026 : ce que les médias ne montrent pas encore.",
      "Macron s'est arrêté au stand ivoirien à VivaTech. Ce que ça signifie pour notre écosystème.",
    ],
  },
  {
    index: 3,
    name: 'Design System & Flutter',
    emoji: '⚡',
    promptHint: `Partage une décision concrète sur un design system ou une expérience Flutter — une règle que tu as instaurée, une erreur technique qui t'a appris quelque chose, ou comment le fait de savoir coder change tes décisions de design. Montre la dualité designer/développeur.

Focus : une seule situation réelle, impact mesurable ou observable.`,
    hooks: [
      "L'équipe avait 47 nuances de bleu différentes dans le même produit. Voilà comment on a tout remis à plat.",
      "Le dev m'a dit 'impossible à coder'. J'ai ouvert Flutter et codé moi-même. Il avait raison — et tort.",
      "J'ai passé 3 jours à documenter ce que personne ne voulait documenter. Ça a sauvé le projet 6 mois plus tard.",
      "Tout le monde construit des design systems. 80% les abandonnent après 3 mois. Voilà pourquoi.",
      "Designer et coder le même composant m'a appris quelque chose qu'aucune formation ne m'a enseigné.",
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
      "Figma vient d'annoncer X. Tout le monde est enthousiaste. Moi j'ai une question que personne ne pose.",
      "J'ai testé 6 outils IA de design en 2 semaines. Voilà lequel j'ai gardé — et pourquoi les 5 autres ont échoué.",
      "L'IA va remplacer les designers ? Après 5 ans de terrain en Afrique, ma réponse va te surprendre.",
      "Une app avec 50M de téléchargements vient de sortir une update. J'ai repéré 3 erreurs UX en 90 secondes.",
      "OpenAI / Figma / Apple vient de publier quelque chose. Ce que ça signifie vraiment pour nous.",
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
      "Pendant 8 mois, j'ai accepté tous les projets. Puis j'ai dit non à un client. Ça a tout changé.",
      "Un client m'a annulé 48h avant la livraison. Ce que j'ai fait ensuite m'a valu 3 recommandations.",
      "Ma pire semaine en tant que freelance m'a appris ce que 2 ans de formation n'ont pas pu m'apprendre.",
      "J'ai failli tout arrêter en 2024. Voilà ce qui m'a fait continuer — et ce que j'ai changé.",
      "Travailler en remote pour des clients internationaux depuis Abidjan : ce que personne ne te dit.",
    ],
  },
  {
    index: 6,
    name: 'Business & Impact',
    emoji: '📈',
    promptHint: `Partage une réflexion concrète sur l'impact business du design, une observation économique liée à ton secteur, ou une leçon sur comment faire du business en tant que créatif. Ancrée dans une situation réelle — pas des abstractions.

Peut toucher : le ROI du design, la négociation avec des clients, la valeur perçue du travail créatif en Afrique, comment convaincre un stakeholder sceptique, ou une observation sur le marché du digital en Côte d'Ivoire.`,
    hooks: [
      "Le CEO voulait couper le budget UX. Je lui ai montré un seul tableau. Il a augmenté le budget.",
      "La question n'est pas 'combien coûte le design'. C'est 'combien te coûte le mauvais design'.",
      "J'ai calculé le coût réel d'une mauvaise UX sur une app de 10 000 utilisateurs. Le chiffre est brutal.",
      "Convaincre un client du ROI du design en Afrique : voici exactement ce que je dis — et ce que je ne dis plus.",
      "Un redesign qu'on m'a refusé. 6 mois plus tard, le concurrent l'a fait. Le client a perdu 30% de sa base.",
    ],
  },
];

export function getTheme(index) {
  return THEMES[index % THEMES.length];
}

export function getNextThemeIndex(currentIndex) {
  return (currentIndex + 1) % THEMES.length;
}
