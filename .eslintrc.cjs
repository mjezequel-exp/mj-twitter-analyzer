/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/eslint-config-typescript"],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        "max-len": ["error", { code: 200, tabWidth: 4 }],
        "linebreak-style": ["error", "windows"],
        quotes: ["error", "double"],
        indent: [
            "warn",
            4,
            {
                SwitchCase: 1,
                MemberExpression: "off",
            },
        ],
        "space-before-function-paren": [
            "warn",
            {
                anonymous: "always",
                asyncArrow: "always",
                named: "never",
            },
        ],
        semi: ["warn", "always"],
        "vue/no-v-for-template-key": "off",
        "vue/attributes-order": [
            "error",
            {
                order: [
                    "DEFINITION",
                    "CONDITIONALS",
                    "LIST_RENDERING",
                    "UNIQUE",
                    "RENDER_MODIFIERS",
                    "TWO_WAY_BINDING",
                    "SLOT",
                    "CONTENT",
                    "OTHER_DIRECTIVES",
                    "GLOBAL",
                    "ATTR_DYNAMIC",
                    "ATTR_STATIC",
                    "ATTR_SHORTHAND_BOOL",
                    "EVENTS",
                ],
                alphabetical: true,
            },
        ],
        "comma-dangle": ["warn", "always-multiline"],
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                singleline: {
                    delimiter: "semi",
                    requireLast: false,
                },
            },
        ],
    },
};
