<script setup lang="ts">
declare module 'nuxt/app' {
  interface NuxtLayouts {
    'custom': unknown
  }
}

definePageMeta({
  layout: false,
})
</script>

<template>
    <div></div>
</template>