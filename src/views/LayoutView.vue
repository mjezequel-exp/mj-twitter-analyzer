<script lang="ts" setup>
import { useAuthenticationStore } from "@/stores";

const authenticationStore = useAuthenticationStore();
</script>
<template>
    <div>
        <div v-if="!authenticationStore.isAuthenticated">Loading ...</div>
        <div v-else>
            <RouterView />
        </div>
    </div>
</template>
