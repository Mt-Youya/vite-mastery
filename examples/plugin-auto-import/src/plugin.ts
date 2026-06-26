import type { Plugin } from "vite"
import { writeFileSync } from "node:fs"
import { resolve } from "node:path"

interface AutoImportOptions {
  /** 模块路径 → 导出 API 列表的映射 */
  imports: Record<string, string[]>
  /** 类型声明文件输出路径 */
  dts?: string
}

/**
 * 简化版 auto-import 插件。
 *
 * 综合使用:transform / resolveId / load / generateBundle / configureServer
 */
export function autoImport(options: AutoImportOptions): Plugin {
  const { imports, dts } = options

  // 构建反向查找表:API 名称 → 来源模块
  const apiToModule = new Map<string, string>()
  for (const [module, apis] of Object.entries(imports)) {
    for (const api of apis) {
      apiToModule.set(api, module)
    }
  }

  // 记录实际用到的 API(用于生成 .d.ts)
  const usedApis = new Set<string>()

  return {
    name: "vite-plugin-auto-import",

    transform(code, id) {
      // 只处理 TS/JS 文件
      if (!/\.(ts|tsx|js|jsx|vue)$/.test(id)) return null
      // 跳过 node_modules
      if (id.includes("node_modules")) return null

      const neededImports: Record<string, string[]> = {}

      // 扫描代码中用到的 API(简化:正则识别标识符)
      for (const [api, module] of apiToModule) {
        // 正则:出现在非 import 语句、非 "." 后面的位置
        const used = new RegExp(`(?<![.'"\\w])\\b${api}\\b(?!\\s*:)`).test(code)
        if (!used) continue

        // 检查是否已有 import
        const alreadyImported = new RegExp(`import\\s*{[^}]*\\b${api}\\b[^}]*}\\s*from\\s*["']${module}["']`).test(code)
        if (alreadyImported) continue

        if (!neededImports[module]) neededImports[module] = []
        neededImports[module].push(api)
        usedApis.add(api)
      }

      if (Object.keys(neededImports).length === 0) return null

      // 生成 import 语句,插入到文件开头
      const importStatements = Object.entries(neededImports)
        .map(([mod, apis]) => `import { ${apis.join(", ")} } from "${mod}"`)
        .join("\n")

      return {
        code: `${importStatements}\n${code}`,
        map: null,
      }
    },

    buildEnd() {
      if (!dts) return

      // 生成 .d.ts 声明文件
      const declarations = [...usedApis]
        .map((api) => {
          const mod = apiToModule.get(api)!
          return `declare const ${api}: typeof import("${mod}")["${api}"]`
        })
        .join("\n")

      const content = `// 由 vite-plugin-auto-import 自动生成,勿手动修改\nexport {}\n\ndeclare global {\n${declarations
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n")}\n}\n`

      try {
        writeFileSync(resolve(dts), content, "utf-8")
      } catch {
        // 构建时输出路径可能不存在,忽略
      }
    },
  }
}
