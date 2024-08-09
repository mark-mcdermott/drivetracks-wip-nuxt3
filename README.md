# Rails API & Nuxt 3 App
- Rails 7 postgres backend, Nuxt 3 frontend using tailwindcss
- Hosted on fly.io

# To Run Locally
- clone this repo (`git clone <reponame>`)
- `cd` into repo
- `cd frontend`
- `npm install`
- `npm run dev`
- split your terminal and in the new terminal pane do:
  - `cd ../backend`
  - `bundle install`
  - `rails server`
- in a browser, go to `http://localhost:3001`
- `^ + c` (to kill server)

# To Create This Project From Scratch

## Init App
- `cd ~`
- `mkdir app`
- `cd app`
- `wget https://raw.githubusercontent.com/mark-mcdermott/drivetracks-wip-nuxt3/main/README.md`
- `npx nuxi@latest init frontend`
  - package manager: `npm`
  - init git repo: `no`
- `rails new backend --api --database=postgresql --skip-git`

## Frontend 

### ESLint AutoSave
- install VSCode extension `ESLint`
- `cd ~/app`
- `npm init` (hit enter for all prompts)
- `pnpm dlx @antfu/eslint-config@latest`
  - uncommitted changes, continue? `yes`
  - framework: `Vue`
  - extra utils: `none`
  - update `.vscode/settings.json`: `yes`
- `npm install`
- in `~/app/.vscode/settings.json`, change the `codeActionsOnSave` section (lines 7-10) to:
```
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    "source.organizeImports": "always"
  },
```
- `touch .gitignore`
- make `~/app/.gitignore` look like this:
```
.DS_Store
node_modules
```
- open `package.json`
  - you should see some red underlines for ESLint violations
  - hit `command + s` to save and you should see ESLint automatically fix the issues

### ESLint Commands
- `cd ~/app/frontend`
- `pnpm dlx @antfu/eslint-config@latest`
  - uncommitted changes, continue? `yes`
  - framework: `Vue`
  - extra utils: `none`
  - update `.vscode/settings.json`: `no`
- `npm install`
- in `~/app/frontend/package.json` in the `scripts` section add:
```
"lint": "npx eslint .",
"lint:fix": "npx eslint . --fix"
```
- `npm run lint` -> it will flag a trailing comma issue on `nuxt.config.ts`
- open `~/app/frontend/nuxt.config.ts`
- `npm run lint:fix` -> you will see it add a trailing comma to fix the ESLint violation

### Vitest
- install VSCode `Vitest` extension
- `cd ~/app/frontend`
- `npm install --save-dev @nuxt/test-utils vitest @vue/test-utils happy-dom eslint-plugin-vitest`
- `touch vitest.config.ts`
- make `~/app/frontend/vitest.config.ts` look like this:
```
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => ['Icon','NuxtLink'].includes(tag) }}})],
  test: { environment: 'happy-dom', setupFiles: ["./spec/mocks/mocks.js"] },
})
```
- add `plugins: ['vitest'],` to `~/app/frontend/eslint.config.js` so it looks like this:
```
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  plugins: ['vitest'],
})
```
- to `~/app/frontend/package.json` in the `scripts` section add:
```
"test": "npx vitest"
```
- `npm run test` -> vitest should run (it will try to run, but there are no tests yet)

### Stub Specs
- `cd ~/app/frontend`
- `mkdir spec`
- `cd spec`
- `mkdir components layouts pages`
- `cd components`
- `touch Header.spec.js`
- `cd ../pages`
- `touch home.spec.js public.spec.js private.spec.js`

### Mocks
- `cd ~/app/frontend`
- `mkdir spec/mocks`
- `touch spec/mocks/mocks.js`
- make `~/app/frontend/spec/mocks/mocks.js` look like this:
```
import { vi } from 'vitest';

// mocks 
global.definePageMeta = vi.fn(() => { });
global.ref = vi.fn((initialValue) => { return { value: initialValue } })
global.useAuth = vi.fn(() => { return { status: 'unauthenticated' } })
```

### Components Specs
- make `~/app/frontend/specs/components/Header.spec.js` look like this:
```
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Header from './../../components/Header.vue'

describe('Header', () => {
  const wrapper = mount(Header)
  const h1 = wrapper.find("h1")

  it('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  it('has correct title text', () => {
    const title = wrapper.find(".nav-header")
    expect(title.text()).toBe('Test App');
  })

})
```

### Page Specs
- make `~/app/frontend/specs/pages/home.spec.js` look like this:
```
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import homePage from './../../pages/index.vue'

describe('Home page', () => {
  it('is a Vue instance', () => {
    expect(mount(homePage).vm).toBeTruthy()
  })
})

describe('Home page has correct copy', () => {
  it('has correct h4 text', () => {
    expect(mount(homePage).find("h4").text()).toBe('Test App');
  })
  it('has correct p text', () => {
    expect(mount(homePage).find("p").text()).toContain('Here you can read do anything your little heart desires.');
  })
})
```
- make `~/app/frontend/specs/pages/public.spec.js` look like this:
```
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import publicPage from './../../pages/public.vue'

describe('Public page has correct copy', () => {
  it('has correct h4 text', () => {
    expect(mount(publicPage).find("h4").text()).toBe('Public');
  })
  it('has correct p text', () => {
    expect(mount(publicPage).find("p").text()).toContain("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a aliquet metus, non lacinia ligula. Vestibulum convallis massa vitae arcu fringilla rhoncus. In ut ligula posuere, fringilla leo sit amet, fringilla nisl. Nam orci odio, finibus a hendrerit sit amet, dapibus in risus. Phasellus maximus mattis turpis vitae gravida. Donec nec tellus elit. Mauris luctus mi ut est porta, sit amet lobortis felis imperdiet. Quisque ut eros pellentesque, vestibulum eros vel, cursus ligula. Nulla tortor purus, sollicitudin id gravida eu, efficitur eu elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dictum congue nibh vel egestas. Nulla vel lacinia sem.");
  })
})
```
- make `~/app/frontend/specs/pages/private.spec.js` look like this:
```
import { expect, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import privatePage from './../../pages/private.vue'

vi.stubGlobal("definePageMeta", () => {})
vi.stubGlobal("ref", (initialValue) => { return { value: initialValue } })

describe('Private page has correct copy', () => {
  it('has correct h2 text', () => {
    expect(mount(privatePage).find("h2").text()).toBe('Private');
  })
  it('has correct p text', () => {
    expect(mount(privatePage).find("p").text()).toContain("We know that you, as a bee, have worked your whole life to get to the point where you can work for your whole life. Honey begins when our valiant Pollen Jocks bring the nectar to the hive. Our top-secret formula is automatically color-corrected, scent-adjusted and bubble-contoured into this soothing sweet syrup with its distinctive golden glow you know as Honey!");
  })
})
```

### Barebones Hello World
- `cd ~/app/frontend`
- make `~/app/frontend/nuxt.config.ts` look like this:
```
export default defineNuxtConfig({
  runtimeConfig: { public: { apiBase: 'http://localhost:3000' }},
  devServer: { port: 3001 },
  devtools: { enabled: true },
})
```
- `npm run dev` -> should see Nuxt starter app at http://localhost:3001
- `^ + c` -> to kill the server
- change `~/app/frontend/app.vue` to:
```
<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>
```
- `npm run dev` -> "Hello World" in Times New Roman
- `^ + c`

### Tailwind
- install the VSCode extension `vscode-tailwind-magic`
- `cd ~/app/frontend`
- `npx nuxi@latest module add tailwindcss`
- add these to your `~/app/.vscode/settings.json`:
```
"files.associations": {
    "*.css": "tailwindcss"
},
"editor.quickSuggestions": {
    "strings": true
}
```

### UI Thing
- `cd ~/app/frontend`
- `npx ui-thing@latest init`
  - hit `y` to proceed
  - pick a theme color when prompted
  - you can hit enter for all the other questions
- `npm i -D @iconify-json/lucide`

