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