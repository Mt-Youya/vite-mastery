# Markdown 加载器插件

> 关联章节:Part 04 · Hooks 深度解析 · 4.8

## 学什么

通过把 `.md` 文件转换成可热更新的 React 组件,深入理解 Vite 插件的 `transform` hook:

- **`transform(code, id)`** — 最高频的 hook,每个模块加载后触发,可修改源码并返回 source map
- **文件过滤** — 用 `id.endsWith(".md")` 避免处理所有模块
- **HMR 边界** — 理解 `import.meta.hot.accept()` 的工作原理

## 前置知识

- 了解 React 基础
- 知道什么是 Markdown
- 完成「虚拟模块插件」实战

## 你将构建

一个 `vite-plugin-md` 插件,支持直接 import `.md` 文件:

```tsx
import Post from "./posts/hello.md"

function App() {
  return <Post /> // 直接渲染 Markdown 内容
}
```

支持热更新:编辑 `.md` 文件,浏览器实时刷新,不丢失组件状态。

## 步骤拆解

| 步骤 | 目录                   | 内容                    |
| ---- | ---------------------- | ----------------------- |
| 1    | steps/01-transform     | 最简 transform hook     |
| 2    | steps/02-md-to-html    | 用 marked 把 md 转 HTML |
| 3    | steps/03-react-wrapper | 包装成 React 组件       |
| 4    | steps/04-hmr           | 添加 HMR accept 边界    |
| 5    | final/                 | 完整插件 + 类型         |

## 快速开始

```bash
pnpm install
pnpm dev
```

## 扩展挑战

- 支持 frontmatter 提取(title / date / tags)
- 支持代码高亮(集成 Shiki)
- 发布到 npm,让其他项目复用
