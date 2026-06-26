# @vite-mastery/eslint-config

oxlint 共享预设。**包名沿用 `eslint-config` 是为 future-proof**(留作 oxlint 不能兜底时切回 ESLint 的入口),实际产物是 oxlint 配置。

## 用法

```jsonc
// 任意 package 的 oxlint.json
{
  "extends": ["@vite-mastery/eslint-config/react"],
}
```

## 三个预设

| 预设     | 适用           | 加了什么                                                      |
| -------- | -------------- | ------------------------------------------------------------- |
| `base`   | 任意 TS/JS 包  | correctness/suspicious/perf 分类 + typescript-eslint 等价规则 |
| `react`  | React 库或前端 | 加 react / react-hooks / jsx-a11y                             |
| `nextjs` | Next.js 应用   | 在 react 基础上加 nextjs 插件                                 |
