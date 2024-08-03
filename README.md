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

### Home Page
- `cd ~/app/frontend`
- `npx ui-thing@latest add container badge button gradient-divider`
- `mkdir components`
- `touch components/Home.vue`
- make `~/app/frontend/components/Home.vue` look like this:
```
<template>
  <h1 class="mb-4 mt-7 text-4xl font-bold lg:mb-6 lg:mt-5 lg:text-center lg:text-5xl xl:text-6xl">
    There was a wall.<br />It did not look important.
  </h1>
  <p class="mx-auto max-w-[760px] text-lg text-muted-foreground lg:text-center lg:text-xl">
     It was built of uncut rocks roughly mortared. An adult could look right over it, and even a child could climb it. Where it crossed the roadway, instead of having a gate it degenerated into mere geometry, a line, an idea of boundary. But the idea was real.
  </p>

  <div class="mt-8 grid w-full grid-cols-1 items-center gap-3 sm:flex sm:justify-center lg:mt-10">
    <UiButton size="lg" variant="outline"> <Icon name="lucide:play-circle" /> Demo </UiButton>
    <UiButton size="lg">Sign up</UiButton>
  </div>

  <div
    class="mx-auto mt-10 h-[350px] w-full overflow-hidden rounded-md lg:mt-10 lg:h-[520px] lg:w-[900px] lg:rounded-lg"
  >
    <iframe
      width="100%"
      height="100%"
      src="https://www.youtube.com/embed/oYEtLQ3lEH0?si=fQ6bK1XLkFAQBePK"
      :title="`${COMPANY_NAME} hero section seven video`"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />
  </div>
</template>

<script lang="ts" setup></script>
```
- make `~/app/frontend/app.vue` look like this: 
```
<template>
  <UiContainer class="relative flex flex-col items-center py-10 text-center lg:py-20">
    <Home />
  </UiContainer>
</template>
```

### Layout
- `cd ~/app/frontend`
- `npx ui-thing@latest add container`
- `mkdir ~/app/frontend/layouts`
- `touch ~/app/frontend/layouts/default.vue`
- add this to `~/app/frontend/layouts/default.vue`:
```
<template>
  <Header />
  <main class="flex flex-col xl:flex-row h-screen">
    <div class="w-full xl:w-1/2 my-4 h-screen flex items-center justify-center">
      <NuxtPage />
    </div>
  </main>
</template>
```

### Pages
- `mkdir pages`
- `touch pages/index.vue`
- make `~/app/frontend/pages/index.vue` look like:
```
<template>
    <div class="w-4/6">
      <span class="tracking-tight font-light text-gray-500 text-4xl">
        <h3 class="text-base">Welcome</h3>
        <h4 class="text-7xl md:text-8 tracking-tight leading-none font-extrabold text-cyan-500 mt-1">
          Test App
        </h4>
        <p class="text-lg text-gray-500 mt-2">
          Here you can do anything your little heart desires.
        </p>
        <NuxtLink to="/login" class="inline-block bg-cyan-500 hover:bg-cyan-600 mt-3 px-6 py-3 rounded-md text-white text-lg">Log In</NuxtLink>
      </span>
    </div>
  </template>
```
- `rm ~/app/frontend/app.vue`

### Header & Footer
- `cd ~/app/frontend/components`
- `touch Header.vue`
- make `~/app/frontend/components/Header.vue` look like this:
```
<template>
    <nav class="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <NuxtLink to="/">
          <span class="font-bold nav-header text-xl">Test App</span>
        </NuxtLink>
      </div>
      <div class="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
        <div class="text-sm sm:flex-grow text-end mr-4">
          <NuxtLink to="/public" class="block mt-4 sm:inline-block sm:mt-0 text-white hover:text-cyan-500 mr-4">
            Public
          </NuxtLink>
          <NuxtLink to="/private" class="block mt-4 sm:inline-block sm:mt-0 text-white hover:text-cyan-500 mr-4">
            Private
          </nuxtlink>
        </div>
        <div>
          <NuxtLink to="/login" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 md:mt-0">
            Login
          </NuxtLink>
        </div>
      </div>
    </nav>
  </template>
```

