/**
 * MDX 全局组件注入。Next.js App Router 会在 `.mdx` 渲染时调用这里。
 *
 * baseMDXComponents:通用组件(Callout/CodeBlock/V7Note 等)
 * 此处追加 apps/web 独有的交互式组件(HookExplorer/PluginPipeline 等)
 */
import { useMDXComponents as baseMDXComponents } from "@vite-mastery/mdx-components"
import type { MDXComponents } from "mdx/types"
import { BundlerCompare } from "@/components/interactive/bundler-compare"
import { HookExplorer } from "@/components/interactive/hook-explorer"
import { PluginPipeline } from "@/components/interactive/plugin-pipeline"
import { HmrDemo } from "@/components/interactive/hmr-demo"
import { EnvironmentExplorer } from "@/components/interactive/environment-explorer"
import { ConfigPlayground } from "@/components/interactive/config-playground"
import { DepGraph } from "@/components/interactive/dep-graph"
import { LocalizedV7Note } from "@/components/mdx/localized-v7-note"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...baseMDXComponents(),
    BundlerCompare,
    HookExplorer,
    PluginPipeline,
    HmrDemo,
    EnvironmentExplorer,
    ConfigPlayground,
    DepGraph,
    V7Note: LocalizedV7Note,
    ...components,
  }
}
