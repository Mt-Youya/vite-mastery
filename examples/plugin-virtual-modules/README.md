# 虚拟模块插件

> 关联章节:Part 03 · 插件系统 · 3.4

## 学什么

通过实现一个虚拟模块插件,掌握 Vite 插件最核心的两个 hook:

- **`resolveId`** — 拦截 `import "virtual:xxx"` 请求,返回一个特殊模块 ID(前缀 `\0` 防止文件系统误解析)
- **`load`** — 对应特殊 ID,返回动态生成的模块内容(字符串形式的 ES 模块代码)

## 前置知识

- 知道什么是 ES Module
- 了解 Vite 基本用法

## 你将构建

一个叫 `vite-plugin-virtual` 的插件,支持以下写法:

```ts
import meta from "virtual:site-meta"
console.log(meta.buildTime) // 当前构建时间
console.log(meta.version) // package.json 版本号
```

数据在构建时由插件注入,不需要任何运行时开销。

## 步骤拆解

| 步骤 | 目录                    | 内容                  |
| ---- | ----------------------- | --------------------- |
| 1    | steps/01-bare-plugin    | 最小可运行插件骨架    |
| 2    | steps/02-resolveId-load | 实现 resolveId + load |
| 3    | steps/03-hmr            | 添加 HMR 支持         |
| 4    | final/                  | 完整带类型声明的插件  |

## 快速开始

```bash
pnpm install
pnpm dev
```

打开浏览器,看控制台输出 `meta.buildTime`。改一下 `src/plugin.ts` 里的元数据,感受 HMR。

## 扩展挑战

- 让插件接受配置参数,支持自定义注入内容
- 为虚拟模块生成 `.d.ts` 类型声明文件
- 支持多个虚拟模块(`virtual:foo` / `virtual:bar`)
