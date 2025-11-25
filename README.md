# Introduction

Ce projet est une application Vue 3 + TypeScript d'analyse de messages Twitter utilisant Azure OpenAI, avec authentification Azure AD (MSAL) et déploiement sur Azure Static Web Apps.

## Technologies

| Techno             | Version      | Usage                                |
| ------------------ | ------------ | ------------------------------------ |
| Node.js            | 22.x minimum | Runtime JavaScript                   |
| npm                | 10.x minimum | Gestionnaire de packages             |
| Vue 3              | ^3.5.24      | Framework frontend (Composition API) |
| TypeScript         | ~5.9.3       | Langage typé                         |
| Quasar Framework   | ^2.18.6      | Composants UI Material Design        |
| Azure MSAL Browser | ^4.26.1      | Authentification Azure AD            |
| Azure OpenAI       | Latest       | API d'analyse de texte GPT-4o        |

> **Note :** Si vous avez des projets qui dépendent de différentes versions de Node.js, vous pouvez utiliser [nvm](https://github.com/creationix/nvm) ou [nvm-windows](https://github.com/coreybutler/nvm-windows) pour installer plusieurs versions côte à côte.

> **Note :** Pour mettre à jour npm en sécurité sur Windows, utilisez l'outil [npm-windows-upgrade](https://www.npmjs.com/package/npm-windows-upgrade).

# Configuration

Au démarrage, le projet charge un ensemble de configurations depuis plusieurs sources (fichiers .env, variables d'environnements, ...).  
Les différentes sources sont chargées dans un ordre prédéfinie, si une configuration est présente dans plusieurs sources, c'est la dernière qui est prise en compte :

## Ordre des sources

1. Fichier .env
2. Fichier .env.{environnement}
3. Fichier .env.development.local (uniquement en environnment Development)
4. Variables d'environnement

## Configurations utilisées

### Variables publiques (.env.development)

| Clé                            | Type   | Exemple                                       | Utilisation                                                  |
| ------------------------------ | ------ | --------------------------------------------- | ------------------------------------------------------------ |
| VITE_APP_ENV                   | string | Development                                   | Environnement d'exécution (Development, Staging, Production) |
| VITE_APP_AZURE_AD_CLIENTID     | string | aefb238c-...                                  | Client ID Azure AD pour l'authentification                   |
| VITE_APP_AZURE_AD_TENANTID     | string | 868b0608-...                                  | ID du tenant Azure pour l'authentification                   |
| VITE_APP_AZURE_AD_INSTANCE     | string | https://login.microsoftonline.com             | URL de connexion Azure AD                                    |
| VITE_APP_AZURE_AD_CALLBACKPATH | string | /                                             | Chemin de redirection après authentification                 |
| VITE_APP_AZURE_AD_SCOPES       | string | openid profile                                | Permissions demandées (séparés par espace)                   |
| VITE_AZURE_OPENAI_ENDPOINT     | string | https://mj-twitter-analyzer.openai.azure.com/ | Endpoint Azure OpenAI                                        |
| VITE_AZURE_OPENAI_DEPLOYMENT   | string | gpt-4o                                        | Modèle déployé pour l'analyse                                |
| VITE_AZURE_OPENAI_VERSION      | string | 2025-01-01-preview                            | Version API Azure OpenAI                                     |

### Variables secrètes (GitHub Secrets uniquement)

| Clé                                    | Type   | Localisation  | Utilisation                                  |
| -------------------------------------- | ------ | ------------- | -------------------------------------------- |
| VITE_AZURE_OPENAI_KEY                  | string | GitHub Secret | Clé API Azure OpenAI pour l'authentification |
| VITE_APP_APPINSIGHTS_CONNECTION_STRING | string | GitHub Secret | Chaîne de connexion Application Insights     |
| AZURE_STATIC_WEB_APPS_API_TOKEN_DEV    | string | GitHub Secret | Token de déploiement Azure Static Web Apps   |

**📋 Configuration hybride optimisée** : Variables publiques en local, secrets uniquement sur GitHub pour la production.

## Installer les dépendances

```
npm install
```

### Lancer le serveur de développement local

```
npm run dev
```

### Analyser et corriger les fichiers avec ESLint

```
npm run lint
```
