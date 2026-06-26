// 导入一张图片演示优化效果
import viteLogo from "./assets/vite.svg"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>图片优化插件演示</h1>
  <p>执行 pnpm build 后查看 dist/assets/ 目录,确认 WebP / AVIF 产物。</p>
  <img src="${viteLogo}" alt="Vite Logo" width="128" />
`
