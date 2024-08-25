const development = process.env.NODE_ENV !== 'production'
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: "http://localhost:3000" } },
  devServer: { port: 3001 },

  modules: [
    "@nuxt/test-utils/module",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "nuxt-icon",
    "@sidebase/nuxt-auth",
    "@vee-validate/nuxt",
    "@morev/vue-transitions/nuxt"
  ],

  tailwindcss: { exposeConfig: true },
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
    computed: { pathname: development ? 'http://localhost:3000/api/auth/' : 'https://interview-app-backend.fly.dev/api/auth/' },
    isEnabled: true,
    globalAppMiddleware: { isEnabled: true },
    provider: {
      type: 'local',
      pages: { login: '/' },
      token: { signInResponseTokenPointer: '/token' },
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'delete' },
        signUp: { path: '/signup', method: 'post' },
        getSession: { path: '/session', method: 'get' },
      },
    },
  },

  build: {
    transpile: ["vue-sonner"]
  }
});