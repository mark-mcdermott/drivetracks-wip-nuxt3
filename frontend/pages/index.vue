<script setup>
const healthStatus = await $fetch(`${useRuntimeConfig().public.apiBase}/up`)
</script>

<template>
  <UiContainer class="relative flex flex-col items-center py-10 text-center lg:py-20">
    <h1 data-testid="hero-h1" class="hero-h1 mb-4 mt-7 text-4xl font-bold lg:mb-6 lg:mt-5 lg:text-center lg:text-5xl xl:text-6xl">
      There was a wall.<br>It did not look important.
    </h1>
    <p data-testid="hero-p" class="hero-text mx-auto max-w-[768px] tracking-tight text-lg text-muted-foreground lg:text-center lg:text-xl">
      {{ JSON.stringify(healthStatus) }}
    </p>
    <div class="hero-buttons mt-8 grid w-full grid-cols-1 items-center gap-3 sm:flex sm:justify-center lg:mt-10">
      <UiThingDataButtonWrapper data-testid="hero-link-login" to="/login" size="lg" variant="outline">
        Log in
      </UiThingDataButtonWrapper>
      <UiThingDataButtonWrapper data-testid="hero-link-login" to="/signup" size="lg">
        Sign up
      </UiThingDataButtonWrapper>
    </div>
  </UiContainer>
</template>