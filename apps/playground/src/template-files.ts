import type { FileSystemTree } from "@webcontainer/api"

export interface PlaygroundFile {
  path: string
  label: string
  language: string
  description: string
  contents: string
}

export const initialFiles: PlaygroundFile[] = [
  {
    path: "package.json",
    label: "package.json",
    language: "json",
    description: "WebContainer 内部示例项目的依赖与脚本。",
    contents: `{
  "name": "vite-mastery-webcontainer-demo",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc --noEmit && vite build"
  },
  "dependencies": {
    "vite": "^8.1.0",
    "typescript": "^6.0.3"
  },
  "devDependencies": {}
}
`,
  },
  {
    path: "index.html",
    label: "index.html",
    language: "html",
    description: "Vite 入口 HTML。",
    contents: `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebContainer Vite 插件实验</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
  },
  {
    path: "vite.config.ts",
    label: "vite.config.ts",
    language: "ts",
    description: "加载自定义虚拟模块插件。",
    contents: `import { defineConfig } from "vite"
import { siteMetaPlugin } from "./src/plugin"

const webContainerHeaders = {
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "cross-origin",
}

export default defineConfig({
  plugins: [siteMetaPlugin()],
  server: {
    headers: webContainerHeaders,
  },
  preview: {
    headers: webContainerHeaders,
  },
})
`,
  },
  {
    path: "src/plugin.ts",
    label: "src/plugin.ts",
    language: "ts",
    description: "一个最小可跑的 Vite 8 虚拟模块插件。",
    contents: String.raw`import type { Plugin } from "vite"

const virtualId = "virtual:site-meta"
const resolvedVirtualId = "\0" + virtualId

export function siteMetaPlugin(): Plugin {
  return {
    name: "vite-mastery-site-meta",
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId
      return null
    },
    load(id) {
      if (id !== resolvedVirtualId) return null

      const meta = {
        title: "Vite 8 WebContainer 实验",
        generatedAt: new Date().toLocaleTimeString("zh-CN"),
        runtime: "WebContainer",
        hook: "resolveId + load",
      }

      return "export const siteMeta = " + JSON.stringify(meta, null, 2)
    },
  }
}
`,
  },
  {
    path: "src/main.ts",
    label: "src/main.ts",
    language: "ts",
    description: "消费虚拟模块并展示插件输出。",
    contents: `import { siteMeta } from "virtual:site-meta"
import "./style.css"

const app = document.querySelector<HTMLDivElement>("#app")

if (!app) {
  throw new Error("缺少 #app 挂载节点")
}

app.innerHTML = \`
  <main class="shell">
    <section class="panel">
      <p class="eyebrow">virtual:site-meta</p>
      <h1>\${siteMeta.title}</h1>
      <p>
        这份数据不是来自文件系统，而是 Vite 插件在 <code>load</code> hook
        里实时生成的虚拟模块。
      </p>
      <dl>
        <div>
          <dt>运行环境</dt>
          <dd>\${siteMeta.runtime}</dd>
        </div>
        <div>
          <dt>插件 hook</dt>
          <dd>\${siteMeta.hook}</dd>
        </div>
        <div>
          <dt>生成时间</dt>
          <dd>\${siteMeta.generatedAt}</dd>
        </div>
      </dl>
    </section>
  </main>
\`
`,
  },
  {
    path: "src/virtual.d.ts",
    label: "src/virtual.d.ts",
    language: "ts",
    description: "给虚拟模块补类型声明。",
    contents: `declare module "virtual:site-meta" {
  export const siteMeta: {
    title: string
    generatedAt: string
    runtime: string
    hook: string
  }
}
`,
  },
  {
    path: "src/style.css",
    label: "src/style.css",
    language: "css",
    description: "示例项目自己的样式。",
    contents: `:root {
  color-scheme: light;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #172033;
  background: #eef2f7;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

.shell {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 32px;
}

.panel {
  width: min(620px, 100%);
  border: 1px solid #ccd6e6;
  border-radius: 8px;
  background: #ffffff;
  padding: 28px;
  box-shadow: 0 12px 32px rgb(23 32 51 / 0.08);
}

.eyebrow {
  margin: 0 0 10px;
  color: #c65a00;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: clamp(32px, 6vw, 56px);
  line-height: 1;
}

p {
  max-width: 58ch;
  color: #526075;
  line-height: 1.7;
}

code {
  border: 1px solid #f3c06c;
  border-radius: 4px;
  background: #fff6e8;
  padding: 2px 5px;
  color: #7a3a00;
}

dl {
  display: grid;
  gap: 12px;
  margin: 24px 0 0;
}

dl > div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid #e3e9f2;
  padding-top: 12px;
}

dt {
  color: #6a768a;
}

dd {
  margin: 0;
  font-weight: 700;
}
`,
  },
]

export function createFileSystemTree(files: PlaygroundFile[]): FileSystemTree {
  const root: FileSystemTree = {}

  for (const file of files) {
    const segments = file.path.split("/")
    let cursor = root

    for (const [index, segment] of segments.entries()) {
      const isFile = index === segments.length - 1

      if (isFile) {
        cursor[segment] = {
          file: {
            contents: file.contents,
          },
        }
        continue
      }

      let node = cursor[segment]
      if (!node || !("directory" in node)) {
        node = {
          directory: {},
        }
        cursor[segment] = node
      }

      cursor = node.directory
    }
  }

  return root
}
