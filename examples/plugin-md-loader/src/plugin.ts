import type { Plugin } from "vite"
// TODO: 步骤 2 安装 marked 后取消注释
// import { marked } from "marked"

/**
 * vite-plugin-md 骨架。
 *
 * transform hook 是 Rollup / Rolldown 兼容的,理解它就等于理解了大部分插件的核心机制。
 */
export function mdLoader(): Plugin {
  return {
    name: "vite-plugin-md",

    transform(code, id) {
      if (!id.endsWith(".md")) return null

      // TODO: 步骤 2 — 用 marked 把 markdown 转成 HTML
      // TODO: 步骤 3 — 把 HTML 包成 React 组件
      // TODO: 步骤 4 — 添加 HMR 边界

      const html = code // 占位,直接返回原文

      return {
        code: `
import { createElement } from "react"
export default function MarkdownComponent() {
  return createElement("div", {
    dangerouslySetInnerHTML: { __html: ${JSON.stringify(html)} }
  })
}
`,
        map: null,
      }
    },
  }
}
