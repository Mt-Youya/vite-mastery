import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  environments: {
    client: {},
    ssr: {
      resolve: {
        conditions: ["node", "import"],
        noExternal: ["react", "react-dom"],
      },
    },
  },
})
