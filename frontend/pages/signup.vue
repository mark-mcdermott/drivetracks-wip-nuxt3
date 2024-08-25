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