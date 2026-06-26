import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

/**
 * Client 环境入口。
 *
 * 步骤 3 完成后,这里将通过 ModuleRunner 获取 RSC 组件。
 */
function App() {
  return (
    <div>
      <h1>Environment API · RSC 多环境演示</h1>
      <p>Client 环境运行中。打开 vite.config.ts 开始配置多环境。</p>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
