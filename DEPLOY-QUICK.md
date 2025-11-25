# 🚀 Déploiement rapide - Environnement DEV

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

### 3️⃣ Configurer les secrets GitHub (seulement 2!)

Allez dans **Settings** → **Secrets and variables** → **Actions**

**Secrets requis (configuration hybride optimisée):**

```
VITE_AZURE_OPENAI_KEY=[VOTRE_CLE_API_AZURE_OPENAI]
VITE_APP_APPINSIGHTS_CONNECTION_STRING=[VOTRE_CONNECTION_STRING_APPINSIGHTS]
```

**Variables publiques déjà configurées** dans `.env.development`:

- ✅ `VITE_APP_AZURE_AD_TENANTID`
- ✅ `VITE_AZURE_OPENAI_ENDPOINT`
- ✅ `VITE_AZURE_OPENAI_DEPLOYMENT`
- ✅ `VITE_APP_AZURE_AD_SCOPES`
- ✅ `VITE_AZURE_OPENAI_VERSION`

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
- ⚠️ **2 secrets GitHub** seulement à configurer manuellement
- 🔐 **Token Azure** auto-généré lors de la création de la Static Web App

---

**🎉 Configuration optimisée - Seulement 2 secrets à gérer !**
