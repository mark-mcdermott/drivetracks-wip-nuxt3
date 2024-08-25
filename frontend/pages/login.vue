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