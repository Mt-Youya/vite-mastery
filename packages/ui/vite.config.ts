import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * 库模式构建。日常开发 apps/web 直接通过 `transpilePackages` 消费 src,
 * 发版到 npm 时再走这套打包。
 */
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^@base-ui\//,
        /^lucide-react/,
        "clsx",
        "tailwind-merge",
        "class-variance-authority",
      ],
    },
  },
});