### Home Page
- `cd ~/app/frontend`
- `npx ui-thing@latest add container badge button gradient-divider`
- `touch components/Home.vue`
- make `~/app/frontend/components/Home.vue` look like this:
```
<template>
  <UiContainer class="relative flex flex-col items-center py-10 text-center lg:py-20">
    <h1 class="mb-4 mt-7 text-4xl font-bold lg:mb-6 lg:mt-5 lg:text-center lg:text-5xl xl:text-6xl">
      There was a wall.<br>It did not look important.
    </h1>
    <p class="mx-auto max-w-[768px] tracking-tight text-lg text-muted-foreground lg:text-center lg:text-xl">
      It was built of uncut rocks roughly mortared. An adult could look right over it, and even a child could climb it. Where it crossed the roadway, instead of having a gate it degenerated into mere geometry, a line, an idea of boundary. But the idea was real.
    </p>
    <div class="mt-8 grid w-full grid-cols-1 items-center gap-3 sm:flex sm:justify-center lg:mt-10">
      <UiButton to="/login" size="lg" variant="outline">
        Login
      </UiButton>
      <UiButton to="/signup" size="lg">
        Sign up
      </UiButton>
    </div>
  </UiContainer>
</template>
```
- make `~/app/frontend/app.vue` look like this: 
```
<template>
  <Home />
</template>
```
- `npm run dev` -> Should be a decent looking homepage now
- `^ + c`

### Layout
- `cd ~/app/frontend`
- `mkdir layouts`
- `touch layouts/default.vue`
- add this to `~/app/frontend/layouts/default.vue`:
```
<template>
  <NuxtPage />
</template>
```
- `mkdir pages`
- `touch pages/index.vue`
- add this to `~/app/frontend/pages/index.vue`:
```
<template>
  <Home />
</template>
```
- `rm app.vue`
- `npm run dev` -> Homepage should look same as above
- `^ + c`

