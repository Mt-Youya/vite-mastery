import type { Plugin } from "vite"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

interface I18nOptions {
  locale: string
  localeDir: string
}

const VIRTUAL_ID = "virtual:i18n"
const RESOLVED_ID = "\0" + VIRTUAL_ID

/**
 * i18n 注入插件演示。
 *
 * 同时展示:
 *  - resolveId + load(虚拟模块)
 *  - transformIndexHtml(修改 HTML)
 *  - configureServer(监听语言包文件变化)
 */
export function i18nPlugin(options: I18nOptions): Plugin {
  const { locale, localeDir } = options

  function loadMessages(): Record<string, string> {
    const filePath = resolve(localeDir, `${locale}.json`)
    if (!existsSync(filePath)) return {}
    return JSON.parse(readFileSync(filePath, "utf-8")) as Record<string, string>
  }

  return {
    name: "vite-plugin-i18n",

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
      return null
    },

    load(id) {
      if (id !== RESOLVED_ID) return null
      const messages = loadMessages()
      return `
const messages = ${JSON.stringify(messages)}
export default function t(key) {
  return messages[key] ?? key
}
`
    },

    transformIndexHtml(html) {
      // 注入 lang 属性
      return html.replace(/<html([^>]*)>/, `<html$1 lang="${locale}">`)
    },
  }
}
