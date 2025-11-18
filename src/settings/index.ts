export const settings = {
    environment: import.meta.env.VITE_APP_ENV as string,
    azureAd: {
        clientId: import.meta.env.VITE_APP_AZURE_AD_CLIENTID as string,
        tenantId: import.meta.env.VITE_APP_AZURE_AD_TENANTID as string,
        scopes: (import.meta.env.VITE_APP_AZURE_AD_SCOPES as string).split(" "),
        instance: import.meta.env.VITE_APP_AZURE_AD_INSTANCE as string,
        callbackPath: import.meta.env.VITE_APP_AZURE_AD_CALLBACKPATH as string,
    },
    azureOpenAI: {
        endpoint: import.meta.env.VITE_AZURE_OPENAI_ENDPOINT as string,
        apiKey: import.meta.env.VITE_AZURE_OPENAI_KEY as string,
        deployment: import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT as string,
        apiVersion: import.meta.env.VITE_AZURE_OPENAI_VERSION as string,
    },
    webApi: {
        baseUrl: import.meta.env.VITE_APP_WEB_API_BASE_URL as string,
    },
    appInsights: {
        connectionString: import.meta.env.VITE_APP_APPINSIGHTS_CONNECTION_STRING as string,
    },
};
