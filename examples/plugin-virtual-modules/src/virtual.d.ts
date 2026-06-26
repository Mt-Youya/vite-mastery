declare module "virtual:site-meta" {
  export const buildTime: string
  export const version: string
  const meta: { buildTime: string; version: string }
  export default meta
}
