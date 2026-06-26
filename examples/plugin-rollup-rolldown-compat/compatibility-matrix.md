# Rollup vs Rolldown Hook 兼容性矩阵

> 基于 Vite 8.1.x(Rolldown)与 `rolldown-vite`(Rollup 兼容层)
> 最后更新:2026-06

## 说明

本矩阵记录两个 bundler 在 hook 行为上的已知差异,供插件作者参考。

**兼容性符号:**

- ✅ 行为完全一致
- ⚠️ 有细微差异(见备注)
- ❌ 不支持/行为不同
- 🆕 Rolldown 扩展(Rollup 没有)

---

## 通用构建 Hook

| Hook                                   | Rollup | Rolldown | 备注                                  |
| -------------------------------------- | ------ | -------- | ------------------------------------- |
| `buildStart(options)`                  | ✅     | ✅       | —                                     |
| `resolveId(source, importer, options)` | ✅     | ✅       | Rolldown 的 `options.custom` 字段扩展 |
| `load(id, options)`                    | ✅     | ✅       | —                                     |
| `transform(code, id, options)`         | ✅     | ✅       | —                                     |
| `moduleParsed(info)`                   | ✅     | ✅       | —                                     |
| `buildEnd(error?)`                     | ✅     | ✅       | —                                     |

## 输出 Hook

| Hook                                       | Rollup | Rolldown | 备注                                     |
| ------------------------------------------ | ------ | -------- | ---------------------------------------- |
| `renderStart(outputOptions, inputOptions)` | ✅     | ✅       | —                                        |
| `renderChunk(code, chunk, options)`        | ✅     | ⚠️       | Rolldown chunk 对象扩展了 `envName` 字段 |
| `generateBundle(options, bundle, isWrite)` | ✅     | ✅       | —                                        |
| `writeBundle(options, bundle)`             | ✅     | ✅       | —                                        |
| `closeBundle()`                            | ✅     | ✅       | —                                        |
| `banner / footer / intro / outro`          | ✅     | ⚠️       | Rolldown 部分场景异步行为不同            |

## Vite 独有 Hook(两者均支持)

| Hook                 | Rollup 项目 | Vite+Rolldown | 备注          |
| -------------------- | ----------- | ------------- | ------------- |
| `config`             | ❌          | ✅            | Vite 插件专属 |
| `configResolved`     | ❌          | ✅            | —             |
| `configureServer`    | ❌          | ✅            | 仅 dev        |
| `transformIndexHtml` | ❌          | ✅            | 仅 Vite       |
| `handleHotUpdate`    | ❌          | ✅            | 仅 dev        |

## Rolldown 扩展(Rollup 没有)

| Hook / 字段                   | 说明                                                 |
| ----------------------------- | ---------------------------------------------------- |
| `renderChunk` chunk.`envName` | 当前 Environment 名称(client / ssr / 自定义)         |
| `moduleInfo.ast`              | Rolldown 提供 OXC AST,Rollup 提供 acorn AST,结构不同 |

## 已知不兼容场景

1. **`renderChunk` 返回 `{ code, ast }`** — Rolldown 支持直接返回 OXC AST 跳过重新解析,Rollup 不支持此优化
2. **插件钩子执行顺序** — `post` enforce 插件在 Rolldown 与 Rollup 对某些 hook 的调用时机略有不同,见 [Vite 8 迁移指南](https://vitejs.dev/guide/migration)

## 兼容层写法参考

```ts
// 检测 Rolldown 环境
const isRolldown = (chunk: RenderedChunk) => "envName" in chunk

export function compatPlugin(): Plugin {
  return {
    name: "compat-plugin",
    renderChunk(code, chunk) {
      if (isRolldown(chunk)) {
        // Rolldown 特有逻辑
      } else {
        // Rollup 兼容逻辑
      }
    },
  }
}
```
