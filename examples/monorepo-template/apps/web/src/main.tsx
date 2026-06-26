import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Button } from "@monorepo/ui"
import { formatDate } from "@monorepo/utils"

function App() {
  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Monorepo 模板演示</h1>
      <p>构建时间:{formatDate(new Date())}</p>
      <Button variant="primary">来自 @monorepo/ui</Button>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
