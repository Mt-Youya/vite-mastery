# 图片优化插件

> 关联章节:Part 07 · 生产构建 · 7.7

## 学什么

通过集成 `sharp` 构建一个生产级图片优化插件,掌握 Vite 构建阶段的关键 hook:

- **`generateBundle`** — 在 chunk 生成后访问并修改产物 bundle 对象
- **`this.emitFile`** — 在插件内向产物目录输出新文件
- **`configResolved`** — 读取最终配置(outputDir / assetsDir 等)

同时学习如何实现**并行处理**和**构建缓存**,让插件在大项目中依然高效。

## 前置知识

- 理解 Vite 构建流程(dev vs build 两阶段)
- 了解 WebP / AVIF 图片格式的优势

## 你将构建

一个 `vite-plugin-image-optimizer` 插件,构建时自动:

1. 把 `assets/` 里的 PNG / JPEG 转为 WebP(体积减少 30-80%)
2. 同时生成 AVIF 版本(更高压缩比,Safari 16+ / Chrome 85+ 支持)
3. 保留原图作为降级(旧浏览器兼容)
4. 输出构建报告:每张图的压缩率

## 步骤拆解

| 步骤 | 目录                    | 内容                 |
| ---- | ----------------------- | -------------------- |
| 1    | steps/01-generateBundle | 读取产物图片资源     |
| 2    | steps/02-sharp-convert  | 用 sharp 转换为 WebP |
| 3    | steps/03-avif           | 同时输出 AVIF        |
| 4    | steps/04-cache          | 添加基于 hash 的缓存 |
| 5    | final/                  | 完整插件 + 构建报告  |

## 快速开始

```bash
# 安装 sharp(需要 node-gyp,首次安装稍慢)
pnpm install
pnpm build
```

查看 `dist/assets/` 目录,对比优化前后的文件大小。

> **注意**:`sharp` 是原生 Node.js 插件,在 CI 环境需要提前编译或使用预构建二进制。

## 扩展挑战

- 支持 JPEG → WebP 质量可配置
- 支持 SVG 优化(集成 SVGO)
- 添加 `--report` CLI 标志输出优化报告到 JSON 文件
