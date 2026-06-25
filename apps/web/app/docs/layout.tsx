import { allDocs } from "content-collections";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/docs/sidebar";
import { buildDocsTree, type DocItem } from "@/lib/docs-tree";

/**
 * 文档站三栏 layout:
 *   - 桌面:sidebar (左,可折叠) / 正文 / TOC (右,正文页里渲染)
 *   - 移动端:正文 + 顶部抽屉 sidebar(下个 PR 接 Sheet)
 *
 * 内化 baseline-ui:`h-dvh` 不用 `h-screen`,左右两栏 sticky 而非 fixed。
 */
export default function DocsLayout({ children }: { children: ReactNode }) {
  const tree = buildDocsTree(allDocs as unknown as DocItem[]);

  return (
    <div className="mx-auto grid max-w-(--container-doc) gap-8 px-6 py-10 md:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      <aside
        aria-label="文档章节"
        className="hidden md:block"
      >
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2">
          <Sidebar tree={tree} />
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
