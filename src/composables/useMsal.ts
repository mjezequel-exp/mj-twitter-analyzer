import { msalInstance, scopes } from "@/authConfig";
import { type AccountInfo, InteractionStatus, PublicClientApplication } from "@azure/msal-browser";
import { getCurrentInstance, ref, type Ref, toRefs, watch } from "vue";

export type MsalContext = {
    instance: PublicClientApplication;
    account: Ref<AccountInfo | null>;
    accounts: Ref<AccountInfo[]>;
    inProgress: Ref<InteractionStatus>;
    isAuthenticated: Ref<boolean>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    getAccessToken: () => Promise<string>;
};

export function useMsal(): MsalContext {
    const internalInstance = getCurrentInstance();
    if (!internalInstance) {
        throw "useMsal() cannot be called outside the setup() function of a component";
    }
    const { instance, accounts, inProgress } = toRefs<{ instance: PublicClientApplication; accounts: AccountInfo[]; inProgress: InteractionStatus }>(
        internalInstance.appContext.config.globalProperties.$msal,
    );

    if (!instance.value || !accounts.value || !inProgress.value) {
        throw "Please install the msalPlugin";
    }

    const account = ref<AccountInfo | null>(null);

    if (inProgress.value === InteractionStatus.Startup) {
        instance.value.initialize().then(() => {
            instance.value
                .handleRedirectPromise()
                .then((response) => {
                    if (response) {
                        // Set the active account
                        msalInstance.setActiveAccount(response.account);
                        account.value = response.account;
                    }
                })
                .catch(() => {
                    // TODO: Errors should be handled by listening to the LOGIN_FAILURE event
                    return;
                });
        });
    }

    const isAuthenticated = ref(accounts.value.length > 0);

    watch(accounts, () => {
        isAuthenticated.value = accounts.value.length > 0;
    });

    const login = async (): Promise<void> => {
        try {
            await instance.value.loginRedirect({ scopes });
        } catch (error) {
            console.error(error);
            isAuthenticated.value = false;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await instance.value.logoutRedirect();
        } catch (error) {
            console.error(error);
        }
    };

    const getAccessToken = async (): Promise<string> => {
        try {
            await instance.value.initialize();
            const response = await instance.value.acquireTokenSilent({ scopes });
            return response.accessToken;
        } catch (error) {
            console.error(error);
            return "";
        }
    };

    return {
        instance: instance.value,
        account,
        accounts,
        inProgress,
        isAuthenticated,
        login,
        logout,
        getAccessToken,
    };
}
