import meta from "virtual:site-meta"

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>虚拟模块插件演示</h1>
  <p>构建时间: <code>${meta.buildTime}</code></p>
  <p>版本: <code>${meta.version}</code></p>
`

console.log("virtual:site-meta →", meta)
