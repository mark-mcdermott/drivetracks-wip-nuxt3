import tailwindcss from "@tailwindcss/vite";
import dotenv from 'dotenv'
dotenv.config()

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: process.env.API_BASE || 'https://app001-backend.fly.dev/api/v1' } },
  devServer: { port: 3001 },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },

  colorMode: {
    classSuffix: "",
  },

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
    ],
  },
});