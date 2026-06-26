"use client"

import { useEffect, useState } from "react"

/** 客户端 mount 后返回 true,用于守卫浏览器专属渲染逻辑 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  return mounted
}
