# 跨框架组件库(库模式)

> 关联章节:Part 10 · 库模式 · 10.3

## 学什么

用 Vite 的 **library mode** 构建一套能同时支持 React / Vue / Svelte / Solid 的组件库:

- **`build.lib`** — 开启库模式,控制入口、格式、文件名
- **`rollupOptions.external`** — 排除框架本身不打包进产物
- **`build.rollupOptions.output.globals`** — 为 UMD 格式声明全局变量名
- **Monorepo 分包策略** — `core` 共享逻辑,各框架包只做适配

## 前置知识

- 了解 React / Vue 组件写法
- 理解 npm 包的 `main` / `module` / `exports` 字段

## 项目结构

```text
library-mode-demo/
  packages/
    core/       ← 框架无关的核心逻辑
    react/      ← React 适配层
    vue/        ← Vue 3 适配层
    svelte/     ← Svelte 适配层
    solid/      ← Solid.js 适配层
  pnpm-workspace.yaml
```

## 你将构建

一个 `<Button>` 组件,一次构建,输出:

- `esm/` — ES Module(Tree-shakable)
- `cjs/` — CommonJS(向后兼容)
- 类型声明 `.d.ts`

五个框架各自有适配包,消费同一份核心逻辑。

## 快速开始

```bash
pnpm install
pnpm build        # 构建所有子包
```

查看各包的 `dist/` 目录,确认 ESM / CJS 双格式产物。

## 步骤拆解

| 步骤 | 目录           | 内容                    |
| ---- | -------------- | ----------------------- |
| 1    | steps/01-core  | 实现 core 包纯逻辑      |
| 2    | steps/02-react | React 适配 + 库模式配置 |
| 3    | steps/03-vue   | Vue 适配                |
| 4    | steps/04-types | 生成 .d.ts 类型声明     |
| 5    | final/         | 全套五框架产物          |
