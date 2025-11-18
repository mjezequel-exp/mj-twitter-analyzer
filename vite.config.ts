import child_process from "node:child_process";
import fs from "node:fs";
import { fileURLToPath, URL } from "node:url";

import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import basicSsl from "@vitejs/plugin-basic-ssl";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    if (command === "serve") {
        // Create a self-signed certificate if it does not exist when running the dev server
        const certFilePath = "./localhost.pfx";
        if (!fs.existsSync(certFilePath)) {
            if (0 !== child_process.spawnSync("dotnet", ["dev-certs", "https", "--export-path", certFilePath, "--password", "localhost"], { stdio: "inherit" }).status) {
                throw new Error("Could not create certificate.");
            }
        }
    }

    return {
        plugins: [
            vue({
                template: { transformAssetUrls },
            }),
            quasar({
                sassVariables: "@/quasar-variables.sass",
            }),
            basicSsl(),
        ],
        resolve: {
            alias: {
                "@": fileURLToPath(new URL("./src", import.meta.url)),
            },
        },
        server: {
            host: "localhost",
            https: {
                pfx: "./localhost.pfx",
                passphrase: "localhost",
            },
            port: 44340,
        },
    };
});
