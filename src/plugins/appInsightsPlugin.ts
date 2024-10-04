import router from "@/router";
import { settings } from "@/settings";
import { AppInsightsPlugin } from "vue3-application-insights";
import type { AppInsightsPluginOptions } from "vue3-application-insights";

const appInsightsOptions: AppInsightsPluginOptions = {
    connectionString: settings.appInsights.connectionString,
    router: router,
    trackAppErrors: true,
};

export { appInsightsOptions, AppInsightsPlugin };
