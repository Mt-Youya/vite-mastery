# vite-mastery playground

This package is the WebContainer-based playground for Vite Mastery. It runs real Vite 8 example projects directly in the browser.

## Development

```bash
pnpm --filter @vite-mastery/playground dev
pnpm --filter @vite-mastery/playground build
```

WebContainer requires `SharedArrayBuffer`, so both local development and production deployments must send these headers:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

`vite.config.ts` and `vercel.json` already configure these headers.
