#!/usr/bin/env node
/**
 * pnpm new:example
 *
 * 在 examples/ 下生成实战项目脚手架。
 * 运行方式:node --experimental-strip-types scripts/new-example.ts
 */

import * as readline from "node:readline"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const EXAMPLES_DIR = path.join(ROOT, "examples")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, (ans) => resolve(ans.trim())))
}
function askWithDefault(question: string, def: string): Promise<string> {
  return new Promise((resolve) => rl.question(`${question} [${def}]: `, (ans) => resolve(ans.trim() || def)))
}

function writeFile(filePath: string, content: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, "utf-8")
}

async function main() {
  console.log("\n🛠  vite-mastery · 新建实战项目\n")

  const name = await ask("项目目录名(kebab-case,如 plugin-my-loader): ")
  if (!name || !/^[a-z0-9-]+$/.test(name)) {
    console.error("❌ 名称只能包含小写字母、数字和连字符")
    process.exit(1)
  }

  const title = await ask("项目标题(中文,如 自定义 Loader 插件): ")
  const chapter = await askWithDefault("关联章节编号(如 4.8)", "")
  const viteVersion = await askWithDefault("Vite 版本", "8.1.0")
  const isEnvApi = name.includes("env-api")
  const today = new Date().toISOString().slice(0, 10)

  const projectDir = path.join(EXAMPLES_DIR, name)
  if (fs.existsSync(projectDir)) {
    console.error(`❌ 目录已存在: examples/${name}`)
    process.exit(1)
  }

  // README.md
  const envApiWarning = isEnvApi
    ? `\n> ⚠️ **注意**:本项目使用 Environment API(Vite RC 阶段功能),API 可能在未来 minor 版本中变化。\n`
    : ""

  const readme = `# ${title}
${envApiWarning}
> 关联章节:${chapter || "待定"}

## 学习目标

TODO:写清楚学完这个项目能做什么(1~3 条)。

## 前置知识

- TODO

## 步骤拆解

| 步骤 | 目录 | 说明 |
|---|---|---|
| 1 | steps/01-* | TODO |
| 2 | steps/02-* | TODO |

## 快速开始

\`\`\`bash
cd examples/${name}
pnpm install
pnpm dev
\`\`\`

## 最终产出

TODO:说清楚 final/ 里是什么,运行后能看到什么。

---

更新日期:${today}
`

  // package.json
  const pkgJson = {
    name,
    version: "0.0.1",
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: {
      vite: viteVersion,
    },
  }

  // vite.config.ts
  const viteConfig = `import { defineConfig } from "vite"

export default defineConfig({
  // TODO:按项目需要填写配置
})
`

  // src/main.ts
  const mainTs = `// ${title} · 起点文件
// 根据教程步骤逐步填充

console.log("Hello from ${name}")
`

  // index.html
  const indexHtml = `<!doctype html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`

  writeFile(path.join(projectDir, "README.md"), readme)
  writeFile(path.join(projectDir, "package.json"), JSON.stringify(pkgJson, null, 2))
  writeFile(path.join(projectDir, "vite.config.ts"), viteConfig)
  writeFile(path.join(projectDir, "index.html"), indexHtml)
  writeFile(path.join(projectDir, "src/main.ts"), mainTs)
  // 空目录
  writeFile(path.join(projectDir, "steps/.gitkeep"), "")
  writeFile(path.join(projectDir, "final/.gitkeep"), "")
  if (isEnvApi) {
    writeFile(
      path.join(projectDir, "compatibility-matrix.md"),
      `# Env API · 兼容性说明\n\n> 基于 Vite ${viteVersion}\n\nTODO:记录 Environment API RC 阶段的已知行为差异。\n`
    )
  }

  console.log(`\n✅ 已生成: examples/${name}/`)
  console.log("   文件清单:")
  console.log("     README.md · package.json · vite.config.ts · index.html")
  console.log("     src/main.ts · steps/ · final/")
  if (isEnvApi) console.log("     compatibility-matrix.md (Env API 项目专属)")
  console.log(`\n   下一步: cd examples/${name} && pnpm install && pnpm dev\n`)
  rl.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
