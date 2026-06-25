/**
 * 内容元数据 schema。
 *
 * zod v4 实现了 Standard Schema spec,可以直接传给 content-collections
 * 的 `schema` 字段(它要求 StandardSchemaV1)。
 */

import { z } from "zod";

/** 章节归属(Part 0 ~ Part 11) */
export const PART_KEYS = [
  "00-getting-started",
  "01-core-concepts",
  "02-plugin-system",
  "03-hooks-deep-dive",
  "04-hmr",
  "05-build-pipeline",
  "06-ssr-ssg",
  "07-framework-integration",
  "08-library-mode",
  "09-monorepo",
  "10-performance",
  "11-real-world-plugins",
] as const;

export type PartKey = (typeof PART_KEYS)[number];

/** docs collection 的 frontmatter 形状 */
export const docFrontmatter = z.object({
  title: z.string().min(2),
  description: z.string().min(8),
  /** 同一 part 内的排序权重,越小越靠前 */
  order: z.number().int().nonnegative(),
  /** 所属章节 key(必须命中 PART_KEYS) */
  part: z.enum(PART_KEYS),
  /** 章节内章节号,比如 "2.4" */
  chapter: z.string().regex(/^\d+\.\d+$/, "形如 1.2 / 3.7"),
  /** 难度:⭐~⭐⭐⭐⭐ */
  difficulty: z.number().int().min(1).max(4).default(1),
  /** 预计阅读时长(分钟) */
  readingTime: z.number().int().positive().optional(),
  authors: z.array(z.string()).default(["Jay"]),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD"),
  /** 是否草稿(草稿不出现在 sidebar) */
  draft: z.boolean().default(false),
  /** 关联的实战项目目录名 */
  example: z.string().optional(),
});

/** examples collection 的 frontmatter 形状 */
export const exampleFrontmatter = z.object({
  title: z.string().min(2),
  description: z.string().min(8),
  /** 关联章节,比如 "2.4" */
  relatedChapter: z.string().regex(/^\d+\.\d+$/),
  /** 难度 1~4 */
  difficulty: z.number().int().min(1).max(4),
  /** 仓库内相对路径,比如 examples/plugin-virtual-modules */
  repoPath: z.string(),
  /** 学完产出 */
  outcome: z.string().min(8),
  tags: z.array(z.string()).default([]),
});

export type DocFrontmatter = z.infer<typeof docFrontmatter>;
export type ExampleFrontmatter = z.infer<typeof exampleFrontmatter>;
