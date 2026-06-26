# Monorepo 模板

> 关联章节:Part 11 · Monorepo 工程化 · 11.3

## 学什么

通过复刻 vite-mastery 的工程化结构,掌握 pnpm workspace Monorepo 的核心概念:

- **pnpm workspace** 依赖管理(`workspace:*` 协议)
- **跨包依赖预构建** — 让 `apps/` 直接消费 `packages/` 里未编译的 TypeScript
- **Turborepo 缓存策略** — 增量构建,只重新编译有变化的包
- **Vite 8 `resolve.alias`** — 在开发模式直接 resolve 到 package 的 `src/`,省去编译步骤

## 前置知识

- 了解 pnpm workspace 基础
- 理解 `package.json` 的 `exports` 字段

## 项目结构

```text
monorepo-template/
  apps/
    web/          ← 主应用(Vite 8 + React)
  packages/
    ui/           ← 共享 UI 组件库
    utils/        ← 共享工具函数
  pnpm-workspace.yaml
  turbo.json
```

## 你将构建

一个生产可用的 Monorepo 起点:

- `apps/web` 直接 import `@monorepo/ui` 和 `@monorepo/utils`
- 开发模式:修改 `packages/` 源码即时反映在 `apps/web`(无需重新 build)
- 构建模式:Turborepo 并行构建,依赖图自动排序

## 快速开始

```bash
pnpm install
pnpm dev     # 启动 apps/web 开发服务器
pnpm build   # 构建所有包
```

## 步骤拆解

| 步骤 | 目录                | 内容                      |
| ---- | ------------------- | ------------------------- |
| 1    | steps/01-workspace  | pnpm workspace + 基础结构 |
| 2    | steps/02-vite-alias | 配置 Vite alias 指向 src/ |
| 3    | steps/03-turbo      | Turborepo 构建缓存        |
| 4    | final/              | 完整模板                  |
