/**
 * <Diff> 用 Shiki 的 transformerNotationDiff 渲染。
 * 这里只是给 MDX 一个语义化标签,真正的着色在 CodeBlock + transformer 里完成。
 *
 * 用法:
 *   <Diff lang="ts">
 *     {`function foo() {
 *   const a = 1; // [!code --]
 *   const a = 2; // [!code ++]
 *     }`}
 *   </Diff>
 */

import type { BundledLanguage } from "shiki";
import { CodeBlock } from "./code-block.tsx";

interface DiffProps {
  lang?: BundledLanguage;
  filename?: string;
  children: string;
}

export function Diff({ lang = "tsx", filename, children }: DiffProps) {
  return (
    <CodeBlock lang={lang} filename={filename} kind="diff">
      {children}
    </CodeBlock>
  );
}
