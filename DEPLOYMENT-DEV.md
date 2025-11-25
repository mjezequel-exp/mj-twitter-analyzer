# 🚀 Guide de déploiement - Environnement de développement

Ce guide vous accompagne pour déployer l'environnement de développement sur Azure Static Web Apps.

## 📋 Prérequis

1. **Compte Azure** avec un abonnement actif
2. **Repository GitHub** (déjà configuré)
3. **Workflow GitHub Actions** configuré (`azure-static-web-apps-dev.yml`)

## 🔧 Étape 1 : Créer Azure Static Web App

### Via le portail Azure

1. Connectez-vous au [Portail Azure](https://portal.azure.com)
2. Cliquez sur **"Créer une ressource"**
3. Recherchez **"Static Web App"**
4. Cliquez sur **"Créer"**

### Configuration

- **Nom** : `mj-twitter-analyzer-dev`
- **Région** : `West Europe` (ou votre région préférée)
- **Source** : `GitHub`
- **Repository** : `mjezequel-exp/mj-twitter-analyzer`
- **Branche** : `main`
- **Build presets** : `Custom`
- **App location** : `/`
- **Output location** : `dist`

## 🔐 Étape 2 : Configurer les secrets GitHub

### Variables déjà dans .env.development (publiques)

Ces variables sont **déjà configurées** dans le fichier `.env.development` :

```env
VITE_APP_ENV=Development
VITE_APP_AZURE_AD_TENANTID=868b0608-0093-46a4-8c06-369376d02e93
VITE_APP_AZURE_AD_SCOPES=openid profile
VITE_AZURE_OPENAI_ENDPOINT=https://mj-twitter-analyzer.openai.azure.com/
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4o
VITE_AZURE_OPENAI_VERSION=2025-01-01-preview
```

### Secrets à créer dans GitHub

Allez dans votre repository GitHub > **Settings** > **Secrets and variables** > **Actions**

**Ajoutez ces 3 secrets :**

```
VITE_AZURE_OPENAI_KEY=<votre_cle_azure_openai>
VITE_APP_APPINSIGHTS_CONNECTION_STRING=<votre_connection_string_appinsights>
AZURE_STATIC_WEB_APPS_API_TOKEN_DEV=<token_de_votre_static_web_app>
```

**📋 Récupération du token Azure Static Web App :**

1. **Azure Portal** → votre Static Web App
2. Menu **"Manage deployment token"**
3. **Copiez le token** affiché
4. **Ajoutez-le comme secret GitHub** avec le nom exact `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`

**⚠️ IMPORTANT** : Sans ce token, le déploiement échoue avec l'erreur `deployment_token was not provided`.

## 🚀 Étape 3 : Workflow GitHub Actions

Le fichier `.github/workflows/azure-static-web-apps-dev.yml` est **déjà configuré** et utilise :

### Variables d'environnement automatiques

- Toutes les variables du fichier `.env.development`
- Variables d'environnement Vite standard

### Variables depuis GitHub Secrets

- `VITE_AZURE_OPENAI_KEY` - Clé API Azure OpenAI (sensible)
- `VITE_APP_APPINSIGHTS_CONNECTION_STRING` - Connection string Application Insights (sensible)
- `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` - Token de déploiement Azure (auto-généré)

## 🚀 Étape 4 : Déploiement

### Déploiement automatique

1. **Committez et poussez** votre code sur la branche `main`
2. **GitHub Actions** se déclenche automatiquement
3. **L'application** est construite avec les bonnes variables d'environnement
4. **Déploiement** vers Azure Static Web Apps

```bash
git add .
git commit -m "feat: deploy to Azure Static Web Apps Dev"
git push origin main
```

### Vérification du déploiement

1. **GitHub** : Allez dans l'onglet "Actions" pour voir le workflow
2. **Azure Portal** : Vérifiez le statut de déploiement
3. **URL de test** : Testez votre application déployée

## 🔍 Vérification et test

Une fois le déploiement terminé :

1. **URL de l'application** : Disponible dans Azure Portal > Static Web App > Overview
2. **Logs de déploiement** : GitHub > Actions tab > dernier workflow
3. **Test fonctionnel** :
    - Authentification Azure AD
    - Analyse de messages avec Azure OpenAI
    - Application Insights (télémétrie)

## 🛠️ Configuration hybride actuelle

### ✅ Variables publiques (dans .env.development)

```env
VITE_APP_ENV=Development
VITE_APP_AZURE_AD_TENANTID=868b0608-0093-46a4-8c06-369376d02e93
VITE_APP_AZURE_AD_SCOPES=openid profile
VITE_AZURE_OPENAI_ENDPOINT=https://mj-twitter-analyzer.openai.azure.com/
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4o
VITE_AZURE_OPENAI_VERSION=2025-01-01-preview
```

### 🔐 Variables sensibles (GitHub Secrets uniquement)

- `VITE_AZURE_OPENAI_KEY` - Clé API Azure OpenAI
- `VITE_APP_APPINSIGHTS_CONNECTION_STRING` - Connection string Application Insights

Cette approche **hybride** optimise la sécurité en ne gardant que les secrets vraiment sensibles dans GitHub Secrets.

## 📋 Checklist de déploiement

- [ ] Azure Static Web App créée
- [ ] 3 secrets GitHub configurés (OPENAI_KEY + APPINSIGHTS_CONNECTION_STRING + AZURE_TOKEN)
- [ ] Token Azure auto-généré récupéré
- [ ] Code pushé sur main
- [ ] Workflow GitHub Actions exécuté avec succès
- [ ] Application accessible et fonctionnelle

## 🔧 Dépannage

### Build qui échoue

- Vérifiez que tous les secrets sont configurés
- Consultez les logs GitHub Actions
- Testez le build en local : `npm run build:dev`

### Application qui ne démarre pas

- Vérifiez la console développeur
- Contrôlez la configuration Azure AD dans le portail Azure
- Validez les URLs de redirection

### Azure OpenAI ne fonctionne pas

- Vérifiez que le déploiement Azure OpenAI existe
- Contrôlez les clés et endpoints dans les secrets GitHub
- Testez la connectivité depuis la console développeur

## 📞 Support

En cas de problème, vérifiez :

1. Les logs GitHub Actions
2. La console développeur du navigateur
3. Les métriques Azure dans le portail

---

**🎉 Félicitations !** Votre environnement de développement est prêt !
