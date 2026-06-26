"use client"

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"
import { IconButton } from "@vite-mastery/ui"

interface CodeCopyButtonProps {
  code: string
}

export function CodeCopyButton({ code }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      const timer = window.setTimeout(() => (setCopied(false), clearTimeout(timer)), 1600)
    } catch (err) {
      // 不静默,但也不要弹 alert 烦人;打到 console 即可
      console.error("[CodeCopyButton] clipboard 写入失败", err)
    }
  }

  return (
    <IconButton aria-label={copied ? "已复制" : "复制代码"} onClick={handleCopy} size="sm" variant="ghost">
      <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} className="size-4" strokeWidth={1.5} aria-hidden />
    </IconButton>
  )
}
