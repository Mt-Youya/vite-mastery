import type { MetadataRoute } from "next"
import { allDocs } from "content-collections"
import { DEFAULT_LOCALE, LOCALES, LOCALE_HTML_TAG, type Locale } from "@/i18n/config"
import { PARTS, SITE } from "@/lib/site-config"

/**
 * Next.js App Router 自动 sitemap。访问 /sitemap.xml 查看。
 *
 * 双语 sitemap 策略:
 *   - 每个静态/动态路由按 LOCALES 各出一条
 *   - alternates.languages 用 BCP47 标签,引导搜索引擎把它们当同一 page 的不同 locale 版本
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const altLangs = (path: string) => ({
    ...Object.fromEntries(LOCALES.map((l) => [LOCALE_HTML_TAG[l], `${base}/${l}${path}`])),
    "x-default": `${base}/${DEFAULT_LOCALE}${path}`,
  })

  const staticPaths: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/docs", priority: 0.9, freq: "weekly" },
    { path: "/examples", priority: 0.8, freq: "monthly" },
    { path: "/about", priority: 0.5, freq: "monthly" },
  ]

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale: Locale) =>
    staticPaths.map(({ path, priority, freq }) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: freq,
      priority,
      alternates: { languages: altLangs(path) },
    }))
  )

  const partRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale: Locale) =>
    PARTS.map((p) => ({
      url: `${base}/${locale}/docs/${p.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
      alternates: { languages: altLangs(`/docs/${p.id}`) },
    }))
  )

  /** 去重(同一 baseSlug 在 zh/en 各有一份),按 baseSlug 聚合后展开。 */
  const slugSet = new Set<string>((allDocs as { slug: string }[]).map((d) => d.slug))
  const docRoutes: MetadataRoute.Sitemap = []
  for (const slug of slugSet) {
    const updatedAt = (allDocs as { slug: string; updatedAt?: string }[]).find((d) => d.slug === slug)?.updatedAt
    for (const locale of LOCALES) {
      docRoutes.push({
        url: `${base}/${locale}/docs/${slug}`,
        lastModified: updatedAt ? new Date(updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: locale === DEFAULT_LOCALE ? 0.8 : 0.7,
        alternates: { languages: altLangs(`/docs/${slug}`) },
      })
    }
  }

  return [...staticRoutes, ...partRoutes, ...docRoutes]
}