### Subpages
- `cd ~/app/frontend/pages`
- `touch public.vue private.vue`
- make `~/app/frontend/pages/public.vue` look like this:
```
<template>
  <div class="w-4/6">
    <span class="tracking-tight font-light text-gray-500 text-4xl">
      <h4 class="text-7xl md:text-8 tracking-tight leading-none font-extrabold text-cyan-500 mt-1">
        Public
      </h4>
      <p class="text-lg text-gray-500 mt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a aliquet metus, non lacinia ligula. Vestibulum convallis massa vitae arcu fringilla rhoncus. In ut ligula posuere, fringilla leo sit amet, fringilla nisl. Nam orci odio, finibus a hendrerit sit amet, dapibus in risus. Phasellus maximus mattis turpis vitae gravida. Donec nec tellus elit. Mauris luctus mi ut est porta, sit amet lobortis felis imperdiet. Quisque ut eros pellentesque, vestibulum eros vel, cursus ligula. Nulla tortor purus, sollicitudin id gravida eu, efficitur eu elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dictum congue nibh vel egestas. Nulla vel lacinia sem.
      </p>
    </span>
  </div>
</template>

```
- make `~/app/frontend/pages/private.vue` look like this:
```
<template>
  <div class="w-4/6">
    <span class="tracking-tight font-light text-gray-500 text-4xl">
      <h4 class="text-7xl md:text-8 tracking-tight leading-none font-extrabold text-cyan-500 mt-1">
        Private
      </h4>
      <p class="text-lg text-gray-500 mt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi a aliquet metus, non lacinia ligula. Vestibulum convallis massa vitae arcu fringilla rhoncus. In ut ligula posuere, fringilla leo sit amet, fringilla nisl. Nam orci odio, finibus a hendrerit sit amet, dapibus in risus. Phasellus maximus mattis turpis vitae gravida. Donec nec tellus elit. Mauris luctus mi ut est porta, sit amet lobortis felis imperdiet. Quisque ut eros pellentesque, vestibulum eros vel, cursus ligula. Nulla tortor purus, sollicitudin id gravida eu, efficitur eu elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer dictum congue nibh vel egestas. Nulla vel lacinia sem.
      </p>
    </span>
  </div>
</template>

```
- `cd ~/app/frontend`
- `npm run dev` -> home, public & private links work (private page is not yet locked)
- `^ + c`

### Icon 
- install the VSCode Iconify IntelliSense extention
- `npx nuxi@latest module add icon`
- in `~/app/frontend/components/Header.vue` make
```
<span class="font-bold nav-header text-xl">Test App</span>
```
look like this:
```
<span class="font-bold nav-header text-xl"><Icon name="fa-solid:laptop-code" mode="svg" size="0.8em" /> 
```
- and add this at the bottom of `~/app/frontend/components/Header.vue`:
```
<style scoped>
.nav-header {
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.2em;
  }
}
</style>
```
- `cd ~/app/frontend`
- `npm run dev`
- `^ + c` -> Icon should show in h1

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
let development = process.env.NODE_ENV !== 'production'
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: { port: 3001 },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/icon", "@sidebase/nuxt-auth"],
  auth: {
    computed: { pathname: development ? "http://localhost:3000/api/auth/" : "https://interview-app-backend.fly.dev/api/auth/" },
    isEnabled: true,
    globalAppMiddleware: { isEnabled: true },
    provider: {
      type: 'local',
      pages: { login: '/' },
      token: { signInResponseTokenPointer: '/token' },
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/register', method: 'post' },
        getSession: { path: '/session', method: 'get' }
      },
    },
  },
})
```
- `npm run dev` -> private page redirects to homepage (login still goes to a 404)
- `^ + c`

### Header With Auth
- make `~/app/frontend/components/Header.vue` look like this:
```
<script setup>
const { data, signOut, status } = useAuth()

async function logout() {
  await signOut({ callbackUrl: '/' })
}
</script>

