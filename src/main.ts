import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import { msalInstance } from "./authConfig";
import { AppInsightsPlugin, appInsightsOptions } from "./plugins/appInsightsPlugin";
import { msalPlugin } from "./plugins/msalPlugin";
import { MsalNavigationClient } from "./router/MsalNavigationClient";
import { settings } from "./settings";

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

// Only load Application Insights if connection string is provided
if (settings.appInsights.connectionString) {
    console.log("Loading Application Insights with connection string");
    app.use(AppInsightsPlugin, appInsightsOptions);
} else {
    console.log("Application Insights not loaded - no connection string provided");
}

// Log errors to the console (otherwise they are swallowed by App Insights)
app.config.errorHandler = (err, vm, info): void => {
    console.error(err, vm, info);
};

app.mount("#app");
