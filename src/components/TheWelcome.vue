<script setup lang="ts">
import WelcomeItem from "./WelcomeItem.vue";
import { IconAzure, IconDocumentation, IconEcosystem, IconSupport, IconTooling, IconWeb } from "@/components/icons";
</script>

<template>
    <WelcomeItem>
        <template #icon>
            <IconDocumentation />
        </template>
        <template #heading>Documentation</template>
        Vue's
        <a href="https://vuejs.org/" rel="noopener" target="_blank">official documentation</a>
        provides you with all information you need to get started.
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <IconTooling />
        </template>
        <template #heading>Tooling</template>
        This project is served and bundled with
        <a href="https://vitejs.dev/guide/features.html" rel="noopener" target="_blank">Vite</a>. The recommended IDE setup is
        <a href="https://code.visualstudio.com/" rel="noopener" target="_blank">VSCode</a> + <a href="https://github.com/johnsoncodehk/volar" rel="noopener" target="_blank">Volar</a>.
        <a href="https://eslint.org/docs/latest/" rel="noopener" target="_blank">ESLint</a> and <a href="https://prettier.io/docs/en/" rel="noopener" target="_blank">Prettier</a> are also included to
        ensure code consistency.
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <IconEcosystem />
        </template>
        <template #heading>Ecosystem</template>
        This project comes with some preconfigured packages such as: <a href="https://pinia.vuejs.org/" rel="noopener" target="_blank">Pinia</a> for state management and
        <a href="https://router.vuejs.org/" rel="noopener" target="_blank">Vue Router</a> for routing. If you need more libraries or resources, you can pay
        <a href="https://github.com/vuejs/awesome-vue" rel="noopener" target="_blank">Awesome Vue</a> a visit.
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <IconAzure />
        </template>
        <template #heading>Azure-ready</template>
        <p>The project is also ready to deploy to Azure Static Web Apps, it comes with a preconfigured <code>staticwebapp.config.json</code> file.</p>
        <p>It also uses Entra ID authentication, you can configure it with the <code>VITE_APP_AZURE_AD_*</code> variables.</p>
        <p>Monitoring is included with Azure Application Insights, you can configure the <code>VITE_APP_INSIGHTS_INSTRUMENTATIONKEY</code> variable.</p>
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <IconWeb />
        </template>
        <template #heading>Easy HTTP requests</template>
        The project contains a <code>BaseClient</code> class you can extend to easily send requests to your API. It uses
        <a href="https://axios-http.com/docs/intro" rel="noopener" target="_blank">Axios</a> under the hood.
    </WelcomeItem>

    <WelcomeItem>
        <template #icon>
            <IconSupport />
        </template>
        <template #heading>Maintain the template</template>
        This template needs to be maintained to keep up with the latest changes in the Vue ecosystem. You can help by submitting a pull request in the
        <a href="https://dev.azure.com/expertime/Expertime%20-%20Apps%20-%20Templates/_git/template-vue3" rel="noopener" target="_blank">repository</a>.
    </WelcomeItem>
</template>
