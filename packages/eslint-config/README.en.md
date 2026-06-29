# @vite-mastery/eslint-config

Shared oxlint presets for the monorepo. The package keeps the `eslint-config` name as a future-proof entrypoint, but the current output is oxlint configuration.

## Usage

```jsonc
// oxlint.json in any package
{
  "extends": ["@vite-mastery/eslint-config/react"],
}
```

## Presets

| Preset   | Target                 | Includes                                                  |
| -------- | ---------------------- | --------------------------------------------------------- |
| `base`   | Any TS/JS package      | correctness, suspicious, perf, and TypeScript-style rules |
| `react`  | React packages or apps | React, React Hooks, and JSX accessibility rules           |
| `nextjs` | Next.js apps           | The React preset plus Next.js-specific rules              |