### Header & Footer
- `cd ~/app/frontend`
- `npx ui-thing@latest add container navigation-menu sheet scroll-area collapsible`
- `cd components`
- `touch Logo.vue Header.vue Footer.vue`
- make `~/app/frontend/components/Logo.vue` look like this:
```
<template>
  <NuxtLink to="/" class="flex items-center gap-3">
    <!-- from https://www.untitledui.com/logos -->
    <svg fill="none" height="48" viewBox="0 0 168 48" width="168" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><clipPath id="a"><path d="m0 0h40v48h-40z" /></clipPath><g clip-path="url(#a)" fill="#ff4405"><path d="m25.0887 5.05386-3.933-1.05386-3.3145 12.3696-2.9923-11.16736-3.9331 1.05386 3.233 12.0655-8.05262-8.0526-2.87919 2.8792 8.83271 8.8328-10.99975-2.9474-1.05385625 3.933 12.01860625 3.2204c-.1376-.5935-.2104-1.2119-.2104-1.8473 0-4.4976 3.646-8.1436 8.1437-8.1436 4.4976 0 8.1436 3.646 8.1436 8.1436 0 .6313-.0719 1.2459-.2078 1.8359l10.9227 2.9267 1.0538-3.933-12.0664-3.2332 11.0005-2.9476-1.0539-3.933-12.0659 3.233 8.0526-8.0526-2.8792-2.87916-8.7102 8.71026z" /><path d="m27.8723 26.2214c-.3372 1.4256-1.0491 2.7063-2.0259 3.7324l7.913 7.9131 2.8792-2.8792z" /><path d="m25.7665 30.0366c-.9886 1.0097-2.2379 1.7632-3.6389 2.1515l2.8794 10.746 3.933-1.0539z" /><path d="m21.9807 32.2274c-.65.1671-1.3313.2559-2.0334.2559-.7522 0-1.4806-.102-2.1721-.2929l-2.882 10.7558 3.933 1.0538z" /><path d="m17.6361 32.1507c-1.3796-.4076-2.6067-1.1707-3.5751-2.1833l-7.9325 7.9325 2.87919 2.8792z" /><path d="m13.9956 29.8973c-.9518-1.019-1.6451-2.2826-1.9751-3.6862l-10.95836 2.9363 1.05385 3.933z" /></g><g fill="#0c111d"><path d="m50 33v-18.522h3.699l7.452 9.99c.108.126.243.306.405.54.162.216.315.432.459.648s.243.387.297.513h.135c0-.306 0-.603 0-.891 0-.306 0-.576 0-.81v-9.99h3.807v18.522h-3.699l-7.614-10.233c-.18-.252-.369-.531-.567-.837s-.342-.54-.432-.702h-.135v.81.729 10.233z" /><path d="m68.9515 16.719v-3.24h3.753v3.24zm0 16.281v-14.202h3.753v14.202z" /><path d="m81.5227 33.324c-1.566 0-2.88-.261-3.942-.783-1.062-.54-1.863-1.359-2.403-2.457s-.81-2.493-.81-4.185c0-1.71.27-3.105.81-4.185.54-1.098 1.332-1.908 2.376-2.43 1.062-.54 2.358-.81 3.888-.81 1.44 0 2.655.261 3.645.783.99.504 1.737 1.296 2.241 2.376.504 1.062.756 2.439.756 4.131v.972h-9.909c.036.828.162 1.53.378 2.106.234.576.585 1.008 1.053 1.296.486.27 1.125.405 1.917.405.432 0 .819-.054 1.161-.162.36-.108.666-.27.918-.486s.45-.486.594-.81.216-.693.216-1.107h3.672c0 .9-.162 1.683-.486 2.349s-.774 1.224-1.35 1.674c-.576.432-1.269.765-2.079.999-.792.216-1.674.324-2.646.324zm-3.294-8.964h5.994c0-.54-.072-1.008-.216-1.404-.126-.396-.306-.72-.54-.972s-.522-.432-.864-.54c-.324-.126-.693-.189-1.107-.189-.684 0-1.26.117-1.728.351-.45.216-.801.558-1.053 1.026-.234.45-.396 1.026-.486 1.728z" /><path d="m93.9963 33.324c-.9 0-1.629-.162-2.187-.486s-.963-.756-1.215-1.296c-.252-.558-.378-1.17-.378-1.836v-8.019h-1.755v-2.889h1.89l.702-4.05h2.916v4.05h2.592v2.889h-2.592v7.398c0 .432.099.765.297.999.198.216.522.324.972.324h1.323v2.484c-.216.072-.468.135-.756.189-.288.072-.594.126-.918.162-.324.054-.621.081-.891.081z" /><path d="m96.7988 33v-1.593l6.9392-9.72h-6.5072v-2.889h11.9342v1.539l-6.966 9.747h7.236v2.916z" /><path d="m116.578 33.324c-.99 0-1.881-.108-2.673-.324s-1.467-.513-2.025-.891c-.558-.396-.99-.864-1.296-1.404-.288-.54-.432-1.152-.432-1.836 0-.072 0-.144 0-.216s.009-.126.027-.162h3.618v.108.108c.018.45.162.819.432 1.107.27.27.621.468 1.053.594.45.126.918.189 1.404.189.432 0 .846-.036 1.242-.108.414-.09.756-.243 1.026-.459.288-.216.432-.495.432-.837 0-.432-.18-.765-.54-.999-.342-.234-.801-.423-1.377-.567-.558-.144-1.17-.306-1.836-.486-.612-.144-1.224-.306-1.836-.486-.612-.198-1.17-.45-1.674-.756-.486-.306-.882-.702-1.188-1.188-.306-.504-.459-1.134-.459-1.89 0-.738.162-1.377.486-1.917.324-.558.765-1.017 1.323-1.377.576-.36 1.242-.621 1.998-.783.774-.18 1.602-.27 2.484-.27.828 0 1.602.09 2.322.27.72.162 1.35.414 1.89.756.54.324.963.738 1.269 1.242.306.486.459 1.035.459 1.647v.351c0 .108-.009.18-.027.216h-3.591v-.216c0-.324-.099-.594-.297-.81-.198-.234-.486-.414-.864-.54-.36-.126-.801-.189-1.323-.189-.36 0-.693.027-.999.081-.288.054-.54.135-.756.243s-.387.243-.513.405c-.108.144-.162.324-.162.54 0 .306.126.558.378.756.27.18.621.333 1.053.459s.909.261 1.431.405c.648.18 1.323.36 2.025.54.72.162 1.386.387 1.998.675s1.107.702 1.485 1.242c.378.522.567 1.233.567 2.133 0 .864-.171 1.593-.513 2.187-.324.594-.783 1.071-1.377 1.431s-1.287.621-2.079.783-1.647.243-2.565.243z" /><path d="m130.987 33.324c-1.512 0-2.781-.261-3.807-.783-1.026-.54-1.809-1.359-2.349-2.457-.522-1.116-.783-2.511-.783-4.185 0-1.71.261-3.105.783-4.185.54-1.098 1.323-1.917 2.349-2.457 1.044-.54 2.313-.81 3.807-.81.972 0 1.845.117 2.619.351.792.234 1.476.594 2.052 1.08s1.008 1.089 1.296 1.809c.306.702.459 1.539.459 2.511h-3.753c0-.648-.099-1.179-.297-1.593s-.504-.729-.918-.945c-.396-.216-.9-.324-1.512-.324-.72 0-1.305.162-1.755.486s-.783.801-.999 1.431-.324 1.413-.324 2.349v.621c0 .918.108 1.692.324 2.322.234.63.585 1.107 1.053 1.431.468.306 1.08.459 1.836.459.612 0 1.116-.108 1.512-.324.414-.216.729-.54.945-.972s.324-.954.324-1.566h3.564c0 .918-.153 1.737-.459 2.457-.288.72-.72 1.323-1.296 1.809-.558.486-1.233.855-2.025 1.107s-1.674.378-2.646.378z" /><path d="m139.147 33v-19.521h3.753v6.885h.189c.306-.378.666-.702 1.08-.972.432-.288.909-.513 1.431-.675.54-.162 1.125-.243 1.755-.243.936 0 1.755.171 2.457.513s1.242.882 1.62 1.62c.396.738.594 1.701.594 2.889v9.504h-3.753v-8.91c0-.45-.054-.828-.162-1.134-.108-.324-.27-.585-.486-.783-.198-.216-.45-.369-.756-.459s-.648-.135-1.026-.135c-.558 0-1.062.135-1.512.405s-.801.639-1.053 1.107-.378 1.008-.378 1.62v8.289z" /><path d="m160.762 33.324c-1.566 0-2.88-.261-3.942-.783-1.062-.54-1.863-1.359-2.403-2.457s-.81-2.493-.81-4.185c0-1.71.27-3.105.81-4.185.54-1.098 1.332-1.908 2.376-2.43 1.062-.54 2.358-.81 3.888-.81 1.44 0 2.655.261 3.645.783.99.504 1.737 1.296 2.241 2.376.504 1.062.756 2.439.756 4.131v.972h-9.909c.036.828.162 1.53.378 2.106.234.576.585 1.008 1.053 1.296.486.27 1.125.405 1.917.405.432 0 .819-.054 1.161-.162.36-.108.666-.27.918-.486s.45-.486.594-.81.216-.693.216-1.107h3.672c0 .9-.162 1.683-.486 2.349s-.774 1.224-1.35 1.674c-.576.432-1.269.765-2.079.999-.792.216-1.674.324-2.646.324zm-3.294-8.964h5.994c0-.54-.072-1.008-.216-1.404-.126-.396-.306-.72-.54-.972s-.522-.432-.864-.54c-.324-.126-.693-.189-1.107-.189-.684 0-1.26.117-1.728.351-.45.216-.801.558-1.053 1.026-.234.45-.396 1.026-.486 1.728z" /></g>
    </svg>
  </NuxtLink>
</template>
```
- make `~/app/frontend/components/Header.vue` look like this:
```
<template>
  <header class="z-20 border-b bg-background/90 backdrop-blur">
    <UiContainer class="flex h-16 items-center justify-between md:h-20">
      <div class="flex items-center gap-10">
        <Logo />
        <UiNavigationMenu as="nav" class="hidden items-center justify-start gap-8 md:flex">
          <UiNavigationMenuList class="gap-2">
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton to="/" variant="ghost" size="sm">
                  Home
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton to="/public" variant="ghost" size="sm">
                  Public
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton to="/private" variant="ghost" size="sm">
                  Private
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
          </UiNavigationMenuList>
        </UiNavigationMenu>
      </div>
      <div class="md:hidden">
        <UiSheet>
          <UiSheetTrigger as-child>
            <UiButton variant="ghost" size="icon-sm">
              <Icon name="lucide:menu" class="h-5 w-5" />
            </UiButton>
            <UiSheetContent class="w-[90%] p-0">
              <template #content>
                <UiSheetTitle class="sr-only" title="Mobile menu" />
                <UiSheetDescription class="sr-only" description="Mobile menu" />
                <UiSheetX class="z-20" />

                <UiScrollArea class="h-full p-5">
                  <div class="flex flex-col gap-2">
                    <UiButton variant="ghost" class="justify-start text-base" to="/">
                      Home
                    </UiButton>
                    <UiButton variant="ghost" class="justify-start text-base" to="/public">
                      Public
                    </UiButton>
                    <UiButton variant="ghost" class="justify-start text-base" to="/private">
                      Private
                    </UiButton>
                    <UiGradientDivider class="my-5" />
                    <UiButton to="#">
                      Sign up
                    </UiButton>
                    <UiButton variant="outline" to="#">
                      Log in
                    </UiButton>
                  </div>
                </UiScrollArea>
              </template>
            </UiSheetContent>
          </UiSheetTrigger>
        </UiSheet>
      </div>
      <div class="hidden items-center gap-3 md:flex">
        <UiButton to="#" variant="ghost" size="sm">
          Log in
        </UiButton>
        <UiButton to="#" size="sm">
          Sign up
        </UiButton>
      </div>
    </UiContainer>
  </header>
</template>
```
- make `~/app/frontend/components/Footer.vue` look like this:
```
<template>
  <footer>
    <UiContainer as="footer" class="py-16 lg:py-24">
      <section class="flex flex-col justify-between gap-5 pt-8 lg:flex-row">
        <p class="text-muted-foreground">
          &copy; {{ new Date().getFullYear() }}. Made with
          <a class="hover:underline" href="https://nuxt.com">Nuxt</a>,
          <a class="hover:underline" href="https://tailwindcss.com/">Tailwind</a>,
          <a class="hover:underline" href="https://ui-thing.behonbaker.com">UI Thing</a>,
          <a class="hover:underline" href="https://rubyonrails.org/">Rails</a>,
          <a class="hover:underline" href="https://fly.io">Fly.io</a> and
          <a class="hover:underline" href="https://aws.amazon.com/s3/">S3</a>.
        </p>
      </section>
    </UiContainer>
  </footer>
</template>
```
- make `~/app/frontend/layouts/default.vue` look like this:
```
<template>
  <Header />
  <main>
    <NuxtPage />
  </main>
  <Footer />
</template>
```
- `npm run dev` -> Homepage should have header and footer
- `^ + c`

