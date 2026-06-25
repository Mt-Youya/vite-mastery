# @vite-mastery/tsconfig

共享 tsconfig 预设。

## 用法

```jsonc
// 任意 package 的 tsconfig.json
{
  "extends": "@vite-mastery/tsconfig/base"
}
```

## 三个预设

| 预设 | 适用 | 关键差异 |
|---|---|---|
| `base` | Node 脚本、纯 TS 包 | strict 全开、`module: Preserve`、`moduleResolution: Bundler` |
| `nextjs` | Next.js App Router | 加 DOM lib、`jsx: preserve`、Next 插件 |
| `react-library` | React 库模式打包 | `declaration` + `emitDeclarationOnly`,配合 `vite-plugin-dts` |
