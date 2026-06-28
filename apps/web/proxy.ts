/**
 * 路由级 i18n 代理 —— 接管无 locale 前缀路径到默认英文路径的重定向。
 *
 * 流程:
 *   1. 命中 `/en/...` 或 `/zh/...` 时直接放行
 *   2. 不带 locale 前缀的路径统一 308 到 `/${DEFAULT_LOCALE}/...`
 *
 * 这里不再读取 cookie / Accept-Language。默认入口必须稳定是英文;
 * 用户显式选择中文后,URL 本身会变成 `/zh/...`,不需要再靠 cookie 推断。
 * 排除 `_next` / `_pagefind` / `api` / 文件后缀类(/* 静态资源 *\/)与 metadata 文件(robots/sitemap)。
 *
 * Next.js 16: proxy.ts 取代了旧的 middleware.ts 约定,始终运行在 Node.js runtime 中。
 */
import { NextResponse, type NextRequest } from "next/server"
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/config"

const LOCALE_REGEX = new RegExp(`^/(${LOCALES.join("|")})(/|$)`)

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  /** 已经带 locale 前缀:直接放行。 */
  if (pathname.match(LOCALE_REGEX)) return NextResponse.next()

  /** 不带前缀:固定走默认 locale,保留 query。 */
  const url = req.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`
  url.search = search
  return NextResponse.redirect(url, 308)
}

export const config = {
  /**
   * 跳过:
   *  - /api/*
   *  - /_next/*(Next 内部资源)
   *  - /_pagefind/*(搜索索引)
   *  - /brand/*(品牌静态资源)
   *  - 任意带后缀的文件(.svg / .png / .ico / .xml / .txt 等)
   *  - robots.txt / sitemap.xml(都是带后缀的,被上面规则覆盖)
   */
  matcher: ["/((?!api|_next|_pagefind|brand|.*\\.[\\w]+$).*)"],
}
