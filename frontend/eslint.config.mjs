import js from "@eslint/js";
import nuxt from "eslint-plugin-nuxt";
import vitest from "eslint-plugin-vitest";

export default [
  js.configs.recommended,
  nuxt.configs.recommended,
  {
    files: ["**/*.{test,spec}.{js,ts}"], // Only apply Vitest rules to test files
    plugins: { vitest },
    rules: vitest.configs.recommended.rules,
  },
  {
    rules: {
      "vue/multi-word-component-names": "off", // Disable single-word component warning
      "no-console": "warn",
      "no-unused-vars": "warn",
    },
  },
];
