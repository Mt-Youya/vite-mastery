import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { mdLoader } from "./src/plugin"

export default defineConfig({
  plugins: [react(), mdLoader()],
})
