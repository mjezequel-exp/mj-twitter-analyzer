# Introduction

Ce document présente les principaux éléments du projet.

## Technologies

Les outils suivants sont nécessaires pour ce projet :

| Techno   | Version         |
|----------|-----------------|
| Node.js  | 16.x minimum   |
| npm      | 8.x minimum    |

> __Note :__ Si vous avez des projets qui dépendent de différentes versions de Node.js, vous pouvez utiliser [nvm](https://github.com/creationix/nvm) ou [nvm-windows](https://github.com/coreybutler/nvm-windows) pour installer plusieurs versions côte à côte.

> __Note :__ Pour mettre à jour npm en sécurité sur Windows, utilisez l'outil  [npm-windows-upgrade](https://www.npmjs.com/package/npm-windows-upgrade).

# Configuration

Au démarrage, le projet charge un ensemble de configurations depuis plusieurs sources (fichiers .env, variables d'environnements, ...).  
Les différentes sources sont chargées dans un ordre prédéfinie, si une configuration est présente dans plusieurs sources, c'est la dernière qui est prise en compte :

## Ordre des sources

1. Fichier .env
2. Fichier .env.{environnement}
3. Fichier .env.development.local (uniquement en environnment Development)
4. Variables d'environnement

## Configurations utilisées

| Clé                                       | Type    | Secret | Localisation         | Utilisation                                                                 | Note                                                                     |
|-------------------------------------------|---------|--------|----------------------|-----------------------------------------------------------------------------|--------------------------------------------------------------------------|
| VITE_APP_ENV                              | string  |        | File                 | Environnement sous lequel s'exécute l'application                           | Development, Staging, Production                                         |
| VITE_APP_APP_INSIGHTS_INSTRUMENTATION_KEY | string  |        | File                 | Clé de connexion à Application Insights                                     | Ne pas mettre dans .env.development, pour ne pas envoyer les logs locaux |
| VITE_APP_AZURE_AD_CALLBACKPATH            | string  |        | File                 | Chemin vers lequel Azure AD redirige après une authentification réussie     |                                                                          |
| VITE_APP_AZURE_AD_CLIENTID                | string  |        | File                 | Client Id Azure AD utilisé pour l'authentification                          |                                                                          |
| VITE_APP_AZURE_AD_INSTANCE                | string  |        | File                 | Url de connection de Azure AD                                               |                                                                          |
| VITE_APP_AZURE_AD_TENANTID                | string  |        | File                 | Id du tenant Azure utilisé pour l'authentification                          |                                                                          |

# Développement en local

## Installer le certificat de développement

Pour développer en local dans les mêmes conditions que la production, il est recommandé d'installer un certificat pour HTTPS.  
Vous pouvez créer et valider simplement un certificat de développement local en utilisant l'outil `dotnet dev-certs` en suivant les étapes ci-dessous :

Installer l'outil `dev-certs` sur votre machine
``` shell
dotnet tool install -g dotnet-dev-certs
```
> __Note :__ Cette commande installe l'outil globalement sur votre machine. Vous n'aurez pas besoin de relancer cette commande la prochaine fois.

Ajouter et valider un certificat local
``` shell
dotnet dev-certs https -t -ep "<project-path>\localhost.pfx" -p "localhost"
```
> __Note :__ Ce certificat n'est pas lié au projet en cours, il peut être utilisé pour __n'importe quel__ site hébergé localement.

> __Note :__ Veillez à bien utiliser l'adresse https://localhost:44340 lorsque vous développez, sinon vous aurez une erreur concernant le certificat.

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
