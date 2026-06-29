import type { Viewport } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { THEME_STORAGE_KEY } from "@/layout/theme-constants"
import { DEFAULT_LOCALE, LOCALE_HTML_TAG } from "@/i18n/config"
import "./[lang]/styles/globals.css"

/**
 * 真正的 root layout —— 只承担 <html>/<body>/字体/主题预绘脚本,
 * 不依赖任何 locale 段。跨 `/zh` ↔ `/en` 切换时,这一层不卸载,
 * 浏览器永远有一棵稳定的文档树,白闪才能被彻底消掉。
 *
 * `<html lang>` 这里只能给一个默认值(SSR 时无法读到 [lang] 段),
 * 客户端通过 `<HtmlLangSync>` 在子 layout 里再纠正成当前 locale。
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(0.984 0.003 247.86)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.16 0.012 265)" },
  ],
}

const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("${THEME_STORAGE_KEY}") || "system";
    var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var theme = stored === "system" ? system : stored;
    if (theme !== "light" && theme !== "dark") theme = system;
    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  } catch (_) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={LOCALE_HTML_TAG[DEFAULT_LOCALE]}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        {/* 必须 inline 同步执行,确保首屏 paint 前主题 class 就位 */}
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: theme init must run sync before paint
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">{children}</body>
    </html>
  )
}
