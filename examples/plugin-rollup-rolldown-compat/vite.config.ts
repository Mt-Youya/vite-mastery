import { defineConfig } from "vite"
import { bundleAnalyzer } from "./src/plugin"

export default defineConfig({
  plugins: [
    bundleAnalyzer({
      sizeThreshold: 50 * 1024, // 50KB
    }),
  ],
  build: {
    rollupOptions: {
      input: "index.html",
    },
  },
})
