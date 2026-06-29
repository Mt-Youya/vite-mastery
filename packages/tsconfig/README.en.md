# @vite-mastery/tsconfig

Shared TypeScript configuration presets for the monorepo.

## Usage

```jsonc
// tsconfig.json in any package
{
  "extends": "@vite-mastery/tsconfig/base",
}
```

## Presets

| Preset          | Target                       | Key Differences                                              |
| --------------- | ---------------------------- | ------------------------------------------------------------ |
| `base`          | Node scripts and TS packages | strict mode, `module: Preserve`, `moduleResolution: Bundler` |
| `nextjs`        | Next.js App Router apps      | DOM libs, `jsx: preserve`, and the Next.js TypeScript plugin |
| `react-library` | React library packages       | declaration emit settings for `vite-plugin-dts`              |