### Subpages
- `cd ~/app/frontend/pages`
- `touch public.vue private.vue`
- make `~/app/frontend/pages/public.vue` look like this:
```
<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          Public
        </h1>
        <p class="max-w-[768px] mb-8 text-lg text-muted-foreground lg:text-xl">
          Looked at from one side, the wall enclosed a barren sixty-acre field called the Port of Anarres. On the field there were a couple of large gantry cranes, a rocket pad, three warehouses, a truck garage, and a dormitory. The dormitory looked durable, grimy, and mournful; it had no gardens, no children; plainly nobody lived there or was even meant to stay there long. It was in fact a quarantine. The wall shut in not only the landing field but also the ships that came down out of space, and the men that came on the ships, and the worlds they came from, and the rest of the universe. It enclosed the universe, leaving Anarres outside, free.
        </p>
        <p class="max-w-[768px] mb-8 text-lg text-muted-foreground lg:text-xl">
          Looked at from the other side, the wall enclosed Anarres: the whole planet was inside it, a great prison camp, cut off from other worlds and other men, in quarantine.
        </p>
      </div>
    </div>
  </uicontainer>
</template>
```
- make `~/app/frontend/pages/private.vue` look like this:
```
<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          Private
        </h1>
        <p class="max-w-[768px] mb-8 text-lg text-muted-foreground lg:text-xl">
          A number of people were coming along the road towards the landing field, or standing around where the road cut through the wall. People often came out from the nearby city of Abbenay in hopes of seeing a spaceship, or simply to see the wall. After all, it was the only boundary wall on their world. Nowhere else could they see a sign that said No Trespassing. Adolescents, particularly, were drawn to it. They came up to the wall; they sat on it. There might be a gang to watch, offloading crates from track trucks at the warehouses. There might even be a freighter on the pad. Freighters came down only eight times a year, unannounced except to syndics actually working at the Port, so when the spectators were lucky enough to see one they were excited, at first. But there they sat, and there it sat, a squat black tower in a mess of movable cranes, away off across the field. And then a woman came over from one of the warehouse crews and said, “We’re shutting down for today, brothers.” She was wearing the Defense armband, a sight almost as rare as a spaceship. That was a bit of a thrill. But though her tone was mild, it was final. She was the foreman of this gang, and if provoked would be backed up by her syndics. And anyhow there wasn’t anything to see. The aliens, the offworlders, stayed hiding in their ship. No show.
        </p>
      </div>
    </div>
  </uicontainer>
</template>
```
- `cd ~/app/frontend`
- `npm run dev` -> home, public & private links work (private page is not yet locked)
- `^ + c`

### Auth
- `cd ~/app/frontend`
- `npx nuxi@latest module add @sidebase/nuxt-auth`
- `npm install`
- to the top of `~/app/frontend/pages/public.vue` add:
```
<script>
definePageMeta({ auth: false })
</script>
```
- make `~/app/frontend/nuxt.config.js` look like this:
```
const development = process.env.NODE_ENV !== 'production'
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: { public: { apiBase: 'http://localhost:3000' } },
  devServer: { port: 3001 },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@vueuse/nuxt', 'nuxt-icon', '@sidebase/nuxt-auth'],
  imports: {
    imports: [
      { from: 'tailwind-variants', name: 'tv' },
      { from: 'tailwind-variants', name: 'VariantProps', type: true },
    ],
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
})
```
- `npm run dev` -> private page redirects to homepage (login still goes to a 404)
- `^ + c`

### Header With Auth
- `cd ~/app/frontend`
- `npx ui-thing@latest add avatar dropdown-menu`
- make `~/app/frontend/components/Header.vue` look like this:
```
<script setup>
const { data, signOut, status } = useAuth()

const uuid = computed(() => {
  if (data && data.value) {
    return data.value.uuid
  }
  return ''
})

async function logout() {
  await signOut({ callbackUrl: '/' })
  useSonner('Logged out successfully!', { description: 'You have successfully logged out.' })
}
</script>

<template>
  <header class="z-20 border-b bg-background/90 backdrop-blur">
    <UiContainer class="flex h-16 items-center justify-between md:h-20">
      <div class="flex items-center gap-10">
        <Logo />
        <UiNavigationMenu as="nav" class="hidden items-center justify-start gap-8 md:flex">
          <UiNavigationMenuList class="gap-2">
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton to="/" variant="ghost" size="sm">
                  Home
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton v-if="status === 'authenticated'" to="/users" variant="ghost" size="sm">
                  Users
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem>
              <UiNavigationMenuLink as-child>
                <UiButton to="/public" variant="ghost" size="sm">
                  Public
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
            <UiNavigationMenuItem v-if="status === 'authenticated'">
              <UiNavigationMenuLink as-child>
                <UiButton to="/private" variant="ghost" size="sm">
                  Private
                </UiButton>
              </UiNavigationMenuLink>
            </UiNavigationMenuItem>
          </UiNavigationMenuList>
        </UiNavigationMenu>
      </div>
      <div class="md:hidden">
        <UiSheet>
          <UiSheetTrigger as-child>
            <UiButton variant="ghost" size="icon-sm">
              <Icon name="lucide:menu" class="h-5 w-5" />
            </UiButton>
            <UiSheetContent class="w-[90%] p-0">
              <template #content>
                <UiSheetTitle class="sr-only" title="Mobile menu" />
                <UiSheetDescription class="sr-only" description="Mobile menu" />
                <UiSheetX class="z-20" />

                <UiScrollArea class="h-full p-5">
                  <div class="flex flex-col gap-2">
                    <UiButton variant="ghost" class="justify-start text-base" to="/">
                      Home
                    </UiButton>
                    <UiButton v-if="status === 'authenticated'" variant="ghost" class="justify-start text-base" to="/users">
                      Users
                    </UiButton>
                    <UiButton variant="ghost" class="justify-start text-base" to="/public">
                      Public
                    </UiButton>
                    <UiButton v-if="status === 'authenticated'" variant="ghost" class="justify-start text-base" to="/private">
                      Private
                    </UiButton>
                    <UiGradientDivider class="my-5" />
                    <UiButton to="/signup">
                      Sign up
                    </UiButton>
                    <UiButton variant="outline" to="/login">
                      Log in
                    </UiButton>
                  </div>
                </UiScrollArea>
              </template>
            </UiSheetContent>
          </UiSheetTrigger>
        </UiSheet>
      </div>
      <div class="hidden items-center gap-3 md:flex">
        <UiButton v-if="status === 'unauthenticated'" to="/login" variant="ghost" size="sm">
          Log in
        </UiButton>
        <UiButton v-if="status === 'unauthenticated'" to="/signup" size="sm">
          Sign up
        </UiButton>

        <div v-if="status === 'authenticated'" class="flex items-center justify-center">
          <UiDropdownMenu>
            <UiDropdownMenuTrigger as-child>
              <UiButton id="dropdown-menu-trigger" class="focus:ring-0 focus:outline-none hover:bg-transparent" variant="ghost">
                <UiAvatar
                  src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
                  alt="Colm Tuite"
                  fallback="CT"
                  :delay-ms="600"
                />
              </UiButton>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent class="w-56">
              <NuxtLink :to="`/users/${uuid}`">
                <UiDropdownMenuItem title="Profile" icon="ph:user" />
              </NuxtLink>
              <UiDropdownMenuSeparator />
              <UiDropdownMenuItem title="Log out" icon="ph:user" @click.prevent="logout" />
            </UiDropdownMenuContent>
          </UiDropdownMenu>
        </div>

        <UiButton v-if="status === 'authenticated'" variant="ghost" size="sm" @click.prevent="logout">
          Log out
        </UiButton>
      </div>
    </UiContainer>
  </header>
</template>
```
- `cd ~/app/frontend`
- `npm run dev`
- `^ + c` -> Private link should now be hidden

### Login Form
- `cd ~/app/frontend`
- `npx ui-thing@latest add vee-input form vue-sonner` -> hit `y` when asked about installing dependencies
- `touch pages/login.vue`
- make `~/app/frontend/pages/login.vue` look like this:
```
<script setup>
const { signIn, status } = useAuth()
definePageMeta({ auth: false })
const email = ref('test@mail.com')
const password = ref('password')

async function login() {
  await signIn({ user: { email: email.value, password: password.value } }, { redirect: false })
  useSonner('Logged in successfully!', { description: 'You have successfully logged in.' })
  navigateTo('/')
}
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div class="flex h-screen items-center justify-center">
      <div class="w-full max-w-[350px] px-5">
        <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
          Log in
        </h1>
        <p class="mt-1 text-muted-foreground">
          Enter your email & password to log in.
        </p>

        <form class="mt-10">
          <fieldset class="grid gap-5">
            <div>
              <UiVeeInput v-model="email" label="Email" type="email" name="email" placeholder="test@mail.com" />
            </div>
            <div>
              <UiVeeInput v-model="password" label="Password" type="password" name="password" placeholder="password" />
            </div>
            <div>
              <UiButton class="w-full" type="submit" text="Log in" @click.prevent="login" />
            </div>
          </fieldset>
        </form>
        <p class="mt-4 text-sm text-muted-foreground">
          Don't have an account?
          <NuxtLink class="font-semibold text-primary underline-offset-2 hover:underline" to="/signup">
            Create account
          </NuxtLink>
        </p>
      </div>
    </div>
  </UiContainer>
</template>
```
- make `~/app/layouts/default.vue` look like this:
```
<template>
  <Header />
  <main>
    <NuxtPage />
    <UiVueSonner />
  </main>
  <Footer />
</template>
```

