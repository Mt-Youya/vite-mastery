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

function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---\s*/, "")
}

function stripV7NoteBlocks(content: string): string {
  return content.replace(/<V7Note\b[\s\S]*?<\/V7Note>/g, "")
}

function stripCodeBlocks(content: string): string {
  return content.replace(/```[\s\S]*?```/g, "")
}

function visibleLength(content: string): number {
  return content.replace(/\s/g, "").length
}

function docsTargetExists(href: string): boolean {
  if (href === "/docs") return true
  const cleanHref = href.split("#")[0]?.split("?")[0] ?? href
  const slug = cleanHref.replace(/^\/docs\/?/, "")
  if (!slug) return true
  if (fs.existsSync(path.join(CONTENT_DIR, slug))) return true
  return fs.existsSync(path.join(CONTENT_DIR, `${slug}.zh.mdx`)) || fs.existsSync(path.join(CONTENT_DIR, `${slug}.en.mdx`))
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
    if (line.startsWith("```")) {
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
  const body = stripFrontmatter(content)
  const bodyWithoutV7Notes = stripV7NoteBlocks(body)
  const v7InBody = bodyWithoutV7Notes.match(/在\s*Vite\s*7\s*(中|里|时)/)
  if (v7InBody) {
    addIssue(filePath, "正文中出现「在 Vite 7 中...」,应改用 <V7Note> 折叠组件", "warn")
  }

  // 6. Part 5 env-api 文章必须有 RC 警告
  if (fm.part === "05-environment-api" && fm.apiStability !== "rc") {
    addIssue(filePath, 'Part 5 文章 apiStability 应为 "rc"')
  }
  if (
    fm.part === "05-environment-api" &&
    !content.includes("RC 阶段") &&
    !content.includes("RC stage") &&
    !content.includes("RC Stage")
  ) {
    addIssue(filePath, "Part 5 文章顶部应有 RC 警告 Callout", "warn")
  }

  // 7. 检查超过 2 个版本前的差异(不该覆盖 Vite 6 及更早)
  if (fm.part !== "02-bundler-evolution" && /在\s*Vite\s*[1-6]\s*(中|里|时)/.test(bodyWithoutV7Notes)) {
    addIssue(filePath, "正文涉及 Vite 6 及更早版本差异,超过两个版本不再覆盖", "warn")
  }

  // 8. 内容体量底线:防止教程只有提纲或一笔带过
  if (visibleLength(body) < 2400) {
    addIssue(filePath, "正文内容过短:应补充背景、决策规则、验证方法或常见坑", "warn")
  }

  // 9. 结构底线:长教程至少应该有若干二级小节,便于阅读和跳读
  const headingCount = (body.match(/^##\s+\S/gm) ?? []).length
  if (headingCount < 3) {
    addIssue(filePath, "正文结构过薄:至少需要 3 个二级标题拆分内容", "warn")
  }

  // 10. 源码导读不能只给简化实现,还应覆盖源码阅读、调用流程和边界/坑点
  if (fm.part === "13-real-world-plugins" && /源码导读|Source Walkthrough/i.test(fm.title ?? "")) {
    const lowerBody = body.toLowerCase()
    const hasSourceContext = body.includes("源码") || lowerBody.includes("source")
    const hasFlow = body.includes("流程") || body.includes("架构") || lowerBody.includes("flow") || lowerBody.includes("hook")
    const hasCaveat =
      body.includes("踩坑") ||
      body.includes("边界") ||
      body.includes("注意") ||
      lowerBody.includes("pitfall") ||
      lowerBody.includes("caveat") ||
      lowerBody.includes("edge case")
    if (!hasSourceContext || !hasFlow || !hasCaveat) {
      addIssue(filePath, "源码导读过薄:应同时包含源码上下文、调用流程和边界/坑点", "warn")
    }
  }

  // 11. 内部文档链接必须指向真实 doc 或 Part 总览页
  const linkBody = stripCodeBlocks(body)
  const markdownLinkRe = /\[[^\]]+\]\((\/docs\/[^)#?\s]+)(?:#[^)]+)?\)/g
  for (const match of linkBody.matchAll(markdownLinkRe)) {
    const href = match[1]
    if (href && !docsTargetExists(href)) {
      addIssue(filePath, `内部文档链接目标不存在: ${href}`)
    }
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

/**
 * 翻译覆盖率统计 —— 按 baseSlug 聚合 .zh.mdx / .en.mdx,统计每篇文章是否有 EN 版本。
 * 不在 issues 列表里报告,只在结尾打印一行汇总。
 */
const LOCALE_RE = /\.(zh|en)\.mdx$/
const baseMap = new Map<string, { zh: boolean; en: boolean }>()
for (const file of files) {
  const rel = file.replace(ROOT + "/", "")
  const m = file.match(LOCALE_RE)
  if (!m) continue
  const base = rel.replace(LOCALE_RE, "")
  const entry = baseMap.get(base) ?? { zh: false, en: false }
  if (m[1] === "zh") entry.zh = true
  if (m[1] === "en") entry.en = true
  baseMap.set(base, entry)
}
const totalArticles = baseMap.size
const enTranslated = [...baseMap.values()].filter((v) => v.en).length
const enMissingFiles = [...baseMap.entries()].filter(([, v]) => v.zh && !v.en).map(([k]) => k)

if (issues.length === 0) {
  if (totalArticles > 0) {
    console.log(
      `✅ 内容检查通过 · EN 翻译覆盖率 ${enTranslated}/${totalArticles}` +
        ` (${Math.round((enTranslated / totalArticles) * 100)}%)`
    )
    if (enMissingFiles.length > 0 && enMissingFiles.length <= 6) {
      console.log("   仍未翻译:" + enMissingFiles.slice(0, 6).join(", "))
    }
  }
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
