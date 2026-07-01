#!/usr/bin/env node
/**
 * pnpm new:doc
 *
 * 交互式 CLI,在 content/ 下生成 frontmatter 完备的 MDX 模板。
 * 运行方式:node --experimental-strip-types scripts/new-doc.ts
 */

import * as readline from "node:readline"
import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const CONTENT_DIR = path.join(ROOT, "content")

const PARTS = [
  { id: "00-getting-started", title: "入门铺垫" },
  { id: "01-core-concepts", title: "核心概念" },
  { id: "02-bundler-evolution", title: "Bundler 演进史" },
  { id: "03-plugin-system", title: "插件系统" },
  { id: "04-hooks-deep-dive", title: "Hooks 深度解析" },
  { id: "05-environment-api", title: "Environment API" },
  { id: "06-hmr", title: "HMR 热更新" },
  { id: "07-build-pipeline", title: "生产构建" },
  { id: "08-ssr-ssg", title: "SSR & SSG" },
  { id: "09-framework-integration", title: "框架集成" },
  { id: "10-library-mode", title: "库模式" },
  { id: "11-monorepo", title: "Monorepo 工程化" },
  { id: "12-performance", title: "性能优化" },
  { id: "13-real-world-plugins", title: "真实世界插件赏析" },
  { id: "appendix", title: "附录" },
] as const

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, (ans) => resolve(ans.trim())))
}

function askWithDefault(question: string, defaultVal: string): Promise<string> {
  return new Promise((resolve) =>
    rl.question(`${question} [${defaultVal}]: `, (ans) => resolve(ans.trim() || defaultVal))
  )
}

async function main() {
  console.log("\n🗒  vite-mastery · 新建文档\n")

  // 选择章节
  console.log("可用章节:")
  PARTS.forEach((p, i) => console.log(`  ${String(i).padStart(2, " ")}. ${p.id}  ${p.title}`))
  const partIdx = parseInt(await ask("\n输入章节序号: "), 10)
  if (isNaN(partIdx) || partIdx < 0 || partIdx >= PARTS.length) {
    console.error("❌ 无效序号")
    process.exit(1)
  }
  const part = PARTS[partIdx]

  // 文章信息
  const title = await ask("文章标题(中文): ")
  if (!title) {
    console.error("❌ 标题不能为空")
    process.exit(1)
  }

  const description = await ask("一句话描述(frontmatter description): ")
  const chapterStr = await ask("章节编号(如 3.2): ")
  const orderStr = await askWithDefault("排序号(order, 整数)", "99")
  const difficulty = await askWithDefault("难度 1-4", "2")
  const readingTime = await askWithDefault("预计阅读时间(分钟)", "10")
  const viteVersion = await askWithDefault("viteVersion", "8.1")
  const apiStabilityRaw = await askWithDefault("apiStability [stable/rc/experimental]", "stable")
  const apiStability = ["stable", "rc", "experimental"].includes(apiStabilityRaw) ? apiStabilityRaw : "stable"

  const today = new Date().toISOString().slice(0, 10)

  // 文件名:取标题拼音首字母或数字序号
  const fileSlug = chapterStr
    ? `${chapterStr.replace(".", "-")}-${title.replace(/[^a-zA-Z0-9一-龥]/g, "-").slice(0, 30)}`
    : title.replace(/[^a-zA-Z0-9一-龥]/g, "-").slice(0, 40)

  // 是否是 Part 5 env-api
  const isEnvApi = part.id === "05-environment-api"
  const isRc = apiStability === "rc"

  // 生成内容
  const rcCallout =
    isEnvApi || isRc
      ? `
<Callout type="warning">
  Environment API 当前处于 RC 阶段,具体 API 名称可能在未来 minor 中变化。本文基于 Vite ${viteVersion}。
</Callout>
`
      : ""

  const content = `---
title: ${title}
description: ${description || title}
order: ${orderStr}
part: ${part.id}
chapter: "${chapterStr}"
difficulty: ${difficulty}
readingTime: ${readingTime}
updatedAt: "${today}"
viteVersion: "${viteVersion}"
apiStability: "${apiStability}"
---
${rcCallout}
<Callout type="note" title="你将学到什么">
  - TODO
  - TODO
  - TODO
</Callout>

<Callout type="tip" title="前置知识">
  - TODO
</Callout>

## TODO 小节 1

TODO 正文内容。

## TODO 小节 2

TODO 正文内容。

## 自测题

1. TODO 概念题?
2. TODO 概念题?
3. TODO 概念题?

\`\`\`ts filename="TODO.ts"
// TODO 编码题
\`\`\`
`

  const partDir = path.join(CONTENT_DIR, part.id)
  if (!fs.existsSync(partDir)) fs.mkdirSync(partDir, { recursive: true })

  /** 查找当前最大 order 确定文件前缀,只看 `.zh.mdx`(EN 与 ZH 同 prefix)。 */
  const existing = fs.existsSync(partDir) ? fs.readdirSync(partDir).filter((f) => f.endsWith(".zh.mdx")) : []
  const maxNum = existing.reduce((max, f) => {
    const n = parseInt(f.split("-")[0] ?? "0", 10)
    return isNaN(n) ? max : Math.max(max, n)
  }, 0)
  const prefix = String(maxNum + 1).padStart(2, "0")
  const baseName = `${prefix}-${fileSlug}`

  /** 同步生成 zh + en 两份。EN 占位:正文区域填 TODO + 复用 frontmatter。 */
  const zhPath = path.join(partDir, `${baseName}.zh.mdx`)
  const enPath = path.join(partDir, `${baseName}.en.mdx`)

  for (const [p, label] of [
    [zhPath, "ZH"],
    [enPath, "EN"],
  ] as const) {
    if (fs.existsSync(p)) {
      console.error(`❌ 文件已存在(${label}): ${p}`)
      process.exit(1)
    }
  }

  const enContent = content.replace(
    /^---[\s\S]*?---/,
    (front) =>
      front + "\n\n<!-- TODO: translate to English. Until translated, the ZH version will be served as fallback. -->\n"
  )

  fs.writeFileSync(zhPath, content, "utf-8")
  fs.writeFileSync(enPath, enContent, "utf-8")
  console.log(`\n✅ 已生成:`)
  console.log(`   content/${part.id}/${baseName}.zh.mdx`)
  console.log(`   content/${part.id}/${baseName}.en.mdx (TODO 占位)`)
  console.log(`   字数模板约 200 字,记得填充实际内容后跑 pnpm check:content\n`)
  rl.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
