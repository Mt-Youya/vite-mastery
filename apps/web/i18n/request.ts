/**
 * next-intl 的 getRequestConfig 入口。
 *
 * 每个 RSC 请求都会调用一次,根据当前 [lang] 段把对应的 messages 加载好。
 * 落到 en / zh 之外时回退到 DEFAULT_LOCALE,不抛 404。
 */
import { getRequestConfig } from "next-intl/server"
import { DEFAULT_LOCALE, isLocale } from "./config"

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = isLocale(requested) ? requested : DEFAULT_LOCALE
  const messages = (await import(`../messages/${locale}.json`)).default
  return {
    locale,
    messages,
  }
})