### Signup Form
- `cd ~/app/frontend`
- `touch pages/signup.vue`
- make `~/app/frontend/pages/signup.vue` look like this:
```
<script setup>
const { signUp } = useAuth()

definePageMeta({ auth: false })

const email = ref('')
const password = ref('')

async function register() {
  await signUp({ user: { email: email.value, password: password.value } }, { redirect: false })
  useSonner('Signed up successfully!', { description: 'You have successfully signed in.' })
  navigateTo('/')
}
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div class="flex h-screen items-center justify-center">
      <div class="w-full max-w-[350px] px-5">
        <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
          Sign up
        </h1>
        <p class="mt-1 text-muted-foreground">
          Enter your email & password to sign up.
        </p>

        <form class="mt-10">
          <fieldset class="grid gap-5">
            <div>
              <UiVeeInput v-model="email" label="Email" type="email" name="email" placeholder="test@mail.com" />
            </div>
            <div>
              <UiVeeInput v-model="password" label="Password" type="password" name="password" placeholder="password" />
            </div>
            <div>
              <UiButton class="w-full" type="submit" text="Sign up" @click.prevent="register" />
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </UiContainer>
</template>
```

### Nuxt User Views
- `cd ~/app/frontend`
- `npx ui-thing@latest add card table`
- `mkdir pages/users`
- `cd pages/users`
- `touch index.vue new.vue \[id\].vue`
- make `~/app/frontend/pages/users/index.vue` look like this:
```
<script setup lang="ts">
import { ref } from 'vue'

const config = useRuntimeConfig()
const { data: users, refresh } = await useAsyncData('users', () =>
  $fetch(`${config.public.apiBase}/users`))

const sortedUsers = computed(() => {
  if (users.value) {
    return [...users.value].sort((a, b) => a.id - b.id)
  }
  return []
})

async function navigateToUser(uuid) {
  navigateTo(`/users/${uuid}`)
}

async function deleteUser(uuid) {
  await fetch(`${config.public.apiBase}/users/${uuid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  refresh()
}
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          Users
        </h1>
        <div class="overflow-x-auto rounded-md border pb-4">
          <UiTable>
            <UiTableHeader>
              <UiTableRow>
                <UiTableHead class="w-[100px]">
                  id
                </UiTableHead>
                <UiTableHead>email</UiTableHead>
                <UiTableHead>uuid</UiTableHead>
                <UiTableHead class="w-[50px]" />
              </UiTableRow>
            </UiTableHeader>
            <UiTableBody class="last:border-b">
              <template v-for="user in sortedUsers" :key="user.id">
                <UiTableRow class="cursor-pointer hover:bg-gray-100">
                  <UiTableCell class="font-medium" @click="navigateToUser(user.uuid)">
                    {{ user.id }}
                  </UiTableCell>
                  <UiTableCell @click="navigateToUser(user.uuid)">
                    {{ user.email }}
                  </UiTableCell>
                  <UiTableCell @click="navigateToUser(user.uuid)">
                    {{ user.uuid }}
                  </UiTableCell>
                  <UiTableCell class="text-right">
                    <button @click.stop="deleteUser(user.uuid)">
                      <Icon name="lucide:trash" class="text-red-500 hover:text-red-700" />
                    </button>
                  </UiTableCell>
                </UiTableRow>
              </template>
            </UiTableBody>
          </UiTable>
        </div>
      </div>
    </div>
    <NuxtLink to="/users/new">
      <UiButton class="w-[100px]">
        New User
      </UiButton>
    </NuxtLink>
  </UiContainer>
</template>
```
- make `~/app/frontend/pages/users/[id].vue` look like this:
```
<script setup>
definePageMeta({ auth: false })

const route = useRoute()
const user = ref({})

async function fetchUser() {
  const { apiBase } = useRuntimeConfig().public
  const response = await fetch(`${apiBase}/users/${route.params.id}`)
  user.value = await response.json()
}

async function saveUserChanges(updatedUser) {
  const { apiBase } = useRuntimeConfig().public
  await fetch(`${apiBase}/users/${route.params.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email: updatedUser.email,
        uuid: updatedUser.uuid,
      },
    }),
  })
}

async function deleteUser() {
  const { apiBase } = useRuntimeConfig().public
  await fetch(`${apiBase}/users/${route.params.id}`, {
    method: 'DELETE',
  })
  navigateTo('/users')
}

onMounted(fetchUser)

// Watch for changes in the user object
watch(user, (newUser) => {
  if (newUser.id) { // Ensure user data is loaded before sending a request
    saveUserChanges(newUser)
  }
}, { deep: true })
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          User
        </h1>
        <div class="flex items-center justify-center">
          <form @submit.prevent>
            <UiCard class="w-[360px] max-w-sm" :title="user.email">
              <template #content>
                <UiCardContent>
                  <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="email">
                        Email
                      </UiLabel>
                      <UiInput id="email" v-model="user.email" required />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="uuid">
                        UUID
                      </UiLabel>
                      <p class="text-sm">
                        {{ user.uuid }}
                      </p>
                    </div>
                  </div>
                </UiCardContent>
              </template>
              <template #footer>
                <UiCardFooter class="flex justify-between">
                  <UiButton variant="destructive" @click.prevent="deleteUser">
                    <Icon name="lucide:trash" />
                    Delete User
                  </UiButton>
                </UiCardFooter>
              </template>
            </UiCard>
          </form>
        </div>
      </div>
    </div>
  </UiContainer>
</template>
```
- make `~/app/fronte nd/pages/users/new.vue` look like this:
```
<script setup>
const user = ref({
  email: '',
  password: '',
  password_confirmation: '',
})

async function createUser() {
  const { apiBase } = useRuntimeConfig().public
  const response = await fetch(`${apiBase}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email: user.value.email,
        password: user.value.password,
      },
    }),
  })

  if (response.ok) {
    const createdUser = await response.json()
    navigateTo(`/users/${createdUser.uuid}`)
  }
}
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          Create User
        </h1>
        <div class="flex items-center justify-center">
          <form @submit.prevent="createUser">
            <UiCard class="w-[360px] max-w-sm" :title="user.email">
              <template #content>
                <UiCardContent>
                  <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="email">
                        Email
                      </UiLabel>
                      <UiInput id="email" v-model="user.email" required />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="password">
                        Password
                      </UiLabel>
                      <UiInput id="password" v-model="user.password" type="password" required />
                    </div>
                  </div>
                </UiCardContent>
              </template>
              <template #footer>
                <UiCardFooter class="flex justify-between">
                  <UiButton type="submit">
                    Create User
                  </UiButton>
                </UiCardFooter>
              </template>
            </UiCard>
          </form>
        </div>
      </div>
    </div>
  </UiContainer>
</template>
```

### Nuxt File Upload Page (Delete This???)
- `cd ~/app/frontend`
- make `~/app/frontend/pages/upload.vue` look like this:
```
<template>
  <input type="file" @change="handleFileUpload" />
</template>

<script setup>
import { ref, defineEmits } from 'vue';

// Define the emitted events for this component
const emit = defineEmits(['fileSelected']);

// Reactive reference for the file
const file = ref(null);

