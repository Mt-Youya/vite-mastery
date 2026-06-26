import { defineConfig } from "vite"
import { virtualSiteMeta } from "./src/plugin"

export default defineConfig({
  plugins: [virtualSiteMeta()],
})
