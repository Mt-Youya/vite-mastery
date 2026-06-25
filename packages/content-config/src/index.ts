/**
 * vite-mastery 的 content-collections 配置工厂。
 *
 * apps/web 在自己的 content-collections.ts 里调用:
 *
 *   import { defineContentConfig } from "@vite-mastery/content-config";
 *   import remarkGfm from "remark-gfm";
 *   import rehypeSlug from "rehype-slug";
 *
 *   export default defineContentConfig({
 *     remarkPlugins: [remarkGfm],
 *     rehypePlugins: [rehypeSlug],
 *   });
 */

import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import type { Options as MdxOptions } from "@content-collections/mdx";
import { docFrontmatter, exampleFrontmatter } from "./schemas.ts";

export * from "./schemas.ts";

interface DefineOptions {
  /**
   * 相对 `apps/web/` 根目录的 content 目录路径。
   * 默认值假设站点在 monorepo 标准位置:`../../content`
   */
  contentDir?: string;
  /** 同理 examples 目录路径。 */
  examplesDir?: string;
  /** remark 插件,会同时应用到 docs 和 examples。 */
  remarkPlugins?: MdxOptions["remarkPlugins"];
  /** rehype 插件,会同时应用到 docs 和 examples。 */
  rehypePlugins?: MdxOptions["rehypePlugins"];
}

type SerializableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SerializableValue[]
  | { [key: string]: SerializableValue };

type ContentMeta = {
  [key: string]: SerializableValue;
  filePath: string;
  fileName: string;
  directory: string;
  extension: string;
  path: string;
};

type DocDocument = {
  [key: string]: SerializableValue;
  title: string;
  description: string;
  order: number;
  part: string;
  chapter: string;
  difficulty: number;
  readingTime: number | undefined;
  authors: string[];
  updatedAt: string;
  draft: boolean;
  example: string | undefined;
  content: string;
  _meta: ContentMeta;
  body: string;
  slug: string;
  url: string;
  headings: Heading[];
};

type ExampleDocument = {
  [key: string]: SerializableValue;
  title: string;
  description: string;
  relatedChapter: string;
  difficulty: number;
  repoPath: string;
  outcome: string;
  tags: string[];
  content: string;
  _meta: ContentMeta;
  body: string;
  slug: string;
  url: string;
};

export function defineContentConfig(options: DefineOptions = {}) {
  const contentDir = options.contentDir ?? "../../content";
  const examplesDir = options.examplesDir ?? "../../examples";
  const mdxOptions = {
    remarkPlugins: options.remarkPlugins,
    rehypePlugins: options.rehypePlugins,
  };

  const docs = defineCollection({
    name: "docs",
    directory: contentDir,
    include: "**/*.mdx",
    schema: docFrontmatter,
    transform: async (doc, ctx): Promise<DocDocument> => {
      const body = await compileMDX(ctx, doc, mdxOptions);
      const slug = doc._meta.path.replace(/\\/g, "/");
      /** 章节 part key + 文件相对路径形成 URL 路径,例如 docs/00-getting-started/01-why-vite */
      return {
        title: doc.title,
        description: doc.description,
        order: doc.order,
        part: doc.part,
        chapter: doc.chapter,
        difficulty: doc.difficulty,
        readingTime: doc.readingTime,
        authors: doc.authors,
        updatedAt: doc.updatedAt,
        draft: doc.draft,
        example: doc.example,
        content: doc.content,
        _meta: doc._meta,
        body,
        slug,
        url: `/docs/${slug}`,
        /** 从正文里挖出 h2/h3 给 TOC 用 */
        headings: extractHeadings(doc.content),
      };
    },
  });

  const examples = defineCollection({
    name: "examples",
    directory: examplesDir,
    include: "*/README.mdx",
    schema: exampleFrontmatter,
    transform: async (doc, ctx): Promise<ExampleDocument> => {
      const body = await compileMDX(ctx, doc, mdxOptions);
      const slug = doc._meta.path.replace(/\/README$/, "").replace(/\\/g, "/");
      return {
        title: doc.title,
        description: doc.description,
        relatedChapter: doc.relatedChapter,
        difficulty: doc.difficulty,
        repoPath: doc.repoPath,
        outcome: doc.outcome,
        tags: doc.tags,
        content: doc.content,
        _meta: doc._meta,
        body,
        slug,
        url: `/examples/${slug}`,
      };
    },
  });

  return defineConfig({
    content: [docs, examples],
  });
}

/**
 * 从 MDX 正文里提取 h2 / h3 给 TOC。简单 regex,不解析 AST。
 *   - 跳过 ``` 代码块里的 #
 *   - 自动生成 slug(与 rehype-slug 一致的简化版,用于客户端定位)
 */
export interface Heading {
  [key: string]: SerializableValue;
  level: 2 | 3;
  text: string;
  id: string;
}

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const lines = content.split("\n");
  let inFence = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const marker = m[1];
    const rawText = m[2];
    if (!marker || !rawText) continue;
    const level = marker.length as 2 | 3;
    const text = rawText.replace(/`([^`]+)`/g, "$1").trim();
    headings.push({ level, text, id: slugify(text) });
  }
  return headings;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}
