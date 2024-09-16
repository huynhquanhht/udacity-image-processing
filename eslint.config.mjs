import globals from "globals";

export default [
    {
        files: ["**/*.js", "**/*.mjs"],
        ignores: ["**/*.test.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        files: ["**/*.cjs"],
        languageOptions: {
            sourceType: "commonjs",
            globals: {
                ...globals.node,
                ...globals.amd,
            },
        },
    }
];