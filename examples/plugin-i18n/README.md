# i18n 自动注入插件

> 关联章节:Part 04 · Hooks 深度解析 · 4.9

## 学什么

通过构建一个 i18n 注入插件,理解 Vite 独有的两个高频 hook:

- **`transformIndexHtml`** — 在 dev server 和 build 阶段修改 `index.html` 内容
- **`resolveId` + `load`** — 把语言包做成虚拟模块,无需手动 import

## 前置知识

- 理解虚拟模块插件(实战项目 1)
- 了解 i18n 的基本概念(key-value 映射翻译)

## 你将构建

一个 `vite-plugin-i18n` 插件,让你可以这样写代码:

```ts
import t from "virtual:i18n"
console.log(t("hello")) // → "你好"
console.log(t("welcome")) // → "欢迎使用 Vite"
```

语言包从 `locales/zh.json` 读取,切换语言只改配置,无需改业务代码。

## 步骤拆解

| 步骤 | 目录                    | 内容                                 |
| ---- | ----------------------- | ------------------------------------ |
| 1    | steps/01-locale-virtual | 把语言包变成虚拟模块                 |
| 2    | steps/02-inject-html    | 用 transformIndexHtml 注入 lang 属性 |
| 3    | steps/03-watch          | 监听 locale 文件变化触发 HMR         |
| 4    | final/                  | 完整插件 + 多语言切换示例            |

## 快速开始

```bash
pnpm install
pnpm dev
```

修改 `locales/zh.json`,语言包变化会触发热更新。

## 扩展挑战

- 支持多语言切换(运行时动态 import)
- 生成类型安全的 `t()` 函数(key 有 TypeScript 补全)
- 支持带插值的翻译字符串,如 `t("greeting", { name: "Jay" })`
