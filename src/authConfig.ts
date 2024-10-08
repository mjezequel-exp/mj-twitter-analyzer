import { settings } from "./settings";
import { type Configuration, PublicClientApplication } from "@azure/msal-browser";

const msalConfig: Configuration = {
    auth: {
        clientId: settings.azureAd.clientId,
        authority: `${settings.azureAd.instance}/${settings.azureAd.tenantId}/`,
        redirectUri: settings.azureAd.callbackPath,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true,
    },
};

const msalInstance = new PublicClientApplication(msalConfig);
const scopes = settings.azureAd.scopes;

export { msalInstance, scopes };
