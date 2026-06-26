import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { App } from "./App"

// Hydration:接管服务端渲染的 HTML
hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <App />
  </StrictMode>
)
