import tailwindcss from "@tailwindcss/vite";
import dotenv from 'dotenv'
dotenv.config()

const development = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: process.env.API_BASE || 'https://app001-backend.fly.dev/api/v1' } },
  devServer: { port: 3001 },

  modules: [
    "@nuxt/test-utils/module",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@sidebase/nuxt-auth",
    "@vee-validate/nuxt",
    "@morev/vue-transitions/nuxt"
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ["~/assets/css/main.css"],

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },

  colorMode: { classSuffix: "" },

  imports: {
    imports: [{
      from: "tailwind-variants",
      name: "tv",
    }, {
      from: "tailwind-variants",
      name: "VariantProps",
      type: true,
    }, {
      from: "vue-sonner",
      name: "toast",
      as: "useSonner"
    }],
  },

  auth: {
    computed: { pathname: development ? 'http://localhost:3000/api/v1/auth/' : 'https://app001-backend.fly.dev/api/v1/auth/' },
    isEnabled: true,
    baseURL: development ? 'http://localhost:3000/api/v1/auth/' : 'https://app001-backend.fly.dev/api/v1/auth/',
    globalAppMiddleware: { isEnabled: true },
    provider: {
      type: 'local',
      pages: { login: '/' },
      token: { signInResponseTokenPointer: '/token' },
      endpoints: {
        signIn: { path: 'login', method: 'post' },
        signOut: { path: 'logout', method: 'delete' },
        signUp: { path: 'signup', method: 'post' },
        getSession: { path: 'current_user', method: 'get' },
      },
    },
  },

  build: {
    transpile: ["vue-sonner"]
  },

  compatibilityDate: '2025-03-15'
})