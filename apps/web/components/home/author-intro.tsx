import { SITE } from "@/lib/site-config";

/**
 * 作者介绍 —— 克制的小窄栏,不做大头像 hero。
 */
export function AuthorIntro() {
  return (
    <section className="mx-auto max-w-(--container-prose) px-6 py-24">
      <p className="font-mono text-xs tracking-wider text-fg-subtle uppercase">关于作者</p>

      <blockquote className="mt-6 font-display text-2xl leading-snug tracking-tight text-balance md:text-3xl">
        「写一份自己希望两年前能读到的指南。」
      </blockquote>

      <p className="mt-6 text-sm leading-relaxed text-pretty text-fg-muted">
        Jay(Yonjay)是一位前端工程师,长期在做构建工具与开发者体验。这本指南源于一个观察:Vite 已经普及,但真正理解它内部机制的中文资料非常稀少。
      </p>

      <div className="mt-6 flex items-center gap-4 text-sm text-fg-muted">
        <span className="font-medium text-fg">{SITE.author.name}</span>
        <span className="text-fg-subtle">·</span>
        <span className="font-mono text-xs">{SITE.author.handle}</span>
      </div>
    </section>
  );
}
