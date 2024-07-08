export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  modules: ['@nuxt/icon', '@sidebase/nuxt-auth'],
  devServer: {
    port: 3001,
  },
  auth: {
    globalAppMiddleware: true,
    provider: {
      type: 'local',
      pages: {
        login: '/',
      },
    },
  },
})
