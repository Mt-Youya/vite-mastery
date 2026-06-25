/**
 * MDX 全局组件注入。Next.js App Router 会在 `.mdx` 渲染时调用这里。
 */
import { useMDXComponents as baseMDXComponents } from "@vite-mastery/mdx-components/use-mdx-components";
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...baseMDXComponents(),
    ...components,
  };
}
