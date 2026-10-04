<script setup lang="ts">
import { Sun, Moon } from "@lucide/vue"

declare module 'nuxt/app' {
  interface NuxtLayouts {
    'custom': unknown
  }
}

definePageMeta({
  layout: false,
})

const preferedColorSchema = useColorMode({
  attribute: 'theme',
})

const { system, store } = useColorMode()
const myColorMode = computed(() => store.value === 'auto' ? system.value : store.value)
const toggleColorMode = () => myColorMode.value ==='light' ? store.value = 'dark' :  store.value = 'light'
</script>

<template>
  <div class="flex min-h-dvh w-full">
    <section class="basis-2/3 flex overflow-hidden">
      <LazyNuxtImg src="/images/pages/login/default_background.png" width="1920" height="1080" fit="cover"
        class="w-full h-full object-left object-cover max-w-none">

      </LazyNuxtImg>
    </section>
    <main class="basis-1/3 flex flex-col justify-center p-8 bg-gray-50 dark:bg-gray-900 relative">
      <UiLoginForm></UiLoginForm>
      <div class="absolute bottom-2 right-2">
          <UiButton @click="toggleColorMode" class="cursor-pointer">
            <Sun v-if="myColorMode === 'dark'" />
            <Moon v-else/>
          </UiButton>
      </div>
    </main>
  </div>
</template>