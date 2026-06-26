/**
 * 暴露给 apps/web 的 mdx-components 注册函数。
 *
 * apps/web/mdx-components.tsx 会:
 *
 *   import { useMDXComponents as base } from "@vite-mastery/mdx-components/use-mdx-components";
 *   export function useMDXComponents(components) { return { ...base(), ...components }; }
 */

import type { ComponentPropsWithoutRef, ReactElement } from "react"
import type { MDXComponents } from "mdx/types"
import type { BundledLanguage } from "shiki"
import { Callout } from "./callout.tsx"
import { CodeBlock } from "./code-block.tsx"
import { CodeGroup } from "./code-group.tsx"
import { Detail } from "./detail.tsx"
import { Diff } from "./diff.tsx"
import { Steps } from "./steps.tsx"
import { Tabs } from "./tabs.tsx"
import { V7Note } from "./v7-note.tsx"

/**
 * 围栏代码块(``` ```lang ```)编译成 `<pre><code className="language-xxx">...</code></pre>`。
 * 拦截 pre,提取语言和源码,交给 Shiki CodeBlock 渲染。
 */
async function MdxPre({ children }: ComponentPropsWithoutRef<"pre">) {
  const child = children as ReactElement<{ children: string; className?: string }>
  const rawClass = (child as unknown as { props?: { className?: string } })?.props?.className ?? ""
  const lang = (rawClass.replace("language-", "") || "text") as BundledLanguage | "text"
  const code = (child as unknown as { props?: { children?: string } })?.props?.children ?? ""
  return <CodeBlock lang={lang}>{code}</CodeBlock>
}

export function useMDXComponents(): MDXComponents {
  return {
    pre: MdxPre as MDXComponents["pre"],
    Callout,
    CodeBlock,
    CodeGroup,
    Detail,
    Diff,
    Steps,
    Tabs,
    V7Note,
  }
}
