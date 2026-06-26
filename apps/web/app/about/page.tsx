import type { Metadata } from "next"
import Link from "next/link"
import { SITE } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `关于 · ${SITE.name}`,
  description: "关于 vite-mastery——为什么写这个指南、作者是谁、如何贡献。",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">关于本站</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">为什么要写这个指南?</h1>
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          2026 年 3 月,Vite 8 正式发布。它带来了 Rolldown 统一打包器、Environment API、内置 Devtools
          等重磅变化——但中文社区的 Vite 教程大多还停留在 Vite 5 时代:配置 `vite.config.ts`、调 plugin 选项、跑 build。
        </p>

        <p>
          <strong>本站只做一件事</strong>:把 Vite 8 的核心黑盒拆开,讲清楚。
        </p>

        <h2>核心承诺</h2>

        <ul>
          <li>所有代码示例基于 Vite 8.1.x,真实可跑</li>
          <li>
            Vite 7 差异统一用 <code>&lt;V7Note&gt;</code> 折叠标注,正文只讲 Vite 8
          </li>
          <li>Environment API 相关内容标注 RC 阶段,不乱编 API</li>
          <li>10 个配套实战项目,带你从看懂到写出来</li>
        </ul>

        <h2>作者</h2>

        <p>
          <strong>{SITE.author.name}</strong>({SITE.author.handle}) —— {SITE.author.bio}
        </p>

        <p>
          长期在折腾构建工具和开发者体验。写这个指南一方面是自己系统学习 Vite 8
          的过程记录,另一方面是希望能帮助更多中文社区的工程师搞懂 Vite 的原理。
        </p>

        <h2>如何贡献</h2>

        <p>发现错误、有更好的解释方式、想补充实战项目?欢迎：</p>

        <ul>
          <li>
            <Link href={SITE.repo} target="_blank" rel="noopener noreferrer">
              提 Issue 或 PR
            </Link>
          </li>
          <li>直接联系作者:{SITE.author.handle}</li>
        </ul>

        <h2>技术栈</h2>

        <p>本站本身就是一个 Vite 8 生态实践的样板：</p>

        <ul>
          <li>Next.js 16 App Router + TypeScript 6</li>
          <li>Tailwind CSS v4(CSS-first)</li>
          <li>pnpm workspace + Turborepo</li>
          <li>content-collections + MDX</li>
          <li>Shiki 代码高亮(带 twoslash)</li>
          <li>部署在 Vercel</li>
        </ul>
      </div>

      <div className="mt-16 flex flex-wrap gap-4">
        <Link
          href="/docs"
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          开始阅读文档
        </Link>
        <Link
          href={SITE.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-fg-muted hover:text-fg hover:border-border-strong transition-colors"
        >
          GitHub →
        </Link>
      </div>
    </div>
  )
}
