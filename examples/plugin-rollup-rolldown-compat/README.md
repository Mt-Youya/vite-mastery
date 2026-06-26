# Rollup / Rolldown 双 bundler 兼容插件

> 关联章节:Part 02 · Bundler 演进史 · 2.5

## 学什么

通过编写一个能同时运行在 **Rollup**(via `rolldown-vite`)和 **Rolldown**(Vite 8)上的插件,理解两个 bundler 的 hook API 差异与兼容边界:

- 哪些 Rollup hook 在 Rolldown 中行为完全一致
- 哪些 hook 在 Rolldown 中有扩展参数(如 `renderChunk` 的 `envName`)
- 如何用运行时检测做条件适配,而不是维护两份代码

## 前置知识

- 完成「虚拟模块插件」和「Markdown 加载器」实战
- 了解 Vite 7 → Vite 8 的 bundler 迁移背景(Part 02)

## 你将构建

一个 `vite-plugin-bundle-analyzer` 插件,在构建完成后输出模块依赖分析报告:

- 列出每个 chunk 的大小和包含模块
- 标记体积超过阈值的模块
- 同时在 Vite 7(rolldown-vite)和 Vite 8(Rolldown)上测试通过

## 步骤拆解

| 步骤 | 目录                    | 内容                                        |
| ---- | ----------------------- | ------------------------------------------- |
| 1    | steps/01-generateBundle | 用 generateBundle hook 读取 bundle          |
| 2    | steps/02-renderChunk    | 对比 Rollup vs Rolldown 的 renderChunk 参数 |
| 3    | steps/03-compat-layer   | 编写兼容层函数                              |
| 4    | final/                  | 完整插件 + 兼容测试                         |

## 快速开始

```bash
pnpm install
# 用 Vite 8(Rolldown)运行
pnpm build

# 若要测试 Rollup 兼容,切到 rolldown-vite 分支按 compatibility-matrix.md 指引操作
```

查看控制台的 bundle 分析报告。