<template>
    <nav class="flex items-center justify-between flex-wrap bg-gray-800 p-6">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <NuxtLink to="/">
          <span class="font-bold nav-header text-xl"><Icon name="fa-solid:laptop-code" mode="svg" size="0.8em" /> Test App</span>
        </NuxtLink>
      </div>
      <div class="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
        <div class="text-sm sm:flex-grow text-end mr-4">
          <NuxtLink to="/public" class="block mt-4 sm:inline-block sm:mt-0 text-white hover:text-cyan-500 mr-4">
            Public
          </NuxtLink>
          <NuxtLink v-if="status === 'authenticated'" to="/private" class="block mt-4 sm:inline-block sm:mt-0 text-white hover:text-cyan-500 mr-4">
            Private
          </nuxtlink>
        </div>
        <div>
          <NuxtLink v-if="status === 'unauthenticated'" to="/login" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 md:mt-0">
            Login
          </NuxtLink>
          <button v-if="status === 'authenticated'" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 md:mt-0" @click.prevent="logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  </template>

<style scoped>
.nav-header {
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.2em;
  }
}
</style>
```
- `cd ~/app/frontend`
- `npm run dev`
- `^ + c` -> Private link should now be hidden

### Login Form
- `touch ~/app/frontend/pages/login.vue`
- make `~/app/frontend/pages/login.vue` look like this:
```
<script setup>
const { signIn, status } = useAuth()
definePageMeta({ auth: false })
const email = ref('test@mail.com')
const password = ref('password')

async function login() {
  await signIn({ user: { email: email.value, password: password.value } }, { redirect: false })
}
</script>

<template>
  <div class="w-4/6">
    <span class="tracking-tight font-light text-gray-500 text-4xl">

      <h4 class="text-7xl md:text-8 tracking-tight leading-none font-extrabold text-cyan-500 mt-1">
        Login
      </h4>

      <div class="w-full max-w-xs">
        <form class="pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
              Email
            </label>
            <input v-model="email" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text">
          </div>
          <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
              Password
            </label>
            <input v-model="password" class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password">
          </div>
          <div class="flex items-center justify-between">
            <button @click.prevent="login" class="inline-block bg-cyan-500 hover:bg-cyan-600 mt-3 px-6 py-3 rounded-md text-white text-lg" type="button">
              Submit
            </button>
          </div>
        </form>
      </div></span>
  </div>
