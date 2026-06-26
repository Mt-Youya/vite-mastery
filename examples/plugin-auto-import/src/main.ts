// auto-import 演示:直接使用 ref / computed,无需手动 import
// 插件会自动检测并注入:import { ref, computed } from "vue"

const count = ref(0)
const doubled = computed(() => count.value * 2)

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <h1>Auto Import 插件演示</h1>
  <p>count = ${count.value}</p>
  <p>doubled = ${doubled.value}</p>
  <p>查看控制台:插件已自动注入 import 语句。</p>
`

console.log("count:", count.value, "| doubled:", doubled.value)
