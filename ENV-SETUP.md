# 🔐 Configuration des Variables d'Environnement

## Fichiers d'environnement

Ce projet utilise plusieurs fichiers d'environnement pour séparer la configuration publique des secrets :

### 📁 Structure des fichiers env

```
.env.example          # Template avec toutes les variables nécessaires
.env.development      # Valeurs par défaut pour le développement (COMMITÉ)
.env.development.local # Vraies valeurs de développement (NON COMMITÉ)
.env.production       # Configuration de production (COMMITÉ)
.env.production.local # Secrets de production (NON COMMITÉ)
```

### 🚀 Setup rapide

1. **Copier le template :**

    ```bash
    cp .env.example .env.development.local
    ```

2. **Remplir les vraies valeurs dans `.env.development.local` :**
    - `VITE_APP_AZURE_AD_CLIENTID` : Client ID de votre app Azure AD
    - `VITE_APP_AZURE_AD_TENANTID` : Tenant ID Azure AD
    - `VITE_AZURE_OPENAI_ENDPOINT` : Endpoint de votre instance Azure OpenAI
    - `VITE_AZURE_OPENAI_KEY` : Clé API Azure OpenAI
    - `VITE_AZURE_OPENAI_DEPLOYMENT` : Nom de votre déploiement (ex: gpt-4o)

### 🔒 Sécurité

- ✅ **Les fichiers `.local` sont automatiquement ignorés par Git**
- ✅ **Les fichiers sans `.local` ne contiennent que des placeholders**
- ❌ **Ne jamais commiter de vraies clés API ou secrets**

### 🛠️ Variables requises

#### Azure AD (Authentication)

- `VITE_APP_AZURE_AD_CLIENTID` : ID de l'application Azure AD
- `VITE_APP_AZURE_AD_TENANTID` : ID du tenant Azure AD
- `VITE_APP_AZURE_AD_SCOPES` : Scopes demandés (ex: "openid profile")

#### Azure OpenAI

- `VITE_AZURE_OPENAI_ENDPOINT` : URL de votre instance Azure OpenAI
- `VITE_AZURE_OPENAI_KEY` : Clé d'API Azure OpenAI
- `VITE_AZURE_OPENAI_DEPLOYMENT` : Nom du modèle déployé
- `VITE_AZURE_OPENAI_VERSION` : Version de l'API (ex: "2025-01-01-preview")

#### Application Insights (Optionnel)

- `VITE_APP_APPINSIGHTS_CONNECTION_STRING` : Connection string App Insights

### 🔧 Priorité des fichiers

Vite charge les fichiers dans cet ordre (le plus spécifique l'emporte) :

1. `.env.development.local` (priorité maximale)
2. `.env.development`
3. `.env.local`
4. `.env`

### ✅ Vérification de configuration

Pour vérifier que votre configuration est correcte :

```bash
npm run dev
```

Puis ouvrez la console développeur (F12) pour voir les logs de diagnostic Azure OpenAI.
