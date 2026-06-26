#!/usr/bin/env node
/**
 * pnpm new:v7note
 *
 * 快速生成 <V7Note> MDX 片段,粘贴进正文即用。
 * 运行方式:node --experimental-strip-types scripts/new-v7note.ts
 */

import * as readline from "node:readline"

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, (ans) => resolve(ans.trim())))
}

async function main() {
  console.log("\n🟡  vite-mastery · 生成 <V7Note> 片段\n")

  const title = await ask("折叠标题(如「Vite 7 行为差异」,直接回车用默认): ")
  const v8Behavior = await ask("Vite 8 的行为(一句话描述): ")
  const v7Behavior = await ask("Vite 7 的行为(一句话描述): ")
  const migration = await ask("迁移路径(如何从 V7 迁移到 V8): ")

  const titleAttr = title ? ` title="${title}"` : ""

  const snippet = `
<V7Note${titleAttr}>
  在 Vite 7 中,${v7Behavior}

  而 Vite 8 改为:${v8Behavior}

  **迁移路径**:${migration}
</V7Note>
`

  console.log("\n── 生成的 MDX 片段(复制粘贴即用)──────────────────────")
  console.log(snippet)
  console.log("────────────────────────────────────────────────────────\n")
  rl.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
