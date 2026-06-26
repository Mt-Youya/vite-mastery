import { defineConfig } from "vite"
import { resolve } from "node:path"

export default defineConfig({
  build: {
    lib: {
      entry: resolve("src/index.ts"),
      name: "UIKitCore",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // core 包无外部依赖
    },
  },
})
