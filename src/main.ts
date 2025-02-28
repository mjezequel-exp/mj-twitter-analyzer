import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import { msalInstance } from "./authConfig";
import { AppInsightsPlugin, appInsightsOptions } from "./plugins/appInsightsPlugin";
import { msalPlugin } from "./plugins/msalPlugin";
import { MsalNavigationClient } from "./router/MsalNavigationClient";

// Provide a custom navigation client to MSAL to enable client-side routing
const navigationClient = new MsalNavigationClient(router);
msalInstance.setNavigationClient(navigationClient);

// Set first MSAL account as active account
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(msalPlugin, msalInstance);
app.use(AppInsightsPlugin, appInsightsOptions);

// Log errors to the console (otherwise they are swallowed by App Insights)
app.config.errorHandler = (err, vm, info): void => {
    console.error(err, vm, info);
};

app.mount("#app");
