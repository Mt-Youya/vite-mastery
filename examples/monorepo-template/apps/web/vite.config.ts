import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 开发模式直接指向 packages/ 的 src/,跳过编译步骤
      "@monorepo/ui": resolve("../../packages/ui/src"),
      "@monorepo/utils": resolve("../../packages/utils/src"),
    },
  },
})
