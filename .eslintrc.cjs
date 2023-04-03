/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-typescript/recommended", "@vue/eslint-config-prettier"],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        "max-len": ["error", { code: 200, tabWidth: 4 }],
        "linebreak-style": ["error", "windows"],
        "comma-dangle": [
            "error",
            {
                arrays: "always-multiline",
                objects: "always-multiline",
            },
        ],
    },
};
