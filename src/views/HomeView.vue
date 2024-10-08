<script setup lang="ts">
import TheWelcome from "@/components/welcome/TheWelcome.vue";
import HelloWorld from "@/components/welcome/HelloWorld.vue";
import { useAuthenticationStore } from "@/stores";
import IconVue from "@/components/welcome/icons/IconVue.vue";

const authStore = useAuthenticationStore();
const msg = `You did it ${authStore.msalAccount?.name}!`;
</script>

<template>
    <header>
        <IconVue />
        <div class="wrapper">
            <HelloWorld :msg="msg" text="You've successfully created a project with our template. What's next?" />
            <p>You can remove the <code>src/components/welcome</code> folder and all code from this view to start fresh!</p>
        </div>
    </header>

    <main>
        <TheWelcome />
    </main>
</template>

<style lang="scss">
/* color palette from <https://github.com/vuejs/theme> */
:root {
    --vt-c-white: #fff;
    --vt-c-white-soft: #f8f8f8;
    --vt-c-white-mute: #f2f2f2;
    --vt-c-black: #181818;
    --vt-c-black-soft: #222;
    --vt-c-black-mute: #282828;
    --vt-c-indigo: #2c3e50;
    --vt-c-divider-light-1: rgb(60 60 60 / 29%);
    --vt-c-divider-light-2: rgb(60 60 60 / 12%);
    --vt-c-divider-dark-1: rgb(84 84 84 / 65%);
    --vt-c-divider-dark-2: rgb(84 84 84 / 48%);
    --vt-c-text-light-1: var(--vt-c-indigo);
    --vt-c-text-light-2: rgb(60 60 60 / 66%);
    --vt-c-text-dark-1: var(--vt-c-white);
    --vt-c-text-dark-2: rgb(235 235 235 / 64%);

    /* semantic color variables for this project */
    --color-background: var(--vt-c-white);
    --color-background-soft: var(--vt-c-white-soft);
    --color-background-mute: var(--vt-c-white-mute);
    --color-border: var(--vt-c-divider-light-2);
    --color-border-hover: var(--vt-c-divider-light-1);
    --color-heading: var(--vt-c-text-light-1);
    --color-text: var(--vt-c-text-light-1);
    --section-gap: 160px;
}

@media (prefers-color-scheme: dark) {
    :root {
        --color-background: var(--vt-c-black);
        --color-background-soft: var(--vt-c-black-soft);
        --color-background-mute: var(--vt-c-black-mute);
        --color-border: var(--vt-c-divider-dark-2);
        --color-border-hover: var(--vt-c-divider-dark-1);
        --color-heading: var(--vt-c-text-dark-1);
        --color-text: var(--vt-c-text-dark-2);
    }
}

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    font-weight: normal;
}

body {
    min-height: 100vh;
    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Oxygen,
        Ubuntu,
        Cantarell,
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        sans-serif;
    font-size: 15px;
    line-height: 1.6;
    color: var(--color-text);
    background: var(--color-background);
    transition:
        color 0.5s,
        background-color 0.5s;
    text-rendering: optimizelegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

#app {
    max-width: 1280px;
    padding: 2em;
    margin: 0 auto;
    font-weight: normal;
}

.wrapper {
    text-align: center;
}

a,
.green {
    padding: 3px;
    color: hsl(160deg 100% 37% / 100%);
    text-decoration: none;
    transition: 0.4s;
}

@media (hover: hover) {
    a:hover {
        background-color: hsl(160deg 100% 37% / 20%);
    }
}

@media (width >= 1024px) {
    body {
        display: flex;
        place-items: center;
    }

    #app {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 5em;
        padding: 0 2em;
    }

    .wrapper {
        text-align: left;
    }
}
</style>
