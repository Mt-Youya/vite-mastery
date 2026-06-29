#!/usr/bin/env node
/**
 * fix-tw-classes.ts — 一键修复所有可简化的 Tailwind 任意变体写法
 *
 * 用法:
 *   pnpm fix:tw              # 直接修改
 *   pnpm fix:tw -- --dry-run # 预览，不写入
 *
 * 加新规则：在 TRANSFORMS 里追加一条即可，格式见注释。
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join, extname, relative } from "node:path"

// ─── 规则表 ───────────────────────────────────────────────────────────────────
//
// 每条规则：
//   desc    — 出现在报告里的说明
//   pattern — 匹配正则（不要加 /g 标志，脚本会自动加）
//   replace — 替换字符串（支持 $1 $2 反向引用）
//
// 规则约定：
//   • 只替换"无值"的属性变体（不含 = 号），有值形式（data-[state=open]）保持不变
//   • 正则里用 [a-zA-Z][a-zA-Z0-9-]* 保证只匹配合法属性名
//
const TRANSFORMS: Array<{ desc: string; pattern: RegExp; replace: string }> = [
  // ━━ 1. 任意变体简写：data / aria 布尔属性 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // data-[selected]: → data-selected:  / aria-[hidden]: → aria-hidden:
  // 仅限无 = 的布尔属性，data-[state=open] 保持不变
  {
    desc: "data-[attr]: → data-attr:  （布尔 data 属性）",
    pattern: /data-\[([a-zA-Z][a-zA-Z0-9-]*)\]:/,
    replace: "data-$1:",
  },
  {
    desc: "aria-[attr]: → aria-attr:  （布尔 ARIA 属性）",
    pattern: /aria-\[([a-zA-Z][a-zA-Z0-9-]*)\]:/,
    replace: "aria-$1:",
  },

  // ━━ 2. 移除 var() 包装 → @theme token 直写 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 注意顺序：ease / color 专用规则必须在通用 catch-all 之前

  // ease-[var(--ease-out-quart)] → ease-out-quart
  // 原理：--ease-out-quart 在 @theme 定义，Tailwind 自动生成 ease-out-quart utility
  {
    desc: "ease-[var(--ease-X)] → ease-X  （@theme ease token）",
    pattern: /ease-\[var\(--ease-([a-zA-Z0-9-]+)\)\]/,
    replace: "ease-$1",
  },

  // text-[var(--color-brand-700)] → text-brand-700
  // bg-[var(--color-danger-500)] → bg-danger-500
  // border-[var(--color-brand-600)]/40 → border-brand-600/40
  // 原理：--color-X-N 在 @theme 定义；移除 [var(--color-)] 前缀后留下 token 名
  // /opacity 后缀自动保留（不在匹配范围内）
  {
    desc: "utility-[var(--color-X)] → utility-X  （@theme 颜色 token）",
    pattern: /([\w-]+)-\[var\(--color-([a-zA-Z0-9-]+)\)\]/,
    replace: "$1-$2",
  },

  // h-[var(--collapsible-panel-height)] → h-(--collapsible-panel-height)
  // min-w-[var(--anchor-width)] → min-w-(--anchor-width)
  // 通用 catch-all：把 [var(--X)] 改成 (--X) 写法（仍是任意值，但去掉 var()）
  // 放在专用规则之后，避免匹配到 color/ease
  {
    desc: "utility-[var(--X)] → utility-(--X)  （移除 var() 包装）",
    pattern: /([\w-]+)-\[var\((--[a-zA-Z0-9-]+)\)\]/,
    replace: "$1-($2)",
  },

  // ━━ 3. @theme container token 简写 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // max-w-(--container-doc) → max-w-doc  / max-w-(--container-prose) → max-w-prose
  {
    desc: "max-w-(--container-doc) → max-w-doc",
    pattern: /max-w-\(--container-doc\)/,
    replace: "max-w-doc",
  },
  {
    desc: "max-w-(--container-prose) → max-w-prose",
    pattern: /max-w-\(--container-prose\)/,
    replace: "max-w-prose",
  },

  // ━━ 4. 已废弃的 utility 名 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Tailwind v3 → v4：flex-shrink-* 改为 shrink-*，flex-grow 改为 grow
  {
    desc: "flex-shrink-0 → shrink-0  （Tailwind v4 新名）",
    pattern: /\bflex-shrink-0\b/,
    replace: "shrink-0",
  },
  {
    desc: "flex-shrink → shrink  （Tailwind v4 新名）",
    pattern: /\bflex-shrink\b/,
    replace: "shrink",
  },
  {
    desc: "flex-grow-0 → grow-0  （Tailwind v4 新名）",
    pattern: /\bflex-grow-0\b/,
    replace: "grow-0",
  },
  {
    desc: "flex-grow → grow  （Tailwind v4 新名）",
    pattern: /\bflex-grow\b/,
    replace: "grow",
  },
  {
    desc: "break-words → wrap-break-word  （Tailwind v4 新名）",
    pattern: /\bbreak-words\b/,
    replace: "wrap-break-word",
  },

  // ━━ 5. 任意 rem 值 → Tailwind 数字比例 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Tailwind 间距：1 单位 = 0.25rem；1.125rem / 0.25 = 4.5，10rem / 0.25 = 40
  {
    desc: "translate-x-[1.125rem] → translate-x-4.5",
    pattern: /translate-x-\[1\.125rem\]/,
    replace: "translate-x-4.5",
  },
  {
    desc: "min-h-[10rem] → min-h-40",
    pattern: /min-h-\[10rem\]/,
    replace: "min-h-40",
  },
  {
    desc: "h-[13rem] → h-52",
    pattern: /\bh-\[13rem\]/,
    replace: "h-52",
  },
  {
    desc: "min-h-[200px] → min-h-50  （200px = 50 × 4px spacing unit）",
    pattern: /\bmin-h-\[200px\]/,
    replace: "min-h-50",
  },

  // ━━ 6. 任意 px 值 → @theme 文字 token ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // text-[11px] → text-2xs（theme: --text-2xs: 0.6875rem = 11px）
  // 其他 px 值（9px / 10px / 13px）在 @theme 无对应 token，保持不变
  {
    desc: "text-[11px] → text-2xs  （@theme --text-2xs token）",
    pattern: /\btext-\[11px\]/,
    replace: "text-2xs",
  },
]

// ─── 扫描范围 ─────────────────────────────────────────────────────────────────
const SCAN_DIRS = ["apps", "packages"]
const SCAN_EXTS = new Set([".tsx", ".ts", ".jsx", ".js", ".mjs", ".cjs"])
const IGNORE = new Set(["node_modules", ".next", "dist", ".turbo", ".git", ".content-collections"])

// ─── 工具函数 ─────────────────────────────────────────────────────────────────
function findFiles(dir: string): string[] {
  const results: string[] = []
  let entries: string[]
  try {
    entries = readdirSync(dir)
  } catch {
    return results
  }
  for (const entry of entries) {
    if (IGNORE.has(entry)) continue
    const full = join(dir, entry)
    try {
      const stat = statSync(full)
      if (stat.isDirectory()) {
        results.push(...findFiles(full))
      } else if (SCAN_EXTS.has(extname(full))) {
        results.push(full)
      }
    } catch {
      // 跳过无法访问的文件
    }
  }
  return results
}

/** 对单个文件内容应用所有规则，返回修改后的内容和变更数。 */
function applyTransforms(content: string): { result: string; count: number } {
  let result = content
  let count = 0
  for (const { pattern, replace } of TRANSFORMS) {
    const global = new RegExp(pattern.source, "g")
    const matches = result.match(global)
    if (matches) {
      count += matches.length
      result = result.replace(global, replace)
    }
  }
  return { result, count }
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes("--dry-run")
const root = process.cwd()

console.log(DRY_RUN ? "预览模式（不写入文件）\n" : "修复 Tailwind class 名...\n")

// 打印规则表
console.log(`已加载 ${TRANSFORMS.length} 条规则:`)
for (const { desc } of TRANSFORMS) console.log(`  · ${desc}`)
console.log()

let totalFiles = 0
let totalChanges = 0

for (const dir of SCAN_DIRS) {
  const files = findFiles(join(root, dir))
  for (const filePath of files) {
    const original = readFileSync(filePath, "utf-8")
    const { result, count } = applyTransforms(original)
    if (count === 0) continue

    const rel = relative(root, filePath)
    console.log(`  ${DRY_RUN ? "预览" : "修改"}  ${rel}  (${count} 处)`)
    totalFiles++
    totalChanges += count

    if (!DRY_RUN) {
      writeFileSync(filePath, result, "utf-8")
    }
  }
}

if (totalChanges === 0) {
  console.log("没有需要修复的写法，一切整洁。")
} else {
  console.log(`\n${DRY_RUN ? "预览" : "完成"}：${totalFiles} 个文件，共 ${totalChanges} 处`)
  if (DRY_RUN) console.log("去掉 --dry-run 参数后重新运行以实际写入。")
}
