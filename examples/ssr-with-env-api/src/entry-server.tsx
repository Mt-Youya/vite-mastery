import { renderToString } from "react-dom/server"
import { App } from "./App"

export async function render(_url: string): Promise<string> {
  return renderToString(<App />)
}
