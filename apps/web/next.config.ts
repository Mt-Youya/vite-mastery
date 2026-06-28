import { withContentCollections } from "@content-collections/next"
import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"
import { fileURLToPath } from "node:url"

const contentCollectionsEntry = fileURLToPath(new URL("./.content-collections/generated/index.js", import.meta.url))
/** 把 messages 注入 + 提供 next-intl 的 server helpers。 */
const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const config: NextConfig = {
  reactStrictMode: true,
  /**
   * monorepo workspace 包是 source-import(各包 main 指 src/index.ts),
   * Next.js 必须把它们也过一遍 SWC,否则 .tsx 编译不了。
   */
  transpilePackages: [
    "@vite-mastery/ui",
    "@vite-mastery/mdx-components",
    "@vite-mastery/content-config",
    "@vite-mastery/tailwind-config",
  ],
  experimental: {
    /** MDX 内容路由会大量用,Turbopack 已是 Next 16 默认 */
    optimizePackageImports: ["@hugeicons/react", "@hugeicons/core-free-icons", "@base-ui/react"],
  },
  turbopack: {
    resolveAlias: {
      "content-collections": "./.content-collections/generated/index.js",
    },
  },
  /** RSC 阶段把 shiki / twoslash 当 server-only,避免打进 client bundle */
  serverExternalPackages: ["shiki", "@shikijs/twoslash", "@shikijs/transformers"],
  webpack: (webpackConfig) => {
    webpackConfig.resolve ??= {}
    webpackConfig.resolve.alias ??= {}
    webpackConfig.resolve.alias["content-collections"] = contentCollectionsEntry
    return webpackConfig
  },
}

/**
 * `withContentCollections` 的返回类型在新版里是 `Promise<Partial<NextConfig>>`,
 * `withNextIntl` 的入参又是同步 NextConfig —— 用一个 async 默认导出包一下,
 * Next 16 接受 async config factory。
 */
export default async function nextConfig() {
  const withContent = await withContentCollections(config)
  return withNextIntl(withContent as NextConfig)
}
