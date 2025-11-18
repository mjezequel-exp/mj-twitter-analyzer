<script lang="ts" setup>
import HelloWorld from "@/components/HelloWorld.vue";
import { useMsal } from "@/composables/useMsal";
import { RouteNames } from "@/router/RouteNames";
import { computed } from "vue";

const { accounts } = useMsal();

const message = computed(() => `Well done ${accounts.value[0]?.name}! You've successfully configured authentication in your app.`);
</script>

<template>
    <header>
        <IconVue />

        <div class="wrapper">
            <HelloWorld :text="message" msg="You did it!" />
        </div>

        <h3>You can go back to the <RouterLink :to="{ name: RouteNames.home }">home page</RouterLink>.</h3>
    </header>
</template>
