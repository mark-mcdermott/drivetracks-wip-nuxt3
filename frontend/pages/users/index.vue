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