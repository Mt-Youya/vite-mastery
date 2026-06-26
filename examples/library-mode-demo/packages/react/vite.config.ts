import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve("src/index.tsx"),
      name: "UIKitReact",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // 不打包进产物的外部依赖
      external: ["react", "react/jsx-runtime", "@ui-kit/core"],
      output: {
        globals: {
          react: "React",
          "@ui-kit/core": "UIKitCore",
        },
      },
    },
  },
})
