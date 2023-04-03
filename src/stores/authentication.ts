import { computed, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { AccountInfo } from "@azure/msal-common";
import { msalInstance } from "@/services";

export const useAuthenticationStore = defineStore("authentication", () => {
    const msalAccount: Ref<AccountInfo | null> = ref(null);

    const isAuthenticated = computed(() => msalAccount.value !== null);

    function loadAccount(): void {
        const account = msalInstance.getActiveAccount();
        msalAccount.value = account;
    }

    return { msalAccount, isAuthenticated, loadAccount };
});
