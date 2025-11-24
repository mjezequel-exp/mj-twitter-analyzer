import "./assets/main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import { Notify, Quasar } from "quasar";

// Import icon libraries
import "@quasar/extras/material-icons-outlined/material-icons-outlined.css";
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

import { msalInstance } from "./authConfig";
import { AppInsightsPlugin, appInsightsOptions } from "./plugins/appInsightsPlugin";
import { msalPlugin } from "./plugins/msalPlugin";
import { MsalNavigationClient } from "./router/MsalNavigationClient";
import { settings } from "./settings";

// Initialize the application asynchronously to ensure MSAL is ready
async function initializeApp() {
    try {
        // Initialize MSAL first
        console.log("🔐 Initializing MSAL...");
        await msalInstance.initialize();
        console.log("✅ MSAL initialized successfully");

        // Handle redirect promise
        try {
            const response = await msalInstance.handleRedirectPromise();
            if (response) {
                console.log("🔄 Redirect handled, setting active account");
                msalInstance.setActiveAccount(response.account);
            }
        } catch (redirectError) {
            console.warn("⚠️ Redirect handling failed:", redirectError);
        }

        // Provide a custom navigation client to MSAL to enable client-side routing
        const navigationClient = new MsalNavigationClient(router);
        msalInstance.setNavigationClient(navigationClient);

        // Set first MSAL account as active account if available
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
            console.log(`👤 Setting active account: ${accounts[0].username}`);
            msalInstance.setActiveAccount(accounts[0]);
        } else {
            console.log("📭 No accounts found");
        }

        // Create Vue app
        console.log("🚀 Creating Vue application...");
        const app = createApp(App);

        app.use(Quasar, {
            plugins: {
                Notify,
            }, // import Quasar plugins and add here
        });
        app.use(createPinia());
        app.use(router);
        app.use(msalPlugin, msalInstance);

        // Only load Application Insights if connection string is provided
        if (settings.appInsights.connectionString) {
            console.log("📊 Loading Application Insights with connection string");
            app.use(AppInsightsPlugin, appInsightsOptions);
        } else {
            console.log("📊 Application Insights not loaded - no connection string provided");
        }

        // Log errors to the console (otherwise they are swallowed by App Insights)
        app.config.errorHandler = (err, vm, info): void => {
            console.error("❌ Application error:", err, vm, info);
        };

        app.mount("#app");
        console.log("✅ Vue application mounted successfully");
    } catch (error) {
        console.error("💥 Failed to initialize application:", error);

        // Show a basic error message to the user
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
            ">
                <h1 style="color: #d32f2f; margin-bottom: 20px;">🚫 Erreur d'initialisation</h1>
                <p style="margin-bottom: 20px;">L'application n'a pas pu s'initialiser correctement.</p>
                <p style="color: #666; font-size: 14px;">Détails : ${error instanceof Error ? error.message : String(error)}</p>
                <button onclick="window.location.reload()" style="
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #1976d2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">Recharger la page</button>
            </div>
        `;
    }
}

// Start the initialization
initializeApp();
