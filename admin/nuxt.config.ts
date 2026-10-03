// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  css: ["~/assets/css/main.css"],

  $development: {
    devtools: { enabled: true },
    image: {
      
    }
  },

  $production: {
    devtools: { enabled: false },
    image: {
      
    }
  },

  vite: {
    plugins: [tailwindcss()],
  },

  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
          visibility: false,
        },
      },
    },
    sharedPrerenderData: true,
  },

  modules: ["@nuxt/fonts", "@nuxt/image", "shadcn-nuxt"],
});