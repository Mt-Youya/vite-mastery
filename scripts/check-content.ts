#!/usr/bin/env node
/**
 * pnpm check:content
 *
 * 扫描 content/ 下所有 MDX,检查内容规范。
 * 有问题时打印清单并以非零退出码退出;无问题时静默成功。
 * 运行方式:node --experimental-strip-types scripts/check-content.ts
 */

import * as fs from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const CONTENT_DIR = path.join(ROOT, "content")

const REQUIRED_FRONTMATTER = ["title", "description", "order", "part", "chapter", "viteVersion", "apiStability"]
const VALID_STABILITY = ["stable", "rc", "experimental"]

interface Issue {
  file: string
  message: string
  severity: "error" | "warn"
}

const issues: Issue[] = []

function addIssue(file: string, message: string, severity: "error" | "warn" = "error") {
  issues.push({ file: file.replace(ROOT + "/", ""), message, severity })
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const fm: Record<string, string> = {}
  for (const line of (match[1] ?? "").split("\n")) {
    const colonIdx = line.indexOf(":")
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const val = line
      .slice(colonIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "")
    if (key) fm[key] = val
  }
  return fm
}

function collectMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  const result: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) result.push(...collectMdxFiles(full))
    else if (entry.name.endsWith(".mdx")) result.push(full)
  }
  return result
}

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8")

  // 1. frontmatter 完整性
  if (!content.startsWith("---")) {
    addIssue(filePath, "缺少 frontmatter")
    return
  }
  const fm = parseFrontmatter(content)
  for (const key of REQUIRED_FRONTMATTER) {
    if (!fm[key]) addIssue(filePath, `frontmatter 缺少字段: ${key}`)
  }

  // 2. viteVersion 格式
  if (fm.viteVersion && !/^\d+\.\d+/.test(fm.viteVersion)) {
    addIssue(filePath, `viteVersion 格式不对: "${fm.viteVersion}",应如 "8.1"`)
  }

  // 3. apiStability 合法值
  if (fm.apiStability && !VALID_STABILITY.includes(fm.apiStability)) {
    addIssue(filePath, `apiStability 值不合法: "${fm.apiStability}",只允许 ${VALID_STABILITY.join(" | ")}`)
  }

  // 4. code block 语言标记
  // 只检查开头 fence(``` 后跟换行),跳过结束 fence
  // 逐行扫描,区分开头 fence(检查有无语言)和结束 fence(忽略)
  const lines = content.split("\n")
  let inFence = false
  let hasUnlabeledFence = false
  for (const line of lines) {
    if (/^```/.test(line)) {
      if (!inFence) {
        // 开头 fence:``` 之后若只有空白则是无语言
        if (/^```\s*$/.test(line)) hasUnlabeledFence = true
        inFence = true
      } else {
        // 结束 fence
        inFence = false
      }
    }
  }
  if (hasUnlabeledFence) {
    addIssue(filePath, "存在缺少语言标识的代码块(``` 后无语言名)", "warn")
  }

  // 5. 正文不直接写"在 Vite 7 中..."——应该用 <V7Note>
  const v7InBody = content.replace(/^---[\s\S]*?---/, "").match(/在\s*Vite\s*7\s*(中|里|时)/)
  if (v7InBody) {
    addIssue(filePath, "正文中出现「在 Vite 7 中...」,应改用 <V7Note> 折叠组件", "warn")
  }

  // 6. Part 5 env-api 文章必须有 RC 警告
  if (fm.part === "05-environment-api" && fm.apiStability !== "rc") {
    addIssue(filePath, 'Part 5 文章 apiStability 应为 "rc"')
  }
  if (fm.part === "05-environment-api" && !content.includes("RC 阶段")) {
    addIssue(filePath, "Part 5 文章顶部应有 RC 警告 Callout", "warn")
  }

  // 7. 检查超过 2 个版本前的差异(不该覆盖 Vite 6 及更早)
  if (/在\s*Vite\s*[1-6]\s*(中|里|时)/.test(content)) {
    addIssue(filePath, "正文涉及 Vite 6 及更早版本差异,超过两个版本不再覆盖", "warn")
  }
}

// 主流程
const files = collectMdxFiles(CONTENT_DIR)
if (files.length === 0) {
  console.log("⚠  content/ 下没有 MDX 文件,跳过检查。")
  process.exit(0)
}

for (const file of files) {
  checkFile(file)
}

if (issues.length === 0) {
  // 静默成功
  process.exit(0)
}

const errors = issues.filter((i) => i.severity === "error")
const warns = issues.filter((i) => i.severity === "warn")

console.error(`\n❌ 内容检查发现问题 (${errors.length} error · ${warns.length} warn)\n`)

for (const issue of issues) {
  const prefix = issue.severity === "error" ? "  ✗ ERROR" : "  ⚠ WARN "
  console.error(`${prefix}  ${issue.file}`)
  console.error(`          ${issue.message}`)
}

console.error("")
if (errors.length > 0) process.exit(1)
// warn 不阻断流程
process.exit(0)
