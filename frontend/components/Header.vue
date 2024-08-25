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
                <UiButton v-if="status === 'authenticated'" to="/private" variant="ghost" size="sm">
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