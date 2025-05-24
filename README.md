# 📱 Shorts - Lecteur Vidéo Vertical Mobile

Un lecteur vidéo vertical mobile avec navigation d'épisodes et système de paywall, créé avec Next.js, TypeScript et Tailwind CSS.

## 🚀 Démo Live

[https://shorts-blond.vercel.app/](https://shorts-blond.vercel.app/)

## ✨ Fonctionnalités

- **🎥 Lecteur vidéo vertical** - Streaming HLS optimisé pour mobile
- **📺 Navigation entre épisodes** - Swipe vertical pour naviguer entre les épisodes
- **💳 Système de paywall** - Modal de souscription avant l'épisode 3
- **📱 Mobile-first** - Interface optimisée pour appareils mobiles
- **⚡ Performance** - Chargement rapide et transitions fluides
- **🎨 Design moderne** - Interface inspirée des apps natives

## 🛠 Stack Technique

- **Framework** : Next.js 15.3.2
- **Language** : TypeScript
- **Styling** : Tailwind CSS v4
- **Vidéo** : HLS.js pour le streaming
- **Navigation** : Swiper.js pour les transitions
- **Déploiement** : Vercel

## 🚀 Installation

```bash
# Cloner le projet
git clone [url-du-repo]
cd shorts

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

src/
├── app/ # App Router (Next.js 13+)
├── components/
│ ├── player/ # Composants du lecteur vidéo
│ ├── videoSwipper/ # Navigation entre vidéos
│ └── ui/ # Composants UI réutilisables
├── hooks/ # Hooks React personnalisés
├── lib/ # Utilitaires et types
└── mockups/ # Données de test

## 🎮 Navigation

- **URL Structure** : `/serie-id/episode-id`
- **Exemple** : `/the-affair/episode-1`
- **Navigation** : Swipe vertical entre les épisodes
- **Paywall** : Affiché avant l'épisode 3

## 🎯 Épisodes Disponibles

1. **EP.1** - Introduction de l'histoire
2. **EP.2** - Développement du conflit
3. **EP.3** - Résolution (nécessite un abonnement)

## 📱 Optimisations Mobile

- Interface tactile intuitive
- Gestion des gestes de swipe
- Chargement progressif des vidéos
- Contrôles adaptatifs
- Performance optimisée

## 🚀 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification du code
```

---

_Créé dans le cadre d'un case study technique pour Shorts_
