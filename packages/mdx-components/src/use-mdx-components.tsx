/**
 * 暴露给 apps/web 的 mdx-components 注册函数。
 *
 * apps/web/mdx-components.tsx 会:
 *
 *   import { useMDXComponents as base } from "@vite-mastery/mdx-components/use-mdx-components";
 *   export function useMDXComponents(components) { return { ...base(), ...components }; }
 */

import type { MDXComponents } from "mdx/types";
import { Callout } from "./callout.tsx";
import { CodeBlock } from "./code-block.tsx";
import { CodeGroup } from "./code-group.tsx";
import { Detail } from "./detail.tsx";
import { Diff } from "./diff.tsx";
import { Steps } from "./steps.tsx";
import { Tabs } from "./tabs.tsx";

export function useMDXComponents(): MDXComponents {
  return {
    Callout,
    CodeBlock,
    CodeGroup,
    Detail,
    Diff,
    Steps,
    Tabs,
  };
}
