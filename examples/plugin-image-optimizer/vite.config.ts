import { defineConfig } from "vite"
import { imageOptimizer } from "./src/plugin"

export default defineConfig({
  plugins: [
    imageOptimizer({
      webp: { quality: 80 },
      avif: { quality: 65 },
    }),
  ],
})