// Handle the file upload
const handleFileUpload = (event) => {
  const target = event.target; // No TypeScript syntax here
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
    emit('fileSelected', file.value); // Emit the selected file to parent component
  }
};
</script>
```

## Backend

### Rails Starter API
- install VSCode extentions `Ruby LSP` and `Rubocop`
- `cd ~/app/backend`
- `bundle add rack-cors`
- `bundle install`
- check if there's a `~/app/backend/config/initializers/cors.rb` file and if not, run `touch config/initializers/cors.rb`
- make `~/app/backend/config/initializers/cors.rb` look like this (you will probably have to change the `https://app-frontend.fly.dev` line later):
```
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001', 'https://app-frontend.fly.dev'
    resource "*",
    headers: :any,
    expose: ['access-token', 'expiry', 'token-type', 'Authorization'],
    methods: [:get, :patch, :put, :delete, :post, :options, :show]
  end
end
```
- `rails db:create` (or `rails db:drop db:create` if you already have a database called `backend`)

### AWS S3 Setup
Now we'll create our AWS S3 account so we can store our user avatar images there as well as any other file uploads we'll need. There are a few parts here. We want to create a S3 bucket to store the files. But a S3 bucket needs a IAM user. Both the S3 bucket and the IAM user need permissions policies. There's a little bit of a chicken and egg issue here - when we create the user permissions policy, we need the S3 bucket name. But when we create the S3 bucket permissions, we need the IAM user name. So we'll create everything and use placeholder strings in some of the policies. Then when we're all done, we'll go through the policies and update all the placeholder strings to what they really need to be.

#### AWS General Setup
- login to AWS (https://aws.amazon.com)
  - If you don't have an AWS account, you'll need to sign up. It's been awhile since I did this part - I think you have to create a root user and add you credit card or something. Google it if you run into trouble with this part.
- at top right, select a region if currently says `global` (I use the `us-east-1` region). If all the region options are grayed out, ignore this for now.
- at top right click your name
  - next to Account ID, click the copy icon (two overlapping squares)
  - paste your Account ID in a new text file (It pastes without the dashes. Leave it that way - you need it without the dashes.)
  - save this in a file called `aws-details.txt` or something in a folder on your Desktop called `app-secrets` or something. You'll need it shortly. Whatever you do, never commit the `app-secrets` folder or the `aws-details.txt` file to your github repo. These will have to be kept locally on your computer, or better yet, saved to a password manager.

#### AWS User Policy
- in searchbar at top, enter `iam` and select IAM
- click `Policies` in the left sidebar under Access Managment
  - click `Create policy` towards the top right
  - click the `JSON` tab on Policy Editor
  - under Policy Editor select all with `command + a` and then hit `delete` to clear out everything there
  - enter this under Policy Editor (we'll update it shortly, once we have our user and bucket names):
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AllowGetObject",
			"Effect": "Allow",
			 "Action": [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
            ],
			"Resource": "arn:aws:s3:::bucketname"
		}
	]
}
```
  - click Next towards bottom right
  - for Policy Name, enter `app-s3-user-policy`
  - save your policy name in your `aws-details.txt` file
  - click Create Policy towards the bottom right

#### AWS User
- click `Users` under Access Management in the left sidebar
  - click `Create User` towards the top right
  - enter name, something like `app-s3-user` (add this to your `aws-details.txt` file on your desktop - you'll need it later)
  - click Next
  - under Permissions Options click `Attach policies directly`
  - in the search bar under Permissions Policies, enter `app-s3-user-policy` -> this should then show the policy we just created above (`app-s3-user-policy`) under Policy Name
  - under Policy Name, click the checkbox to the left of `app-s3-user-policy`
  - click Next
  - click Create User towards the bottom right
- under Users, click the name of the user we just created (`app-user`)
  - click Security Credentials tab
  - click `Create Access key` towards the top right
    - Use case: `Local code`
    - check `I understand the above recommendation`
    - Next
    - Description tag value: enter tag name, like `app-user-access-key`
    - click `Create access key` towards the bottom right
    - click `Download .csv file` towards the bottom
    - click Done
    - move the `AccessKeys.csv` file into the `app-secrets` folder you made above

#### AWS S3 Bucket
- in searchbar at top, enter `s3` and select S3
- Create Bucket
  - for Bucket Name, enter something like `app-s3-bucket-development` (below when you click Create Bucket, it may tell you this bucket already exists and you will have to make it more unique. Regardless, add this to your `aws-details.txt` file on your desktop - you'll need it later)
  - under Object Ownership, click ACLs Enabled
  - under Block Public Access settings
    - uncheck the first option, `Block All Public Access`
    - check the last two options, `Block public access to buckets and objects granted through new public bucket or access point policies` and `Block public and cross-account access to buckets and objects through any public bucket or access point policies`
  - check `I acknowledge that the current settings might result in this bucket and the objects within becoming public.`  
  - scroll to bottom and click Create Bucket (if nothing happens, scroll up and look for red error messages)
- under General Purpose Buckets, click the name of the bucket you just created -> then click the Permissions tab towards the top
  - in the Bucket Policy section, click Edit (to the right of "Bucket Policy")
  - copy/paste the boilerplate json bucket policy in the next line below this into the text editor area under Policy.
  - here is the boilerplate json bucket policy:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<aws acct id without dashes>:user/<iam username>"
            },
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::<bucket name>"
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<aws acct id without dashes>:user/<iam username>"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::<bucket name>/*"
        }
    ]
}
```
  - Update all the `<aws acct id without dashes>`, `<iam username>` and `<bucket name>` parts in the policy now in the text editor area under Policy with the account number, user name and bucket name you jotted down above in your `aws-details.txt` file on your Desktop.
  - click Save Changes towards the bottom right
  - in the Cross-Origin Resource Sharing (CORS) section, click `Edit` (to the right of "Cross-origin resource sharing (CORS)")
  - under Cross-origin Resource Sharing (CORS) add this:
```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [],
        "MaxAgeSeconds": 3000
    }
]
```
  - click Save Changes towards the bottom right
- now that we know our bucket name, let's update the our user policy with the bucket name
  - in the searchbar at the top of the page, type `iam` and select `IAM`
  - click `Policies` in the left sidebar under Access Management
  - in the searchbar under Policies, type `app-s3-user-policy` -> click `app-s3-user-policy` under Policy Name
  - click Edit towards the top right
  - in the Policy Editor text editor area, in the line `"Resource": "arn:aws:s3:::bucketname"` replace `bucketname` with your bucket name in your `aws-details.txt` file
  - click Next towards the bottom right
  - click Save Changes towards the bottom right
- see what region you're logged into
  - click the AWS logo in the top left
  - in the top right there will be a region dropdown - click it
  - look at the highlighted region in the dropdown and look for the region string to the right of it - something like `us-east-1`
  - write down the region in your `~/Desktop/app-secrets/aws-details.txt`
- we're now done with our S3 setup and our AWS dashboard, at least for now. So let's go back to our terminal where we're building out our rails backend

### Rubocop
- `cd ~/app/backend`
- `bundle add rubocop-rails`
- `bundle install`
- `touch .rubocop.yml`
- to `.rubocop.yml` add:
```
require: rubocop-rails
Style/Documentation:
  Enabled: false
```
- `rubocop -A`

### RSpec
- `bundle add rspec-rails --group "development, test"`
- `bundle install`
- `rails generate rspec:install`

### Database Cleaner
- `bundle add database_cleaner-active_record`
- `bundle install`
- make `~/app/backend/spec/rails_helper.rb` look like this:
```
require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
require 'database_cleaner/active_record'

begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  config.use_transactional_fixtures = false

  config.before(:suite) do
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end

  config.infer_spec_type_from_file_location!
  config.filter_rails_from_backtrace!
end
```

### Factory Bot
- `bundle add factory_bot_rails --group "development, test"`
- `bundle install`
- `mkdir spec/factories`
- we will wait to create the user factory until Devise creates it for us automatically when we use Devise to generate the user model
- in `~/app/backend/spec/rails_helper.rb`, in the line after `RSpec.configure do |config|` add a blank line and put this there: 
```
config.include FactoryBot::Syntax::Methods
```

