# Env API + RSC 多环境构建

> 关联章节:Part 05 · Environment API · 5.10

---

> ⚠️ **重要提示**:本项目使用 Vite **Environment API**,该 API 当前处于 **RC 阶段**。
> 具体的 API 名称和接口可能在未来的 minor 版本中变化。
> 本项目锁定在 Vite `8.1.x`,不使用 `^8.1` 浮动版本。
> 跑通后请对照 [Vite 官方变更日志](https://vitejs.dev/changes) 确认 API 是否有更新。

---

## 学什么

通过构建一个 RSC-like 多环境构建 Demo,深入理解 Environment API 的核心三要素:

- **`Environment`** — 隔离的模块图谱,每个环境(client/ssr/rsc)有独立的 `moduleGraph`
- **`ModuleRunner`** — 在指定 Environment 中运行模块,等价于在对应环境里执行 `import()`
- **`HotChannel`** — 跨环境的 HMR 消息通道,让 client 可以感知 server 模块更新

## 前置知识

- 理解 Vite SSR 基础(Part 08)
- 了解 React Server Components 的概念(不需要深入)
- 阅读 Part 05 Environment API 前三节

## 你将构建

一个精简的多环境构建配置:

- `client` 环境 → 打包成浏览器 JS
- `ssr` 环境 → Node.js SSR 入口
- `rsc` 环境 → RSC Server 专属模块图

展示三个环境如何共享部分模块,又各自隔离敏感代码。

## 步骤拆解

| 步骤 | 目录                   | 内容                                |
| ---- | ---------------------- | ----------------------------------- |
| 1    | steps/01-basic-env     | 配置 client + ssr 两个 Environment  |
| 2    | steps/02-rsc-env       | 添加自定义 rsc Environment          |
| 3    | steps/03-module-runner | 用 ModuleRunner 在 rsc 环境运行组件 |
| 4    | steps/04-hot-channel   | 配置跨环境 HMR                      |
| 5    | final/                 | 完整 Demo + 说明文档                |

## 快速开始

```bash
pnpm install
pnpm dev
```

> 如果 API 报错,很可能是 Vite 版本不匹配。请检查 `package.json` 中 vite 版本是否严格等于 `8.1.x`。

## 已知限制(RC 阶段)

- `ModuleRunner` 的 `import()` 方法签名可能变化
- 自定义 Environment 的 `resolve` 配置项尚未稳定
- HotChannel 的事件名约定可能调整

详见本目录根下 `compatibility-matrix.md`(若存在)。
