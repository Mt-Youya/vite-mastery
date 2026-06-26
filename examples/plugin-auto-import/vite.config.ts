import { defineConfig } from "vite"
import { autoImport } from "./src/plugin"

export default defineConfig({
  plugins: [
    autoImport({
      imports: {
        // preset: 模块路径 → 导出的 API 列表
        vue: ["ref", "computed", "reactive", "watch", "onMounted", "nextTick"],
        "vue-router": ["useRouter", "useRoute"],
      },
      dts: "auto-imports.d.ts",
    }),
  ],
})
