import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import * as path from "node:path"
import { defineConfig } from "vitest/config"
import packageJson from "./package.json" with { type: "json" }

const projectRootDir = path.resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-styled-components"],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon-96x96.png", "apple-touch-icon.png"],
      manifest: {
        name: "MemeMakr",
        short_name: "MemeMakr",
        description: "Makes Memes",
        theme_color: "#1f1f1f",
        icons: [
          {
            src: "web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],

  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },

  resolve: {
    alias: {
      src: path.resolve(projectRootDir, "./src"),
    },
  },

  test: {
    root: import.meta.dirname,
    name: packageJson.name,
    environment: "jsdom",

    typecheck: {
      enabled: true,
      tsconfig: path.join(import.meta.dirname, "tsconfig.json"),
    },

    globals: true,
    watch: false,
    setupFiles: ["./src/setupTests.ts"],
  },
})