### Auth Spec
- `cd ~/app/backend`
- `mkdir spec/requests`
- `touch spec/requests/auth_spec.rb`
- make `spec/requests/auth_spec.rb` look like this:
```
require "rails_helper"

RSpec.describe "Auth requests" do

  let(:user) { create(:user, email: "MyString", password: "MyString") }
  let(:valid_creds) {{ :email => user.email, :password => user.password }}
  let(:invalid_creds) {{ :email => user.email, :password => "wrong" }}
  let!(:token) { create(:token, user: user, token_str: Digest::MD5.hexdigest(SecureRandom.hex), active: true) }

  context "POST /api/auth/login with valid credentials" do
    it "responds with 200 status" do
      post "/api/auth/login", params: valid_creds
      expect(response.status).to eq 200
    end
    it "responds with token " do
      post "/api/auth/login", params: valid_creds
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key("token")
      user.reload
      latest_token = user.token.token_str
      expect(json_response["token"]).to eq latest_token
    end
  end
  context "POST /api/auth/login invalid credentials" do
    it "responds with 401 status" do
      post "/api/auth/login", params: invalid_creds
      expect(response.status).to eq 401
    end
  end

  context "GET /api/auth/session without a token header" do
    it "responds with error" do
      get "/api/auth/session"
      expect(response).to have_http_status(:not_found)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key("error")
      expect(json_response["error"]).to eq "User token not found"
    end
  end

  context "GET /api/auth/session with correct token header" do
    it "responds with the user" do
      get "/api/auth/session", headers: { 'Authorization' => "Bearer #{token.token_str}" }
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response).to have_key("user")
      expect(json_response["user"]["email"]).to eq user.email
    end
  end

end
```

### Devise
- `bundle add devise devise-jwt jsonapi-serializer`
- `bundle install`
- `rails generate devise:install`
- in `~/app/backend/config/environments/development.rb` add `config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }` near the other `action_mailer` lines
- in `~/app/backend/config/initializers/devise.rb` uncomment the `config.navigational_format` line and make it like this `config.navigational_formats = []`
- to avoid a `Your application has sessions disabled. To write to the session you must first configure a session store` error, in `~/app/backend/config/application.rb` add this near the other `config.` lines:
```
    config.session_store :cookie_store, key: '_interslice_session'
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options
```

### User Model
- `cd ~/app/backend`
- `rails g migration EnableUuid`
- add `enable_extension 'pgcrypto'` to `~/app/backend/db/migrate/<timestamp>_enable_uuuid.rb`
- `rails db:migrate`
- `rails generate devise User`
- to `~/app/backend/db/<timestamp>_devise_create_users.rb`, add this near the other `t.` lines:
```
t.boolean :admin, default: false
t.uuid :uuid, index: { unique: true }
```
- `rails db:migrate`
- make ~/app/backend/spec/factories/user.rb (TODO: is it `user.rb` or `users.rb`???) look like this:
```
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }
  end
end
```

### User Registration
- `rails g devise:controllers users -c sessions registrations`
- add `respond_to :json` to `~/app/backend/app/controllers/users/registrations_controller.rb` and `~/app/backend/app/controllers/users/sessions_controller.rb` (in both files hit return at the start of line 4 right after the opening `class` line to create a blank line and add `respond_to :json` there)
- make `~/app/backend/config/routes.rb` look like this:
```
# frozen_string_literal: true

Rails.application.routes.draw do
  resources :users, param: :uuid
  devise_for :users, path: '', path_names: {
    sign_in: 'api/auth/login',
    sign_out: 'api/auth/logout',
    registration: 'api/auth/signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  get 'up' => 'rails/health#show', as: :rails_health_check
end
```

### Users Controller
- `cd ~/app/backend`
- `touch app/controllers/users_controller.rb`
- make `~/app/backend/app/controllers/users/users_controller.rb` look like this:
```
class UsersController < ApplicationController
  before_action :set_user, only: %i[ show edit update destroy ]

  # GET /users or /users.json
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/1 or /users/1.json
  def show
    render json: @user
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    if @user.update(user_params)
      render json: @user, status: :ok, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    @user.destroy!
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find_by!(uuid: params[:uuid])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:uuid, :email, :password)
    end
end
```

### JWT
- add this to `~/app/backend/config/initializers/devise.rb` right before the last `end`:
```
config.jwt do |jwt|
  jwt.secret = Rails.application.credentials.fetch(:secret_key_base)
  jwt.dispatch_requests = [
    ['POST', %r{^/login$}]
  ]
  jwt.revocation_requests = [
    ['DELETE', %r{^/logout$}]
  ]
  jwt.expiration_time = 30.minutes.to_i
end
```
- `rails g migration addJtiToUsers jti:string:index:unique`
- change `~/app/backend/db/migrate/<timestamp>_add_jti_to_users.rb` to include this:
```
  add_column :users, :jti, :string, null: false
  add_index :users, :jti, unique: true
```
- make `~/app/backend/app/models/user.rb` look like this:
```
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
  before_create :set_uuid

  private

  def set_uuid
    self.uuid = SecureRandom.uuid if uuid.blank?
  end
end
```
- `rails db:migrate`
- `rails generate serializer user id email uuid`

### Auth Controllers
- make `~/app/backend/app/controllers/registrations_controller.rb` look like this:
```
class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  private

  def respond_with(resource, _opts = {})
    if request.method == "POST" && resource.persisted?
      render json: {
        status: {code: 200, message: "Signed up sucessfully."},
        data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
      }, status: :ok
    elsif request.method == "DELETE"
      render json: {
        status: { code: 200, message: "Account deleted successfully."}
      }, status: :ok
    else
      render json: {
        status: {code: 422, message: "User couldn't be created successfully. #{resource.errors.full_messages.to_sentence}"}
      }, status: :unprocessable_entity
    end
  end
end
```
- make `~/app/backend/app/controllers/sessions_controller.rb` look like this:
```
class Users::SessionsController < Devise::SessionsController
  respond_to :json
  private

  def respond_with(resource, _opts = {})
    render json: {
      token: request.env['warden-jwt_auth.token'],
      status: {code: 200, message: 'Logged in sucessfully.'},
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: "logged out successfully"
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Couldn't find an active session."
      }, status: :unauthorized
    end
  end
end
```

### Current User Endpoint
- `rails g controller current_user index`
- make `~/app/backend/app/controller/current_users_controller.rb` look like this:
```
class CurrentUserController < ApplicationController
  before_action :authenticate_user!
  def index
    render json: UserSerializer.new(current_user).serializable_hash[:data][:attributes], status: :ok
  end
end
```
- in `~/app/backend/config/routes.rb` replace `get 'current_user/index'` with `get '/api/auth/session', to: 'current_user#index'`

### User Seeds
- make `~/app/backend/db/seeds.rb` look like this:
```
User.create!(email: 'test@mail.com', password: 'password', admin: true)
User.create!(email: 'test2@mail.com', password: 'password')
```

### Test The API
- `rails server`
- split your terminal and in the second pane, run `curl -H 'Content-Type: application/json' -X POST -d '{"user": { "email": "test@mail.com", "password" : "password" }}' http://localhost:3000/api/auth/signup`
- `curl -H 'Content-Type: application/json' -X POST -d '{"user": { "email": "test@mail.com", "password" : "password" }}' http://localhost:3000/api/auth/login`
- kill the server with `^ + c`

### S3 In Rails
- `cd ~/app/backend`
- `bundle add aws-sdk-s3`
- `bundle install`
- `touch app/controllers/uploads_controller.rb`
- make `~/app/backend/app/controllers/uploads_controller.rb` look like this:
```
class UploadsController < ApplicationController
  before_action :authenticate_user! # Ensure you have authentication in place

  def presigned_url
    filename = params[:filename]
    content_type = params[:content_type]

    s3_client = Aws::S3::Client.new(region: 'your-region')
    presigned_url = s3_client.presigned_url(:put_object,
      bucket: 'qa-applicant-portal',
      key: filename,
      content_type: content_type,
      acl: 'public-read' # Adjust ACL as needed
    )

    render json: { url: presigned_url }
  end
end
```
- add `get 'upload', to: 'uploads#presigned_url'` to `~/app/backend/config/routes.rb`

