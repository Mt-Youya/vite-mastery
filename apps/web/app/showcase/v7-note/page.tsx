import { V7Note } from "@vite-mastery/mdx-components"

export default function V7NoteShowcase() {
  return (
    <div className="max-w-2xl">
      <h2 className="mb-6 font-display text-xl font-semibold">{"<V7Note>"} · 折叠行为差异</h2>

      <V7Note title="Vite 7:dev 和 build 使用不同引擎">
        <p className="mb-3">
          在 Vite 7 中,dev 模式使用 <code>esbuild</code> 做 transform,build 模式使用 <code>Rollup</code>{" "}
          打包。两套引擎的行为差异会体现在:
        </p>
        <ul className="list-disc space-y-1 pl-4">
          <li>部分 Rollup 插件在 dev 模式下无法生效(因为 esbuild 不走 Rollup 钩子)</li>
          <li>
            <code>treeshake</code> 配置只影响 build,dev 阶段不 tree-shake
          </li>
          <li>
            CommonJS 模块在 dev 下由 <code>vite:commonjs</code> 插件处理,build 下由 Rollup 的{" "}
            <code>@rollup/plugin-commonjs</code> 处理
          </li>
        </ul>
        <p className="mt-3 text-fg-subtle text-sm">
          迁移到 Vite 8:Rolldown 统一了两阶段,上述差异消失。检查你的插件是否依赖 esbuild 特有行为。
        </p>
      </V7Note>

      <V7Note title="Vite 7:import.meta.glob 不支持 eager + as 组合">
        <p>
          Vite 7.x 中,<code>import.meta.glob("**", {"{ eager: true, as: 'raw' }"})</code> 会抛错。 需要分两步:先 eager
          import,再手动读取内容。
        </p>
        <p className="mt-2 text-fg-subtle text-sm">Vite 8 修复了此问题,两者可以同时使用。</p>
      </V7Note>

      <V7Note>这是一个使用默认标题的 V7Note,标题为"Vite 7 行为差异"。适合简短说明一行差异点。</V7Note>
    </div>
  )
}
