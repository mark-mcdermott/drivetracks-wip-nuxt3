import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => ['Icon','NuxtLink'].includes(tag) }}})],
  test: { environment: 'happy-dom', setupFiles: ["./specs/mocks/mocks.js"] },
})
