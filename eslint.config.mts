import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: globals.node
        }
    },

    // TypeScript recommended rules
    tseslint.configs.recommended,

    // Custom overrides
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    // "args": "all",
                    "argsIgnorePattern": "^_",
                    // "caughtErrors": "all",
                    // "caughtErrorsIgnorePattern": "^_",
                    // "destructuredArrayIgnorePattern": "^_",
                    // "varsIgnorePattern": "^_",
                    // "ignoreRestSiblings": true
                }
            ]
        }
    }
]);
