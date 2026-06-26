# 简化版 auto-import 插件

> 关联章节:Part 13 · 真实世界插件赏析 · 13.4

## 学什么

通过实现 `unplugin-auto-import` 的核心机制,综合运用几乎所有学过的插件 hook:

- **`transform`** — 扫描源码,检测未导入的 API
- **`resolveId + load`** — 自动 import 语句作为虚拟模块注入
- **`generateBundle`** — 生成 `.d.ts` 类型声明文件
- **`configureServer`** — dev 模式下监听源文件变化,增量更新 import map

这是对整个插件系统学习的"大乱炖"综合题,完成后相当于能看懂 75% 的社区插件源码。

## 前置知识

- 完成「虚拟模块插件」「Markdown 加载器」「i18n 注入」三个实战项目
- 理解 AST 的基本概念(不需要手写 parser)

## 你将构建

一个 `vite-plugin-auto-import` 插件,支持以下写法:

```ts
// 无需手动 import,直接使用 ref / computed
const count = ref(0)
const doubled = computed(() => count.value * 2)
```

插件自动分析每个文件里用到的 API,从配置的 preset 里找到来源库,自动插入 import 语句。

## 步骤拆解

| 步骤 | 目录             | 内容                               |
| ---- | ---------------- | ---------------------------------- |
| 1    | steps/01-scan    | 用正则扫描源码中的未导入标识符     |
| 2    | steps/02-resolve | 查表找到标识符对应的 import 来源   |
| 3    | steps/03-inject  | 在 transform hook 注入 import 语句 |
| 4    | steps/04-dts     | 在 generateBundle 输出 .d.ts 文件  |
| 5    | steps/05-watch   | 监听新文件,增量处理                |
| 6    | final/           | 完整插件 + 类型 + 测试             |

## 快速开始

```bash
pnpm install
pnpm dev
```

编辑 `src/main.ts`,直接使用 `ref` / `computed` 等 API 而无需 import,看看控制台有没有报错。

## 扩展挑战

- 支持 Vue Composition API 以外的预设(react-use / lodash-es / vueuse)
- 支持 TypeScript 三斜线指令 `/// <reference types="./auto-imports.d.ts" />`
- 与 ESLint `no-undef` 规则集成,避免 lint 报错
