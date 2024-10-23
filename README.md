# Introduction

Ce document présente les principaux éléments du projet.

## Technologies

Les outils suivants sont nécessaires pour ce projet :

| Techno  | Version      |
| ------- | ------------ |
| Node.js | 20.x minimum |
| npm     | 10.x minimum |

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

| Clé                                    | Type   | Secret | Localisation | Utilisation                                                             | Note                                                                     |
| -------------------------------------- | ------ | ------ | ------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| VITE_APP_ENV                           | string |        | File         | Environnement sous lequel s'exécute l'application                       | Development, Staging, Production                                         |
| VITE_APP_APPINSIGHTS_CONNECTION_STRING | string |        | File         | Chaine de connexion à Application Insights                              | Ne pas mettre dans .env.development, pour ne pas envoyer les logs locaux |
| VITE_APP_AZURE_AD_CALLBACKPATH         | string |        | File         | Chemin vers lequel Azure AD redirige après une authentification réussie |                                                                          |
| VITE_APP_AZURE_AD_CLIENTID             | string |        | File         | Client Id Azure AD utilisé pour l'authentification                      |                                                                          |
| VITE_APP_AZURE_AD_INSTANCE             | string |        | File         | Url de connection de Azure AD                                           |                                                                          |
| VITE_APP_AZURE_AD_TENANTID             | string |        | File         | Id du tenant Azure utilisé pour l'authentification                      |                                                                          |
| VITE_APP_AZURE_AD_SCOPES               | string |        | File         | Scopes de permission utilisés pour l'authentification Azure AD          | Séparer les scopes par un espace                                         |

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
