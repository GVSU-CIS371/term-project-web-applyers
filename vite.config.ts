import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/", // Ensure the base URL is set to the root
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // <- use modern Dart Sass API
      },
    },
  },
});
