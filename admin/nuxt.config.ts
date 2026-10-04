import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  $development: {
    devtools: { enabled: true },
    devServer: {
      port: 5173
    },
    image: {
      format: ['avif', 'webp', 'png'],
      quality: 95,
      provider: "ipx",
      ipx: {
        maxAge: 60 * 60, // 1 minuto
      },
    },
  },

  $production: {
    devtools: { enabled: false },
    image: {
      format: ['avif', 'webp', 'png'],
      quality: 95,
      provider: "ipx",
      ipx: {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      },
    },
  },

  css: ["~/assets/css/main.css"],
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

  modules: [
    "@nuxt/fonts",
    "@nuxt/image",
    "@vueuse/nuxt",
  ],

  fonts: {
    families: [
      {
        name: "Noto Sans",
        provider: "google"
      },
      {
        name: "Monoton",
        provider: "google"
      }
    ]
  }
});