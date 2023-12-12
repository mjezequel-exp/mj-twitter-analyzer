import type { NavigationGuard } from "vue-router";
import { msalInstance } from "@/services";
import { useAuthenticationStore } from "@/stores";
import { RouteNames } from "./RouteNames";

export const authGuard: NavigationGuard = async (to, from, next) => {
    const authenticationStore = useAuthenticationStore();

    await msalInstance.initialize();

    // Login with Azure AD
    const loggedIn = await msalInstance.login();
    if (!loggedIn) {
        return next({ name: RouteNames.unauthorized });
    }

    // Load user account
    authenticationStore.loadAccount();
    if (!authenticationStore.isAuthenticated) {
        return next({ name: RouteNames.unauthorized });
    }

    return next();
};
