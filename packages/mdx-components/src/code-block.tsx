/**
 * <CodeBlock lang="ts" filename="vite.config.ts"> source </CodeBlock>
 *
 * 服务端组件:在 RSC 阶段就把 Shiki HTML 算好,客户端只挂个 copy 按钮的 island。
 */

import type { BundledLanguage } from "shiki";
import { CodeBlockContainer } from "@vite-mastery/ui";
import { highlight } from "./shiki.ts";
import { CodeCopyButton } from "./code-copy-button.tsx";

interface CodeBlockProps {
  lang?: BundledLanguage | "text";
  filename?: string;
  /** 区分普通代码块与 diff 视觉差异 */
  kind?: "default" | "diff";
  /** 高亮某些行,比如 "1,3-5" */
  highlight?: string;
  children: string;
}

export async function CodeBlock({
  lang = "text",
  filename,
  kind = "default",
  highlight: highlightRange,
  children,
}: CodeBlockProps) {
  const code = children.trimEnd();
  const html = await highlight(code, lang);

  return (
    <CodeBlockContainer
      filename={filename}
      lang={typeof lang === "string" ? lang : undefined}
      variant={kind}
      copySlot={<CodeCopyButton code={code} />}
      data-highlight={highlightRange}
    >
      <div className="shiki-host" dangerouslySetInnerHTML={{ __html: html }} />
    </CodeBlockContainer>
  );
}
