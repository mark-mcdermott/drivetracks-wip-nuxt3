<template>
  <UiButton v-bind="$attrs">
    <slot>{{ text }}</slot> 
  </UiButton>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: false,
  },
});

defineExpose({});
</script>