### Avatars In Rails
- `cd ~/app/backend`
- `rails active_storage:install`
- `rails db:migrate`
- open your `~/Desktop/app-secrets/User Access Keys.csv` and `~/Desktop/app-secrets/aws-details.txt`. You'll need the `access key ID`, `secret access key`, `region` and `bucket` in the next step.
- `EDITOR="code --wait" rails credentials:edit`
  - uncomment the first three lines (the AWS lines)
  - add your `access key ID` and `secret access key` so the file will look something like this (with the x's replaced with your values):
```
aws:
  access_key_id: XXXXXXXXXXXXXXXXXXXX
  secret_access_key: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  region: <your aws region>
  bucket: <your s3 bucket name>
```
  - save and close the credentials.yml file
- in your `~/app/backend/config/storage.yml` file, uncomment the aws section like:
```
amazon:
  service: S3
  access_key_id: <%= Rails.application.credentials.dig(:aws, :access_key_id) %>
  secret_access_key: <%= Rails.application.credentials.dig(:aws, :secret_access_key) %>
  region: us-east-1
  bucket: your_own_bucket-<%= Rails.env %>
```
- in `~/app/backend/app/models/user.rb`, add `has_one_attached :avatar` so it looks like this:
```
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
  has_one_attached :avatar

  before_create :set_uuid

  def avatar_url
    Rails.application.routes.url_helpers.rails_blob_url(self.avatar, only_path: true) if avatar.attached?
  end

  private

  def set_uuid
    self.uuid = SecureRandom.uuid if uuid.blank?
  end
end
```
- in `~/app/backend/app/controllers/users_controller.rb`, add `:avatar` to the permitted parameters and change the `update` method so the whole file looks like this:
```
class UsersController < ApplicationController
  before_action :set_user, only: %i[ show edit update destroy ]

  # GET /users or /users.json
  def index
    @users = User.all
    render json: @users
  end

  # GET /users/1 or /users/1.json
  def show
    render json: @user.as_json.merge(avatar_url: @user.avatar.attached? ? url_for(@user.avatar) : nil)
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1 or /users/1.json

  def update
    if @user.update(user_params)
      render json: @user.as_json.merge(avatar_url: @user.avatar.attached? ? url_for(@user.avatar) : nil)
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    @user.destroy!
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find_by!(uuid: params[:uuid])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:uuid, :email, :avatar, :password)
    end
end
```
- change `~/app/backend/app/serializers/user_serializer.rb` to look like this:
```
class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :email, :uuid, :avatar_url
end
```
- change `~/app/backend/config/routes.rb` to look like this:
```
# frozen_string_literal: true

Rails.application.routes.draw do
  resources :users, param: :uuid
  devise_for :users, path: '', path_names: {
    sign_in: 'api/auth/login',
    sign_out: 'api/auth/logout',
    registration: 'api/auth/signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  get '/api/auth/session', to: 'current_user#index'
  get 'up' => 'rails/health#show', as: :rails_health_check
  get 'upload', to: 'uploads#presigned_url'
end
```

### Avatars In Nuxt
- change `~/app/frontend/pages/users/[id].vue` to look like this:
```
<script setup>
definePageMeta({ auth: false })

const route = useRoute()
const user = ref({})
const avatar = ref(null)

async function fetchUser() {
  const { apiBase } = useRuntimeConfig().public
  const response = await fetch(`${apiBase}/users/${route.params.id}`)
  user.value = await response.json()

  console.log('Fetched user avatar URL:', user.value.avatar_url)
}

async function saveUserChanges(updatedUser) {
  const { apiBase } = useRuntimeConfig().public
  const formData = new FormData()
  formData.append('user[email]', updatedUser.email)
  formData.append('user[uuid]', updatedUser.uuid)
  if (avatar.value) {
    formData.append('user[avatar]', avatar.value)
  }

  await fetch(`${apiBase}/users/${route.params.id}`, {
    method: 'PATCH',
    body: formData,
  })

  // Wait a moment before fetching updated user data
  setTimeout(fetchUser, 500)
}

async function deleteUser() {
  const { apiBase } = useRuntimeConfig().public
  await fetch(`${apiBase}/users/${route.params.id}`, {
    method: 'DELETE',
  })
  navigateTo('/users')
}

function onFileChange(e) {
  avatar.value = e.target.files[0]
  console.log('Selected file:', avatar.value)
}

// Watch for changes in the email field and avatar value
watch(
  () => user.value.email,
  (newEmail, oldEmail) => {
    if (newEmail !== oldEmail) {
      saveUserChanges(user.value)
    }
  },
)

watch(
  avatar,
  (newAvatar, oldAvatar) => {
    if (newAvatar !== oldAvatar) {
      saveUserChanges(user.value)
    }
  },
)

onMounted(fetchUser)
</script>

<template>
  <UiContainer class="relative flex flex-col py-10 lg:py-20">
    <div
      class="absolute inset-0 z-[-2] h-full w-full bg-transparent bg-[linear-gradient(to_right,_theme(colors.border)_1px,_transparent_1px),linear-gradient(to_bottom,_theme(colors.border)_1px,_transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(#000,_transparent_80%)]"
    />
    <div class="flex h-full lg:w-[768px]">
      <div>
        <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:mb-6 lg:mt-5 xl:text-6xl">
          User
        </h1>
        <div class="flex items-center justify-center">
          <form @submit.prevent="saveUserChanges(user)">
            <UiCard class="w-[360px] max-w-sm" :title="user.email">
              <template #content>
                <UiCardContent>
                  <div class="grid w-full items-center gap-4">
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="email">
                        Email
                      </UiLabel>
                      <UiInput id="email" v-model="user.email" required />
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="uuid">
                        UUID
                      </UiLabel>
                      <p class="text-sm">
                        {{ user.uuid }}
                      </p>
                    </div>
                    <div class="flex flex-col space-y-1.5">
                      <UiLabel for="avatar">
                        Avatar
                      </UiLabel>
                      <div v-if="user.avatar_url">
                        <img :src="`${user.avatar_url}?${new Date().getTime()}`" alt="User Avatar" class="w-32 h-32 object-cover rounded-full">
                      </div>
                      <input type="file" @change="onFileChange">
                    </div>
                  </div>
                </UiCardContent>
              </template>
              <template #footer>
                <UiCardFooter class="flex justify-between">
                  <UiButton variant="destructive" @click.prevent="deleteUser">
                    <Icon name="lucide:trash" />
                    Delete User
                  </UiButton>
                </UiCardFooter>
              </template>
            </UiCard>
          </form>
        </div>
      </div>
    </div>
  </UiContainer>
</template>
```



## Sources
- Nuxt https://nuxt.com (visited 7/4/24)
- Antfu ESLint Config https://github.com/antfu/eslint-config (visited 7/4/24)
- Picocss https://picocss.com (visited 7/4/24)
- Picocss Examples https://picocss.com/examples (visited 7/4/24)
- Picocss Classless Example https://x4qtf8.csb.app (visited 7/4/24)
- Devise For API-Only Rails https://dakotaleemartinez.com/tutorials/devise-jwt-api-only-mode-for-authentication/ (visited 7/18/24)
- Uploading to AWS S3 using VueJS + Nuxt, Dropzone and a Node API https://loadpixels.com/2018/11/22/uploading-to-aws-s3-using-vuejs-nuxt-dropzone-and-a-node-api/ (visited 7/19/24)
- How to Upload Files to Amazon S3 with React and AWS SDK https://dev.to/aws-builders/how-to-upload-files-to-amazon-s3-with-react-and-aws-sdk-b0n (visited 7/19/24)