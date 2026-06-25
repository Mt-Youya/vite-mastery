/**
 * Why Vite —— 不用 3 等大 card 阵列(impeccable 反 identical-card-grids)。
 * 改用左标题、右问答对的编辑型 split,问题之间 `divide-y` 分隔。
 */
export function WhyVite() {
  return (
    <section className="border-y border-border bg-bg-subtle/30">
      <div className="mx-auto grid max-w-(--container-doc) gap-12 px-6 py-20 md:grid-cols-[1fr_2fr] md:gap-16 md:py-28">
        <header>
          <p className="text-xs font-medium tracking-wider text-fg-subtle uppercase">
            为什么读这本书
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
            「会用」和「懂为什么」之间,差着这本书。
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-pretty text-fg-muted">
            中文社区的 Vite 教程大多停在配置层面。本指南把那些"黑盒"全部拆开。
          </p>
        </header>

        <ul className="divide-y divide-border text-base">
          {QUESTIONS.map((q) => (
            <li key={q.q} className="grid gap-2 py-5 first:pt-0 last:pb-0 md:grid-cols-[1fr_auto]">
              <p className="font-medium text-fg">{q.q}</p>
              <p className="text-sm text-fg-muted md:text-right">{q.a}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const QUESTIONS = [
  {
    q: "为什么 Vite 在 dev 模式不打包?",
    a: "ESM + 浏览器原生 import · Part 1",
  },
  {
    q: "resolveId / load / transform 各自什么时机触发?",
    a: "Hooks 时序图 · Part 3",
  },
  {
    q: "import.meta.hot 背后的 WebSocket 协议长什么样?",
    a: "HMR 协议拆解 · Part 4",
  },
  {
    q: "pre / 默认 / post 顺序如何影响插件行为?",
    a: "插件执行顺序 · Part 2",
  },
  {
    q: "为什么 build 用 Rollup 而不是 esbuild?",
    a: "双引擎架构 · Part 1",
  },
] as const;
