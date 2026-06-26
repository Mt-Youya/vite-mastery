/**
 * SSR 环境入口(步骤 1 起点)。
 *
 * 在 Vite 8 Environment API 中,SSR 环境有独立的 moduleGraph,
 * 与 client 环境的模块图完全隔离。
 */
export async function render(_url: string): Promise<string> {
  return `<div id="root"><h1>SSR 渲染占位</h1></div>`
}
