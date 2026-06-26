import type { MetadataRoute } from "next"
import { allDocs } from "content-collections"
import { PARTS, SITE } from "@/lib/site-config"

/**
 * Next.js App Router 自动 sitemap。
 * 访问 /sitemap.xml 查看。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/examples`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  // Part 总览页
  const partRoutes: MetadataRoute.Sitemap = PARTS.map((p) => ({
    url: `${base}/docs/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }))

  // 每篇文档
  const docRoutes: MetadataRoute.Sitemap = (allDocs as { slug: string; updatedAt?: string }[]).map((doc) => ({
    url: `${base}/docs/${doc.slug}`,
    lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...partRoutes, ...docRoutes]
}
