/**
 * RSC 环境专属组件(步骤 2 起点)。
 *
 * 这个文件只在 rsc 环境中运行,可以直接访问数据库 / 文件系统。
 * Client 环境无法导入此模块(Environment 边界隔离)。
 *
 * ⚠️ 此为演示骨架。RSC 运行时集成需要框架层支持。
 */
export async function ServerComponent() {
  // TODO: 步骤 3 — 通过 ModuleRunner 在 rsc 环境执行并序列化结果
  const data = { message: "来自 RSC 环境的数据", timestamp: Date.now() }
  return <div data-rsc>{JSON.stringify(data)}</div>
}
