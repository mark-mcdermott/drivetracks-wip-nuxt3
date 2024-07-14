# Rails API & Nuxt 3 App

## Init App
- `cd ~`
- `mkdir app`
- `cd app`
- `wget https://raw.githubusercontent.com/mark-mcdermott/drivetracks-wip-nuxt3/main/README.md`

## Frontend Specs

### Nuxt Starter App
- install VSCode `Vue - Official` extension
- `cd ~/app`
- `npx nuxi@latest init frontend`
  - package manager: `npm`
  - init git repo: `no`
- `cd frontend`
- `npm run dev`
- `^ + c`

### ESLint
- (I prefer antfu eslint-config install command to this manual install, but antfu's eslint-config has an install dependency issue as of this writing on 7/13/24)
- install VSCode `ESLint` extention
- `cd ~/app/frontend`
- `mkdir .vscode`
- `touch .vscode/settings.json`
- make `~/app/frontend/.vscode/settings.json` look like this:
```
{
  "eslint.experimental.useFlatConfig": true
}
```
- `npm i -D @antfu/eslint-config@2.21.0`
- `touch eslint.config.mjs`
- make `eslint.config.mjs` look like this:
```
import antfu from '@antfu/eslint-config'
export default antfu({
  vue: true
})
```
- in `~/app/frontend/package.json` in the `scripts` section add:
```
"lint": "npx eslint .",
"lint:fix": "npx eslint . --fix"
```
- `npm run lint` 
- `npm run lint:fix` 

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
  test: { environment: 'happy-dom', setupFiles: ["./specs/mocks/mocks.js"] },
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
- `mkdir specs`
- `cd specs`
- `mkdir components layouts pages`
- `cd components`
- `touch Header.spec.js Footer.spec.js`
- `cd ../pages`
- `cd pages`
- `touch home.spec.js public.spec.js private.spec.js`

### Mocks
- `cd ~/app/frontend`
- `mkdir specs/mocks`
- `touch specs/mocks/mocks.js`
- make `~/app/frontend/specs/mocks/mocks.js` look like this:
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
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from './../../components/Header.vue'

describe('Header', () => {
  const wrapper = mount(Header)
  const h1 = wrapper.find("h1")

  it('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  it('has correct title', () => {
    expect(h1.text()).toBe('Auth Test App');
  })

  it('has correct h1 html', () => {
    const h1Element = h1.element.cloneNode(true);
    removeDataAttributes(h1Element);
    const h1Html = h1Element.outerHTML;
    expect(h1Html).toMatch('<h1><icon name="fa-solid:lock" mode="svg" size="0.8em"></icon> Auth Test App </h1>')
  })
})


// Helper to remove data attributes recursively
function removeDataAttributes(node) {
  if (node.nodeType === 1) { // Element node
    const attributes = Array.from(node.attributes);
    for (const attr of attributes) {
      if (attr.name.startsWith('data-')) {
        node.removeAttribute(attr.name);
      }
    }
    for (const child of node.childNodes) {
      removeDataAttributes(child);
    }
  }
}
```
- make `~/app/frontend/specs/components/Footer.spec.js` look like this:
```
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from './../../components/Footer.vue'

const wrapper = mount(Footer)

