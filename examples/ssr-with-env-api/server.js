/**
 * SSR 开发服务器入口。
 *
 * TODO: 步骤 1 — 实现 Vite dev server 中间件集成
 * TODO: 步骤 2 — 使用 Environment API 创建 ssr 环境
 * TODO: 步骤 3 — 用 ModuleRunner 执行服务端渲染
 */
import { createServer } from "node:http"
import { createServer as createViteServer } from "vite"

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: "custom",
})

const server = createServer(async (req, res) => {
  try {
    // TODO: 用 vite.environments.ssr 获取 SSR 环境
    const html = `
<!doctype html>
<html lang="zh">
  <head><meta charset="UTF-8" /><title>SSR Demo</title></head>
  <body>
    <div id="root"><!-- TODO: SSR 渲染内容 --></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
    `.trim()

    res.setHeader("Content-Type", "text/html")
    res.end(await vite.transformIndexHtml(req.url ?? "/", html))
  } catch (e) {
    vite.ssrFixStacktrace(e)
    res.statusCode = 500
    res.end(String(e))
  }
})

server.listen(3000, () => {
  console.log("SSR dev server: http://localhost:3000")
})
