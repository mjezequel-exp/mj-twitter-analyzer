import { type RouteLocationNormalized, type Router } from "vue-router";
import { msalInstance, scopes } from "../authConfig";
import { InteractionType, type PopupRequest, PublicClientApplication, type RedirectRequest } from "@azure/msal-browser";

export function registerAuthGuard(router: Router): void {
    router.beforeEach(async (to: RouteLocationNormalized) => {
        if (to.meta.requiresAuth) {
            const request = {
                scopes,
                redirectStartPage: to.fullPath,
            };

            const authenticated = await isAuthenticated(msalInstance, InteractionType.Redirect, request);
            if (!authenticated) {
                await msalInstance.initialize();
                await msalInstance.loginRedirect(request);
                return false;
            }
        }

        return true;
    });
}

export async function isAuthenticated(instance: PublicClientApplication, interactionType: InteractionType, loginRequest: PopupRequest | RedirectRequest): Promise<boolean> {
    // If your application uses redirects for interaction, handleRedirectPromise must be called and awaited on each page load before determining if a user is signed in or not
    console.log("Checking if user is signed in...");
    return instance
        .handleRedirectPromise()
        .then(() => {
            const accounts = instance.getAllAccounts();
            if (accounts.length > 0) {
                return true;
            }

            // User is not signed in and attempting to access protected route. Sign them in.
            if (interactionType === InteractionType.Popup) {
                return instance
                    .loginPopup(loginRequest)
                    .then(() => {
                        return true;
                    })
                    .catch(() => {
                        return false;
                    });
            } else if (interactionType === InteractionType.Redirect) {
                return instance
                    .loginRedirect(loginRequest)
                    .then(() => {
                        return true;
                    })
                    .catch(() => {
                        return false;
                    });
            }

            return false;
        })
        .catch(() => {
            return false;
        });
}
