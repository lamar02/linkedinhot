Tu es un développeur expert Node.js/Vercel. Crée un bot LinkedIn Discord complet et production-ready selon ces spécifications :

## 📌 CONTEXTE
Je m'appelle Lionel Adjei, UX/UI Designer • Product Designer • Flutter Developer basé à Abidjan, Côte d'Ivoire. 
J'ai 5+ ans d'expérience en conception de produits digitaux (Mobile Apps, SaaS, Fintech, GovTech).
Je veux automatiser ma présence LinkedIn pour attirer des startups et entreprises qui ont besoin de:
- UX/UI Design
- Product Design
- Flutter Development
- UX Research

Je veux un bot Discord qui génère du contenu LinkedIn de qualité, me le notifie chaque jour, et apprend de mes résultats.

## 🎯 FONCTIONNALITÉS PRINCIPALES

### 1. Génération de contenu IA
- Utiliser Claude API pour générer des posts LinkedIn
- Ton : conversationnel, professionnel mais accessible, orienté résultats
- Contenu varié basé sur mon expertise réelle
- Posts de qualité, prêts à poster directement sur LinkedIn

### 2. Envoi automatique sur Discord
- Channel cible : #linkedin-posts
- Fréquence : 3-4 fois par semaine
- Horaire de vérification : 18h chaque jour
- Format du message Discord avec emojis et contenu du post

### 3. Tracking des stats
- Utilisateur réagit avec 👍 + message avec les chiffres (vues, likes, commentaires, clics)
- Bot sauvegarde les données pour analyse

### 4. Analyse & Apprentissage
- Tracker quels types de posts performent le mieux
- Sauvegarder les stats en JSON
- Adapter la génération future selon les résultats
- Afficher un résumé hebdomadaire

## 📅 PLAN 30 JOURS (Rotation des 7 thèmes ADAPTÉS À MON PROFIL)

1. **UX Research & Insights** - Partage de recherches utilisateur, méthodologies, découvertes clés
   Exemple: "Ce que j'ai découvert en testant les apps fintech africaines" / "5 patterns UX que chaque startup devrait connaître"

2. **Product Design Stories** - Cas d'étude complets : problème → solution → résultats
   Exemple: Comment j'ai redesigné l'expérience d'une app fintech / Le workflow de conception d'un produit SaaS

3. **Flutter Development Tips** - Conseils pratiques pour les devs et designers
   Exemple: "Comment j'intègre design et développement Flutter" / "5 erreurs de dev que je vois souvent"

4. **Design System & Best Practices** - Design systems, composants, bonnes pratiques
   Exemple: "Construire un design system pour une startup en croissance" / "L'accessibilité dans la conception mobile"

5. **GovTech & Fintech Cases** - Retours d'expérience spécifiques à ces secteurs
   Exemple: Leçons tirées du travail avec le Ministère de la Justice / Complexités de la design fintech en Afrique

6. **Expérience & Challenges** - Histoires personnelles, apprentissages, obstacles surmontés
   Exemple: "Comment j'ai appris le Product Design" / "Les défis de la conception pour les marchés africains"

7. **Product Strategy & Business** - Réflexions sur l'impact du design, stratégie produit, croissance
   Exemple: "Comment le design peut réduire l'attrition utilisateur" / "Pourquoi commencer par la recherche utilisateur"

Distribution : 3-4 posts/semaine en respectant cette rotation

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack
- Node.js + Express pour Vercel Functions
- JSON local pour la base de données (data/ folder)
- Discord API v14
- Claude API
- Vercel pour hosting + Cron jobs

### Structure projet