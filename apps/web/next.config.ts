import { withContentCollections } from "@content-collections/next";
import type { NextConfig } from "next";

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
    optimizePackageImports: [
      "@hugeicons/react",
      "@hugeicons/core-free-icons",
      "@base-ui-components/react",
    ],
  },
  /** RSC 阶段把 shiki / twoslash 当 server-only,避免打进 client bundle */
  serverExternalPackages: ["shiki", "@shikijs/twoslash", "@shikijs/transformers"],
};

export default withContentCollections(config);
