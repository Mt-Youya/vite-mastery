/**
 * content-collections 配置入口。
 *
 * 站点级 schema / transform 在 `@vite-mastery/content-config`,
 * 这里只注入 apps/web 选用的 remark / rehype 插件。
 */
import { defineContentConfig } from "@vite-mastery/content-config"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

export default defineContentConfig({
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
        properties: {
          className: ["heading-anchor"],
          ariaLabel: "锚链接",
        },
      },
    ],
  ],
})