describe('Footer', () => {
  it('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })
  it('has correct html', () => {
    expect(wrapper.html()).toContain('<footer><small>Built with <a href="https://picocss.com">Pico</a></small></footer>')
  })
})
```

### Page Specs
- make `~/app/frontend/specs/pages/home.spec.js` look like this:
```
import { expect, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import homePage from './../../pages/index.vue'

describe('Home page', () => {
  it('is a Vue instance', () => {
    expect(mount(homePage).vm).toBeTruthy()
  })
})

describe('Home page, when logged out', () => {
  it('shows login form', () => {
    const wrapper = mount(homePage)
    expect(wrapper.find("form").exists()).toBe(true)
    expect(wrapper.find("input").exists()).toBe(true)
  })
})

describe('Home page, when logged in', () => {
  it('does not show login form', () => {
    vi.stubGlobal("useAuth", () => { return { status: 'authenticated' }}) // logged in
    const wrapper = mount(homePage)
    expect(wrapper.find("form").exists()).toBe(false)
    expect(wrapper.find("input").exists()).toBe(false)
  })
})

describe('Home page has correct copy', () => {
  it('has correct h2 text', () => {
    expect(mount(homePage).find("h2").text()).toBe('Home');
  })
  it('has correct p text', () => {
    expect(mount(homePage).find("p").text()).toContain('Most bee jobs are small ones. But bees know that every small job, if it\'s done well means a lot. But choose carefully because you\'ll stay in the job you pick for the rest of your life.');
  })
})
```
- make `~/app/frontend/specs/pages/public.spec.js` look like this:
```
import { expect, describe, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import publicPage from './../../pages/public.vue'

describe('Public page has correct copy', () => {
  it('has correct h2 text', () => {
    expect(mount(publicPage).find("h2").text()).toBe('Public');
  })
  it('has correct p text', () => {
    expect(mount(publicPage).find("p").text()).toContain("How come you don't fly everywhere? It's exhausting. Why don't you run everywhere? It's faster. Yeah, OK, I see, I see. All right, your turn. TiVo. You can just freeze live TV? That's insane! You don't have that? We have Hivo, but it's a disease. It's a horrible, horrible disease.");
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

## Backend Specs

### Rails Starter API
- install VSCode extentions RubyLSP and Rubocop
- `cd ~/app`
- `rails new backend --api --database=postgresql`
- `cd backend`
- `bundle add rack-cors`
- `bundle install`
- in `~/app/backend/config/initializers/cors.rb` uncomment lines 10-18 and change the `origins` line to `origins "*"`

### Rubocop
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
- `touch spec/factories/user.rb spec/factories/token.rb`
- make `~/app/backend/spec/factories/user.rb` look like this:
```
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password" }
  end
end
```
- make `~/app/backend/spec/factories/token.rb` look like this:
```
FactoryBot.define do
  factory :token do
    association :user
    token_str { Digest::MD5.hexdigest(SecureRandom.hex) }
    active { false }
  end
end
```
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

## Build Out Frontend

### Barebones Hello World
- change `~/app/frontend/app.vue` to:
```
<template>
  <div>
    <h1>Hello World</h1>
  </div>
</template>
```
- `cd ~/app/frontend`
- `npm run dev` -> "Hello World" in Times New Roman
- `^ + c`

### Sass
- `cd ~/app/frontend`
- `npm install --save-dev sass`
- `mkdir -p assets/scss`
- `touch assets/scss/main.scss`
- add to nuxt.config.ts: 
```
css: ['~/assets/scss/main.scss'],
```
- `npm run dev`
- `^ + c` -> it will look the same as above still

### Picocss
- `cd ~/app/frontend`
- `npm install @picocss/pico`
- add to `~/app/frontend/assets/scss/main.scss`:
```
@use '@picocss/pico';
```
- `npm run dev` -> "Hello World" in nice sans-serif font
- `^ + c`
- change `~/app/frontend/assets/scss/main.scss` to:
```
@use '@picocss/pico/scss/pico' with (
  $semantic-root-element: '#__nuxt',
  $enable-semantic-container: true,
  $enable-classes: false
)
```
- change `~/app/frontend/app.vue` to: 
```
<template>
  <main>
    <h1>Hello World</h1>
  </main>
</template>
```
- `npm run dev` -> "Hello World" has left & top margin
- `^ + c`

### Pages
- `mkdir pages`
- `touch pages/index.vue`
- make `~/app/frontend/pages/index.vue` look like:
```
<template>
  <h1>Hello World</h1>
</template>
```
- `rm ~/app/frontend/app.vue`

### Layouts
- `mkdir ~/app/frontend/layouts`
- `touch ~/app/frontend/layouts/default.vue`
- add this to `~/app/frontend/layouts/default.vue`:
```
<template>
  <header>header</header>
  <main><NuxtPage /></main>
  <footer>footer</footer>
</template>
```

### Body
- copy the everything inside the `<main>...</main>` section from the Picocss Classless Example here https://x4qtf8.csb.app and paste it in `~/app/frontend/pages/index.vue` so it replaces the current `<h1>Hello World</h1>`
- remove the blockquote and list sections within the `main` so `~/app/frontend/pages/index.vue` looks like this:
```
<template>
  <!-- Typography-->
  <section id="typography">
    <h2>Typography</h2>
    <p>
      Aliquam lobortis vitae nibh nec rhoncus. Morbi mattis neque eget
      efficitur feugiat. Vivamus porta nunc a erat mattis, mattis feugiat
      turpis pretium. Quisque sed tristique felis.
    </p>
  </section>
</template>
```

### Header
- in `~/app/frontend/layouts/default.vue` repleace the current `<header>header</header>` with the whole header section from the Classless Picocss Example page: 
```
<header>
  <hgroup>
    <h1>Pico</h1>
    <p>A class-less example, without dependencies.</p>
  </hgroup>
  <nav>
    <ul>
      <li><a href="#" data-theme-switcher="auto">Auto</a></li>
      <li><a href="#" data-theme-switcher="light">Light</a></li>
      <li><a href="#" data-theme-switcher="dark">Dark</a></li>
    </ul>
  </nav>
</header>
```

### Footer
- in `~/app/frontend/layouts/default.vue` repleace the current `<footer>footer</footer>` with the whole footer section from the Classless Picocss Example page: 
```
<footer>
  <small
    >Built with <a href="https://picocss.com">Pico</a> •
    <a
      href="https://github.com/picocss/examples/blob/master/v2-html-classless/index.html"
      >Source code</a
    ></small
  >
</footer>
```
- `npm run dev` -> header, body & footer all show (will look the same as above)
- `^ + c`

### Content
- `cd ~/app/frontend`
- change `~/app/frontend/layouts/default.vue` so it looks like this:
```
<template>
  <header>
    <hgroup>
      <h1>Auth Test App</h1>
      <p>A really cool app.</p>
    </hgroup>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Public</a></li>
        <li><a href="#">Private</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <NuxtPage />
  </main>
  <footer>
    <small>Built with <a href="https://picocss.com">Pico</a></small>
  </footer>
</template>
```
- change `~/app/frontend/pages/index.vue` so it looks like this:
```
<template>
  <h2>Home</h2>
  <p>Most bee jobs are small ones. But bees know that every small job, if it's done well means a lot. But choose carefully because you'll stay in the job you pick for the rest of your life.</p>
</template>
```
- (placeholder `<p>` text generated with VSCode extension Ya Like Jazz)
- `npm run dev` -> new content shows
- `^ + c`

### NuxtLinks
- make `~/app/frontend/layouts/default.vue` look like this:
```
<template>
  <header>
    <hgroup>
      <h1>Auth Test App</h1>
      <p>A really cool app.</p>
    </hgroup>
    <nav>
      <ul>
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/public">Public</NuxtLink></li>
        <li><NuxtLink to="/private">Private</NuxtLink></li>
      </ul>
    </nav>
  </header>
  <main>
    <NuxtPage />
  </main>
  <footer>
    <small>Built with <a href="https://picocss.com">Pico</a></small>
  </footer>
</template>
```
- (subpages not yet built out yet, will link to 404 right now)

### Components
- `cd ~/app/frontend`
- `mkdir components`
- `cd components`
- `touch Header.vue Footer.vue`
- make `~/app/frontend/components/Header.vue` look like this:
```
<template>
  <header>
    <hgroup>
      <h1>Auth Test App</h1>
      <p>A really cool app.</p>
    </hgroup>
    <nav>
      <ul>
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/public">Public</NuxtLink></li>
        <li><NuxtLink to="/private">Private</NuxtLink></li>
      </ul>
    </nav>
  </header>
</template>
```
- make `~/app/frontend/components/Footer.vue` look like this:
```
<template>
  <footer>
    <small>Built with <a href="https://picocss.com">Pico</a></small>
  </footer>
</template>
```
- make `~/app/frontend/layouts/default.vue` look like this:
```
<template>
  <Header />
  <main><NuxtPage /></main>
  <Footer />
</template>
```
- `npm run dev` -> header, body & footer all show
- `^ + c`

### Subpages
- `cd ~/app/frontend/pages`
- `touch public.vue private.vue`
- make `~/app/frontend/pages/public.vue` look like this:
```
<template>
  <h2>Public</h2>
  <p>How come you don't fly everywhere? It's exhausting. Why don't you run everywhere? It's faster. Yeah, OK, I see, I see. All right, your turn. TiVo. You can just freeze live TV? That's insane! You don't have that? We have Hivo, but it's a disease. It's a horrible, horrible disease.</p>
</template>
```
- make `~/app/frontend/pages/private.vue` look like this:
```
<template>
  <h2>Private</h2>
  <p>We know that you, as a bee, have worked your whole life to get to the  point where you can work for your whole life. Honey begins when our valiant Pollen Jocks bring the nectar to the hive. Our top-secret formula is automatically  color-corrected, scent-adjusted and bubble-contoured into this soothing sweet syrup with its distinctive golden glow you know as Honey!</p>
</template>
```
- `cd ~/app/frontend`
- `npm run dev` -> home, public & private links work (private page is not yet locked)
- `^ + c`

### Icon 
- install the VSCode Iconify IntelliSense extention
- `npx nuxi@latest module add icon`
- in `~/app/frontend/components/Header.vue` make the `h1` look like this:
```
<h1><Icon name="fa-solid:lock" mode="svg" size="0.8em" /> Auth Test App</h1>
```
- and add this at the bottom of `~/app/frontend/components/Header.vue`:
```
<style scoped>
h1 {
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

### Mock API
- `mkdir -p ~/app/frontend/server/api/auth`
- `cd ~/app/frontend/server/api/auth`
- `touch login.post.ts logout.post.ts session.get.ts`
- make 
`~/app/frontend/server/api/auth/logout.post.ts` look like this:
```
export default eventHandler(() => {

})
```
- make `~/app/frontend/server/api/auth/session.get.ts` look like this:
```
export default eventHandler(() => {
  return { user: { email: 'email', password: 'password' } }
})
```
- make 
`~/app/frontend/server/api/auth/login.post.ts` look like this:
```
const validEmail = 'email'
const validPassword = 'password'
const tokenStr = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJtaWNoYWVsdyIsImVtYWlsIjoibWljaGFlbC53aWxsaWFtc0B4LmR1bW15anNvbi5jb20iLCJmaXJzdE5hbWUiOiJNaWNoYWVsIiwibGFzdE5hbWUiOiJXaWxsaWFtcyIsImdlbmRlciI6Im1hbGUiLCJpbWFnZSI6Imh0dHBzOi8vZHVtbXlqc29uLmNvbS9pY29uL21pY2hhZWx3LzEyOCIsImlhdCI6MTcxNzYxMTc0MCwiZXhwIjoxNzE3NjE1MzQwfQ.eQnhQSnS4o0sXZWARh2HsWrEr6XfDT4ngh0ejiykfH8'

export default eventHandler(async (event) => {
  const creds = await readBody(event)
  const { email, password } = creds
  if (email === validEmail && password === validPassword) {
    return { token: tokenStr }
  }
})
```

### Login Form
- change `~/app/frontend/pages/index.vue` to look like this:
```
<script setup>
const { signIn, status } = useAuth()
definePageMeta({ auth: false })
const email = ref('email')
const password = ref('password')

async function login() {
  await signIn({ email: email.value, password: password.value }, { redirect: false })
}
</script>

<template>
  <h2>Home</h2>
  <p>Most bee jobs are small ones. But bees know that every small job, if it's done well means a lot. But choose carefully because you'll stay in the job you pick for the rest of your life.</p>
  <h3>Login</h3>
  <section v-if="status === 'unauthenticated'">
    <form>
      <input v-model="email">
      <input v-model="password">
      <button type="submit" @click.prevent="login">Login</button>
    </form>
  </section>
</template>
```

### Logout Button
- make `~/app/frontend/components/Header.vue` look like this:
```
<script setup>
const { data, signOut, status } = useAuth()

async function logout() {
  await signOut({ callbackUrl: '/' })
}
</script>

<template>
  <header>
    <hgroup>
      <h1>
        <Icon name="fa-solid:lock" mode="svg" size="0.8em" />
        Auth Test App
      </h1>
      <p>A really cool app.</p>
    </hgroup>
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/public">
            Public
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/private">
            Private
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <section v-if="status === 'authenticated'">
      <button @click.prevent="logout">Logout</button>
    </section>
    <section>
      <p>Data: {{ data }}</p>
      <p>Status: {{ status }}</p>
    </section>
  </header>
</template>

<style scoped>
h1 {
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.2em;
  }
}
</style>
```

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
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  modules: ['@nuxt/icon', '@sidebase/nuxt-auth'],
  auth: {
    computed: { "pathname": "http://localhost:3000/api/auth/" },
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
- `npm run dev` -> Login/logout work & private page redirects to homepage when logged out
- `^ + c`

### Prep Frontend For Backend
- `cd ~/app/frontend`
- `rm -rf server`
- to `~/app/frontend/nuxt.config.ts` add this after `modules` and before `auth`:
```
devServer: { port: 3001 },
```
- `npm run dev` -> http://localhost:3001 works (login/logout will not work right now)
- `^ + c`
- `npm run test` -> all 14 tests should pass
- `npm run lint`

## Build Out Backend

### Users
- `cd ~/app/backend`
- `rails db:create` (or `rails db:drop db:create` if you already have a database called `backend`)
- `touch app/models/user.rb`
- make `~/app/backend/app/models/user.rb` look like this:
```
class User < ApplicationRecord
  
end
```
- `touch app/controllers/users_controller.rb`
- make `~/app/backend/app/controllers/users_controller.rb` look like this:
```
class UsersController < ApplicationController
  before_action :set_user, only: %i[ show update destroy ]

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:email, :password)
    end
end
```
- `rails generate migration CreateUsers email password`
- in `~/app/backend/db/migrate/<datetime stamp>_create_users.rb` change the `email` and `password` lines to:
```
t.string :email, null: false, index: { unique: true }
t.string :password, null: false
```
- `rails db:migrate`

### Tokens
- (this and the next section are hand-rolled auth, for learning. the hand-rolled auth is replaced by devise afterwards)
- `cd ~/app/backend`
- `rails db:encryption:init`
- ^ that should output something like:
```
active_record_encryption:
  primary_key: one_primary_key
  deterministic_key: one_deterministic_key
  key_derivation_salt: one_key_derivation_salt
```
- copy all that output (not the block above) and then run `EDITOR="code --wait" rails credentials:edit`
- then paste what you copied at the end of the credentials file and save and then close the file
- make `~/app/backend/app/models/user.rb` look like this:
```
class User < ApplicationRecord
  has_one :token, dependent: :destroy
  after_create :add_user_token

  private

  def add_user_token
    self.token = Token.create({user_id: self.id, active: true})
  end
end
```
- `touch app/models/token.rb`
- make `~/app/backend/app/models/token.rb` look like this:
```
class Token < ApplicationRecord
  belongs_to :user
  validates :token_str, presence: true, uniqueness: true
  encrypts :token, deterministic: true
  before_validation :generate_token, on: :create
  
  private

  def generate_token
    self.token_str = Digest::MD5.hexdigest(SecureRandom.hex)
  end

end
```
- `rails generate migration CreateToken token_str:index active:boolean user:references`
- `rails db:migrate`
- `rails console`
  - in the console run `User.create(email:"email",password:"password")`
  - type `exit` to exit the console

### Auth Controller/Routes
- (this and the previous section are hand-rolled auth, for learning. the hand-rolled auth is replaced by devise afterwards)
- `cd ~/app/backend`
- `mkdir -p app/controllers/api/auth`
- `touch app/controllers/api/auth/auth_controller.rb`
- make `~/app/backend/app/controllers/api/auth/auth_controller.rb` look like this:
```
class Api::Auth::AuthController < ActionController::API

  def login
    @no_auth_errors = true
    creds = creds_from_params
    if @no_auth_errors then user = user_from_creds(creds) end
    if @no_auth_errors then token = token_from_user(user) end
    if @no_auth_errors
      token.active = true
      render json: { token: token.token_str }
    end
  end

  def logout
  end

  def session
    @no_auth_errors = true
    token = token_from_headers
    if @no_auth_errors then user = user_from_token(token) end
    if @no_auth_errors 
      render json: { user: user }
    end
  end

  private

  def creds_from_params
    unless params.has_key?(:email) && params.has_key?(:password)
      handle_auth_error "Missing email and/or password", 401
    end
    creds = {}
    creds['email'] = params[:email]
    creds['password'] = params[:password]
    creds
  end

  def user_from_creds creds
    user = User.find_by(email: creds['email'], password: creds['password'])
    if !user.present?
      handle_auth_error "Wrong email and/or password", 401
    end
    user
  end

  def token_from_user user
    token = Token.find_by(user: user)
    if !token.present?
      handle_auth_error "User token not found", 404
    end
    token
  end

  def token_from_headers
    if 
      request.headers['Authorization'].present? && 
      request.headers['Authorization'].split(' ').present? && 
      request.headers['Authorization'].split(' ').last.present?
      token = request.headers['Authorization'].split(' ').last
    else
      handle_auth_error "User token not found", 404
    end
    token
  end

  def token_obj_from_token_str token_str
    tokenObj = Token.find_by(token_str: token_str)
    if !tokenObj.present?
      handle_auth_error "User token not found", 404
    end
    tokenObj
  end

  def user_from_token token_str
    token_obj = token_obj_from_token_str token_str
    if token_obj.present?
      user = User.find_by(token: token_obj)
    end
    user
  end

  def handle_auth_error message, status
    @no_auth_errors = false
    render json: { error: message }, status: status
  end

end
```
- make `config/routes.rb` look like this:
```
Rails.application.routes.draw do
  resources :users
  namespace :api do
    namespace :auth do
      post "login", to: "auth#login"
      post "logout", to: "auth#logout"
      get "session", to: "auth#session"
    end
  end
end
```
- `cd ~/app`
- `rspec` -> all backend specs should pass
- in a split terminal:
  - run backend
    - `cd backend`
    - `rails server`
  - run frontend
    - `cd frontend`
    - `npm run dev`
  - now clicking login and then logout should work (first login may take ~5 seconds)
  - private page should only show when logged in

## Sources
- Nuxt https://nuxt.com (visited 7/4/24)
- Antfu ESLint Config https://github.com/antfu/eslint-config (visited 7/4/24)
- Picocss https://picocss.com (visited 7/4/24)
- Picocss Examples https://picocss.com/examples (visited 7/4/24)
- Picocss Classless Example https://x4qtf8.csb.app (visited 7/4/24)