</template>
```
- `npm run test` -> 3 test files should pass and 1 should fail (private.spec.js)
- `npm run lint`
- `npm run lint:fix`

### Nuxt User Views
- `cd ~/app/frontend`
- `mkdir pages/users`
- `cd pages/users`
- `touch index.vue new.vue \[id\].vue`
- make `~/app/frontend/pages/users/index.vue` look like this:
```
<template>
  <div>
    <h2>Users</h2>
    <ul>
      <li v-for="user in users" :key="user.id">
        <NuxtLink :to="`/users/${user.id}`">{{ user.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const users = ref([])

onMounted(async () => {
  const { apiBase } = useRuntimeConfig().public
  const response = await fetch(`${apiBase}/users`)
  users.value = await response.json()
})
</script>
  ```
- make `~/app/frontend/pages/users/[id].vue` look like this:
```
<template>
  <div>
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
    <img :src="user.avatarUrl" alt="User Avatar" v-if="user.avatarUrl" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from '#app'
  
const route = useRoute()
const user = ref({})

onMounted(async () => {
  const { apiBase } = useRuntimeConfig().public
  const response = await fetch(`${apiBase}/users/${route.params.id}`)
  user.value = await response.json()
})
</script>
```
- make `~/app/fronte nd/pages/users/new.vue` look like this: (TODO: This is a WIP)
```
<script setup>
import { useRuntimeConfig } from '#app';
import { ref } from 'vue';

const name = ref('');
const email = ref('');
const selectedFile = ref(null);

const handleFileSelected = (file) => {
  selectedFile.value = file;
};

const createUser = async () => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    const response = await fetch(`${apiBase}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.value, email: email.value })
    });
    console.log(response)
    
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
</script>

<template>
  <div class="w-4/6">
    <span class="tracking-tight font-light text-gray-500 text-4xl">
      <h4 class="text-7xl md:text-8 tracking-tight leading-none font-extrabold text-cyan-500 mt-1">
        New User
      </h4>
    </span>
    <form @submit.prevent="createUser">
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <input v-model="name" type="text" id="name" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:border-solid" placeholder="Name" required>
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input id="email" class="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:border-solid" placeholder="Enter your password" required>
        </div>
        <!-- <div class="mb-4">
          <Upload @fileSelected="handleFileSelected" />
        </div> -->
        <button class="inline-block bg-cyan-500 hover:bg-cyan-600 mt-3 px-6 py-3 rounded-md text-white text-lg" type="submit">Submit</button>
      </form>
  </div>
</template>
```
    
### Nuxt File Upload Component
- `cd ~/app/frontend`
- `touch components/Upload.vue`
- make `~/app/frontend/components/Upload.vue` look like this: (TODO: This is a WIP)
```
<template>
  <input type="file" @change="handleFileUpload" />
</template>

<script setup>
import { defineEmits, ref } from 'vue';

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
- at top right, select a region if currently says `global` (I use the `us-east-1` region)
- at top right click your name
  - next to Account ID, click the copy icon (two overlapping squares)
  - paste your Account ID in a new text file (It pastes without the dashes. Leave it that way - you need it without the dashes.)
  - save this in a file called `s3-creds.txt` or something in a folder on your Desktop called `app-secrets` or something. You'll need it shortly. Whatever you do, never commit the `app-secrets` folder or the `s3-creds.txt` file to your github repo. These will have to be kept locally on your computer, or better yet, saved to a password manager.

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
  - click Create Policy towards the bottom right

#### AWS User
- click `Users` under Access Management in the left sidebar
  - click `Create User` towards the top right
  - enter name, something like `app-s3-user` (add this to your `s3-creds.txt` file on your desktop - you'll need it later)
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
    - I like to create a folder on my desktop called `app-secrets` and move the `AccessKeys.csv` file into that

#### AWS S3 Bucket
- in searchbar at top, enter `s3` and select S3
- Create Bucket
  - for Bucket Name, enter something like `app-s3-bucket-development` (below when you click Create Bucket, it may tell you this bucket already exists and you will have to make it more unique. Regardless, add this to your `s3-creds.txt` file on your desktop - you'll need it later)
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
  - Update all the `<aws acct id without dashes>`, `<iam username>` and `<bucket name>` parts in the policy now in the text editor area under Policy with the account number, user name and bucket name you jotted down above in your `s3-creds.txt` file on your Desktop.
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
  - in the Policy Editor text editor area, in the line `"Resource": "arn:aws:s3:::bucketname"` replace `bucketname` with your bucket name in your `aws-creds.txt` file
  - click Next towards the bottom right
  - click Save Changes towards the bottom right
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

### Users
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
- `rails g devise:controllers users -c sessions registrations`
- add `respond_to :json` to `~/app/backend/app/controllers/users/registrations_controller.rb` and `~/app/backend/app/controllers/users/sessions_controller.rb` (in both files hit return at the start of line 4 right after the opening `class` line to create a blank line and add `respond_to :json` there)
- make `~/app/backend/config/routes.rb` look like this:
```
# frozen_string_literal: true

Rails.application.routes.draw do
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
end
```
- `rails db:migrate`
- `rails generate serializer user uuid email`

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




## Sources
- Nuxt https://nuxt.com (visited 7/4/24)
- Antfu ESLint Config https://github.com/antfu/eslint-config (visited 7/4/24)
- Picocss https://picocss.com (visited 7/4/24)
- Picocss Examples https://picocss.com/examples (visited 7/4/24)
- Picocss Classless Example https://x4qtf8.csb.app (visited 7/4/24)
- Devise For API-Only Rails https://dakotaleemartinez.com/tutorials/devise-jwt-api-only-mode-for-authentication/ (visited 7/18/24)
- Uploading to AWS S3 using VueJS + Nuxt, Dropzone and a Node API https://loadpixels.com/2018/11/22/uploading-to-aws-s3-using-vuejs-nuxt-dropzone-and-a-node-api/ (visited 7/19/24)
- How to Upload Files to Amazon S3 with React and AWS SDK https://dev.to/aws-builders/how-to-upload-files-to-amazon-s3-with-react-and-aws-sdk-b0n (visited 7/19/24)