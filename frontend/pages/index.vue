<template>
  <UiContainer class="relative flex flex-col items-center py-10 text-center lg:py-20">
    <h1 class="hero-h-1 mb-4 mt-7 text-4xl font-bold lg:mb-6 lg:mt-5 lg:text-center lg:text-5xl xl:text-6xl">
      There was a wall.<br>It did not look important.
    </h1>
    <p class="hero-text mx-auto max-w-[768px] tracking-tight text-lg text-muted-foreground lg:text-center lg:text-xl">
      It was built of uncut rocks roughly mortared. An adult could look right over it, and even a child could climb it. Where it crossed the roadway, instead of having a gate it degenerated into mere geometry, a line, an idea of boundary. But the idea was real.
    </p>
    <div class="hero-buttons mt-8 grid w-full grid-cols-1 items-center gap-3 sm:flex sm:justify-center lg:mt-10">
      <UiButton to="/login" size="lg" variant="outline">
        Log in
      </UiButton>
      <UiButton to="/signup" size="lg">
        Sign up
      </UiButton>
    </div>
  </UiContainer>
</template>