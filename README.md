# 803z-web-client

Bienvenue sur le repo du client web de 803z, une application React moderne utilisant React Router v7 (anciennement appelé Remix), TailwindCSS.
Ce client est conçu pour fonctionner avec le serveur 803z, qui fournit les API nécessaires pour l'authentification et la gestion des données.

## Prérequis

- Node.js 20.10.0
- npm 10.2.3

## Pour commencer

### Installation

Installez les dépendances :

```bash
npm install
```

### Développement

Pour démarrer le serveur de développement :

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`.

## Build pour la production

Pour compiler une version de production :

```bash
npm run build
```

## Déploiement

### Déploiement Docker

Pour construire et exécuter avec Docker :

```bash
docker build -t my-app .

# Exécuter le conteneur
docker run -p 3000:3000 my-app
```

### Déploiement manuel

Si tu es familier avec le déploiement d’applications Node, le serveur intégré est prêt pour la production.
Déploie le résultat de `npm run build`

```
├── package.json
├── package-lock.json (ou pnpm-lock.yaml, ou bun.lockb)
├── build/
    ├── client/    # Assets statiques
    └── server/    # Code côté serveur
```

## Style

Le client web utilise TailwindCSS (tu peux personnaliser la configuration dans `tailwind.config.js`).
