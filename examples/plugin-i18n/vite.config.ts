import { defineConfig } from "vite"
import { i18nPlugin } from "./src/plugin"

export default defineConfig({
  plugins: [
    i18nPlugin({
      locale: "zh",
      localeDir: "./locales",
    }),
  ],
})
