# 🚀 Déploiement rapide - Environnement DEV

## 📋 Prérequis

- **Node.js 22** ou supérieur (configuré avec `.nvmrc`)
- **npm 10** ou supérieur
- **Compte Azure** avec abonnement actif
- **Repository GitHub** configuré

## ⚡ Déploiement en 3 étapes

### 1️⃣ Test local

```bash
npm run build
npm run preview
```

### 2️⃣ Créer Azure Static Web App

- **Portail Azure** → Créer une ressource → Static Web App
- **Nom**: `mj-twitter-analyzer-dev`
- **Source**: GitHub → `mjezequel-exp/mj-twitter-analyzer`
- **Build preset**: Custom
- **App location**: `/`
- **Output location**: `dist`

### 3️⃣ Configurer les secrets GitHub (3 secrets)

Allez dans **Settings** → **Secrets and variables** → **Actions**

**Secrets requis (configuration hybride optimisée):**

```
VITE_AZURE_OPENAI_KEY=[VOTRE_CLE_API_AZURE_OPENAI]
VITE_APP_APPINSIGHTS_CONNECTION_STRING=[VOTRE_CONNECTION_STRING_APPINSIGHTS]
AZURE_STATIC_WEB_APPS_API_TOKEN_DEV=[TOKEN_AZURE_STATIC_WEB_APP]
```

**📋 Comment récupérer le token Azure :**

1. Azure Portal → votre Static Web App → **"Manage deployment token"**
2. Copiez le token affiché
3. Ajoutez-le comme secret GitHub avec le nom exact ci-dessus

**Variables publiques déjà configurées** dans `.env.development`:

- ✅ `VITE_APP_ENV=Development`
- ✅ `VITE_APP_AZURE_AD_CLIENTID=aefb238c-639f-4279-94cd-e05a08511f40`
- ✅ `VITE_APP_AZURE_AD_TENANTID=868b0608-0093-46a4-8c06-369376d02e93`
- ✅ `VITE_APP_AZURE_AD_SCOPES=openid profile`
- ✅ `VITE_AZURE_OPENAI_ENDPOINT=https://mj-twitter-analyzer.openai.azure.com/`
- ✅ `VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4o`
- ✅ `VITE_AZURE_OPENAI_VERSION=2025-01-01-preview`

## 🎯 Déploiement automatique

1. **Commit & Push** sur `main`
2. **GitHub Actions** se déclenche automatiquement
3. **Application déployée** en quelques minutes

## 🔗 Liens utiles

- **Documentation complète**: [`DEPLOYMENT-DEV.md`](./DEPLOYMENT-DEV.md)
- **Configuration GitHub Actions**: [`.github/workflows/azure-static-web-apps-dev.yml`](./.github/workflows/azure-static-web-apps-dev.yml)
- **Configuration Azure**: [`public/staticwebapp.config.json`](./public/staticwebapp.config.json)

## ⚠️ Points d'attention

- ✅ **Build testé** et fonctionnel
- ✅ **Configuration hybride** optimisée (secrets minimaux)
- ✅ **Workflow GitHub** configuré (`azure-static-web-apps-dev.yml`)
- ⚠️ **3 secrets GitHub** à configurer manuellement
- 🔐 **Token Azure** à récupérer depuis Azure Portal après création de la Static Web App
- ❌ **ERREUR COMMUNE** : Oublier le token Azure → échec du déploiement

---

**🎉 Configuration optimisée - 3 secrets stratégiques à gérer !**
