/**
 * Shiki 高亮器单例。
 *
 * - 同时加载 light/dark 主题,运行时通过 `transformers` 给两个主题各自打 class
 * - 语言按需懒加载(`bundledLanguages`)
 * - twoslash 单独入口,只在标注了 `twoslash` meta 的代码块上启用
 */

import { type BundledLanguage, type BundledTheme, type Highlighter, createHighlighter } from "shiki"
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerMetaHighlight,
  transformerMetaWordHighlight,
} from "@shikijs/transformers"

export const SHIKI_THEMES = {
  light: "github-light" satisfies BundledTheme,
  dark: "github-dark-dimmed" satisfies BundledTheme,
}

export const DEFAULT_LANGS: BundledLanguage[] = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "jsonc",
  "css",
  "html",
  "bash",
  "shell",
  "yaml",
  "toml",
  "markdown",
  "mdx",
  "vue",
  "svelte",
  "diff",
  "ini", // .npmrc / .env 等 INI 格式配置文件
  "sql",
  "xml",
  "dockerfile",
  "nginx",
  "rust",
  "python",
  "go",
]

let cached: Promise<Highlighter> | null = null

export function getHighlighter() {
  cached ??= createHighlighter({
    themes: [SHIKI_THEMES.light, SHIKI_THEMES.dark],
    langs: DEFAULT_LANGS,
  })
  return cached
}

export function getShikiTransformers() {
  return [
    transformerNotationDiff(),
    transformerNotationFocus(),
    transformerNotationHighlight(),
    transformerNotationWordHighlight(),
    transformerMetaHighlight(),
    transformerMetaWordHighlight(),
  ]
}

/**
 * 高亮单段代码,返回 HTML 字符串。
 * 给 RSC / 静态生成用 —— 客户端不应当再调一次。
 *
 * `meta` 是 Shiki transformer 读取的原始 meta string,比如 `{1,3-5}`
 * 用来触发 `transformerMetaHighlight`。
 */
export async function highlight(code: string, lang: BundledLanguage | "text" = "text", meta?: string): Promise<string> {
  const highlighter = await getHighlighter()
  return highlighter.codeToHtml(code, {
    lang,
    themes: SHIKI_THEMES,
    defaultColor: false,
    meta: meta ? { __raw: meta } : undefined,
    transformers: getShikiTransformers(),
  })
}
