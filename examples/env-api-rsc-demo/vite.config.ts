import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

/**
 * Environment API 多环境构建配置骨架。
 *
 * ⚠️ 此配置使用 RC 阶段 API,字段名称可能变化。
 * 基于 Vite 8.1.x。
 *
 * TODO: 步骤 1 — 添加 client + ssr 环境配置
 * TODO: 步骤 2 — 添加自定义 rsc 环境
 */
export default defineConfig({
  plugins: [react()],

  // 环境配置(Vite 8 Environment API)
  environments: {
    client: {
      // 浏览器环境,默认配置
    },
    ssr: {
      // Node.js SSR 环境
      resolve: {
        conditions: ["node", "import"],
      },
    },
    // TODO: 步骤 2 — rsc 环境
    // rsc: { ... }
  },
})
