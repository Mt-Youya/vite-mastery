import type { Plugin } from "vite"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const VIRTUAL_ID = "virtual:site-meta"
const RESOLVED_ID = "\0" + VIRTUAL_ID

/**
 * 演示插件:通过 resolveId + load 实现虚拟模块。
 *
 * 在 MDX 中讲解:为什么要加 \0 前缀?Vite 如何区分虚拟模块与真实文件?
 */
export function virtualSiteMeta(): Plugin {
  return {
    name: "vite-plugin-virtual-site-meta",

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
      return null
    },

    load(id) {
      if (id !== RESOLVED_ID) return null

      const pkg = JSON.parse(readFileSync(resolve("package.json"), "utf-8")) as { version?: string }

      return `
export const buildTime = ${JSON.stringify(new Date().toISOString())}
export const version = ${JSON.stringify(pkg.version ?? "0.0.0")}

export default { buildTime, version }
`
    },
  }
}
