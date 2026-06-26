import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const webContainerHeaders = {
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "cross-origin",
  "Origin-Agent-Cluster": "?1",
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "es2022",
  },
  server: {
    port: 5173,
    headers: webContainerHeaders,
  },
  preview: {
    port: 4173,
    headers: webContainerHeaders,
  },
})
