# 手写 SSR(Environment API)

> 关联章节:Part 08 · SSR & SSG · 8.2

## 学什么

用 Vite 8 的 **Environment API** 从零搭建一个 SSR 应用,理解新 SSR 模型与旧版(`ssrLoadModule`)的根本区别:

- **旧模型** — `server.ssrLoadModule(url)` 在单一模块图里用特殊模式加载模块
- **新模型** — `ssr` Environment 有独立的 `moduleGraph`,通过 `ModuleRunner` 执行服务端代码

通过对比,彻底搞懂 Vite 8 为什么要引入 Environment API。

## 前置知识

- 理解 Node.js HTTP server 基础
- 了解 React 的 `renderToString`
- 看过 Part 05 Environment API 开篇

## 你将构建

一个最小的 SSR 服务器:

1. Express(或 Node http)作为 HTTP 层
2. Vite 8 dev server 中间件做模块热更新
3. 用 `ssr` Environment + `ModuleRunner` 执行服务端渲染函数
4. 客户端 hydration

## 步骤拆解

| 步骤 | 目录               | 内容                                      |
| ---- | ------------------ | ----------------------------------------- |
| 1    | steps/01-server    | Node HTTP server + Vite 中间件            |
| 2    | steps/02-ssr-env   | 创建 ssr Environment + ModuleRunner       |
| 3    | steps/03-render    | 用 ModuleRunner 执行 React renderToString |
| 4    | steps/04-hydration | 客户端 hydration                          |
| 5    | final/             | 完整 SSR 服务器                           |

## 快速开始

```bash
pnpm install
pnpm dev
```

访问 `http://localhost:3000`,查看 HTML 源码确认 SSR 正常工作(应有内容而不是空 `<div id="root">`）。
