import type { Plugin, OutputBundle } from "vite"

interface AnalyzerOptions {
  /** 体积阈值(字节),超过时警告 */
  sizeThreshold?: number
}

/**
 * bundle 分析插件 —— Rollup / Rolldown 双兼容版本。
 *
 * 参考 compatibility-matrix.md 了解两个 bundler 的 hook 差异。
 * 本插件只用到 generateBundle,两者行为完全一致。
 */
export function bundleAnalyzer(options: AnalyzerOptions = {}): Plugin {
  const { sizeThreshold = 100 * 1024 } = options

  return {
    name: "vite-plugin-bundle-analyzer",
    apply: "build",

    generateBundle(_outputOptions: unknown, bundle: OutputBundle) {
      const chunks = Object.entries(bundle).filter(([, c]) => c.type === "chunk")
      const assets = Object.entries(bundle).filter(([, c]) => c.type === "asset")

      console.log("\n📦 Bundle 分析报告")
      console.log("─".repeat(60))

      for (const [fileName, chunk] of chunks) {
        if (chunk.type !== "chunk") continue
        const size = Buffer.byteLength(chunk.code, "utf-8")
        const sizeKb = (size / 1024).toFixed(1)
        const warn = size > sizeThreshold ? " ⚠️  (超过阈值)" : ""
        console.log(`  chunk  ${fileName.padEnd(40)} ${sizeKb.padStart(6)} KB${warn}`)
      }

      for (const [fileName, asset] of assets) {
        if (asset.type !== "asset" || typeof asset.source !== "string") continue
        const size = Buffer.byteLength(asset.source, "utf-8")
        const sizeKb = (size / 1024).toFixed(1)
        console.log(`  asset  ${fileName.padEnd(40)} ${sizeKb.padStart(6)} KB`)
      }

      console.log("─".repeat(60))
      console.log(`  共 ${chunks.length} 个 chunk,${assets.length} 个 asset\n`)
    },
  }
}
