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