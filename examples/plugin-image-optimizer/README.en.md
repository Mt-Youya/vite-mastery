# Image Optimizer Plugin

> Related chapter: Part 07 · Production Build · 7.7

## What You Will Learn

Build a production-grade image optimization plugin by integrating `sharp`, and master the key hooks in Vite's build phase:

- **`generateBundle`** — access and modify the output bundle object after chunks are generated
- **`this.emitFile`** — emit new files to the output directory from within a plugin
- **`configResolved`** — read the final resolved config (outputDir / assetsDir, etc.)

You will also learn how to implement **parallel processing** and **build caching** so the plugin stays efficient even in large projects.

## Prerequisites

- Understanding of the Vite build pipeline (dev vs build two-phase model)
- Familiarity with the advantages of WebP / AVIF image formats

## What You Will Build

A `vite-plugin-image-optimizer` plugin that automatically does the following at build time:

1. Converts PNG / JPEG files in `assets/` to WebP (30–80% size reduction)
2. Simultaneously generates AVIF versions (higher compression; supported by Safari 16+ / Chrome 85+)
3. Retains the original images as a fallback (for older browser compatibility)
4. Outputs a build report showing the compression ratio for each image

## Step Breakdown

| Step | Directory               | Content                                  |
| ---- | ----------------------- | ---------------------------------------- |
| 1    | steps/01-generateBundle | Read image assets from the output bundle |
| 2    | steps/02-sharp-convert  | Convert to WebP using sharp              |
| 3    | steps/03-avif           | Also output AVIF                         |
| 4    | steps/04-cache          | Add hash-based caching                   |
| 5    | final/                  | Complete plugin + build report           |

## Quick Start

```bash
# Install sharp (requires node-gyp; first install may be slow)
pnpm install
pnpm build
```

Check the `dist/assets/` directory and compare file sizes before and after optimization.

> **Note:** `sharp` is a native Node.js addon. In CI environments you may need to pre-compile it or use a prebuilt binary.

## Extension Challenges

- Make JPEG → WebP quality configurable
- Add SVG optimization (integrate SVGO)
- Add a `--report` CLI flag to write the optimization report to a JSON file
