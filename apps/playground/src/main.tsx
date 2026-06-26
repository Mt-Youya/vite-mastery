import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { PlaygroundApp } from "./playground-app"
import "./styles.css"

const root = document.getElementById("root")

if (!root) {
  throw new Error("缺少 #root 挂载节点")
}

createRoot(root).render(
  <StrictMode>
    <PlaygroundApp />
  </StrictMode>
)
