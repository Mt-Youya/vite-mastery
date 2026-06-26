# vite-mastery playground

WebContainer 版在线实验场，用于在浏览器中运行真实的 Vite 8 示例项目。

## 开发

```bash
pnpm --filter @vite-mastery/playground dev
pnpm --filter @vite-mastery/playground build
```

WebContainer 依赖 `SharedArrayBuffer`，本地 dev server 和生产部署都必须带上：

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

`vite.config.ts` 和 `vercel.json` 已经配置这些 headers。
