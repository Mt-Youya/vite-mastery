import Post from "./posts/hello.md"

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Markdown 加载器演示</h1>
      <hr />
      <Post />
    </div>
  )
}
