import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { AppInsightsPlugin, appInsightsOptions } from "./plugins/appInsightsPlugin";
import { msalPlugin } from "./plugins/msalPlugin";
import { msalInstance } from "./services/MsalService";

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
