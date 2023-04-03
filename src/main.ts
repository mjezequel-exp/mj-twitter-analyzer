import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import { msalPlugin } from "./plugins/msalPlugin";
import { msalInstance } from "./services/MsalService";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(msalPlugin, msalInstance);

app.mount("#app");
