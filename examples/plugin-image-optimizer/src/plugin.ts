import type { Plugin, ResolvedConfig } from "vite"

interface ImageOptimizerOptions {
  webp?: { quality: number }
  avif?: { quality: number }
}

/**
 * 图片优化插件骨架。
 *
 * 核心用到了 generateBundle hook —— 产物已生成,但还没写入磁盘,
 * 可以在此访问并修改 bundle 对象,或调用 this.emitFile 输出新文件。
 */
export function imageOptimizer(_options: ImageOptimizerOptions = {}): Plugin {
  let config: ResolvedConfig

  return {
    name: "vite-plugin-image-optimizer",
    apply: "build", // 只在 build 阶段运行

    configResolved(resolvedConfig) {
      config = resolvedConfig
    },

    async generateBundle(_, bundle) {
      // TODO: 步骤 1 — 找出 bundle 里的图片资源
      const imageAssets = Object.entries(bundle).filter(([, chunk]) => {
        if (chunk.type !== "asset") return false
        const name = chunk.fileName
        return /\.(png|jpe?g|gif)$/i.test(name)
      })

      if (imageAssets.length === 0) return

      config.logger.info(`\nvite-plugin-image-optimizer: 找到 ${imageAssets.length} 张图片`)

      // TODO: 步骤 2 — 用 sharp 转换 WebP
      // TODO: 步骤 3 — 同时输出 AVIF
      // TODO: 步骤 4 — 添加缓存

      for (const [fileName] of imageAssets) {
        config.logger.info(`  优化: ${fileName}`)
      }
    },
  }
}
