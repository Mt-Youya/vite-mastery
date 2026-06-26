import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

/**
 * 库模式构建。开发期 apps/web 直接 source-import 这里的 src,
 * 真要发版才走这套打包。
 */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        shiki: resolve(import.meta.dirname, "src/shiki.ts"),
        "use-mdx-components": resolve(import.meta.dirname, "src/use-mdx-components.tsx"),
      },
      formats: ["es"],
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^@mdx-js\//,
        /^@vite-mastery\//,
        /^shiki/,
        /^@shikijs\//,
        /^lucide-react/,
      ],
    },
  },
})
