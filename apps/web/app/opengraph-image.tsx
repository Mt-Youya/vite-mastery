import { ImageResponse } from "next/og"
import { SITE } from "@/lib/site-config"

export const runtime = "edge"
export const contentType = "image/png"
export const size = { width: 1200, height: 630 }
export const alt = SITE.title

/**
 * 默认 OG 图:1200×630,用于分享到社交媒体。
 * 路由级 OG 图覆盖此默认值。
 */
export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "#0f172a",
        fontFamily: "sans-serif",
      }}
    >
      {/* 品牌色上方装饰条 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "linear-gradient(90deg, #ff9500 0%, #f97316 100%)",
        }}
      />

      {/* Vite flame 标识 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 10,
            background: "#ff9500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          ⚡
        </div>
        <span style={{ color: "#94a3b8", fontSize: 18, letterSpacing: "0.1em" }}>vite-mastery.dev</span>
      </div>

      {/* 主标题 */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: "#f8fafc",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          maxWidth: 900,
        }}
      >
        搞懂 Vite 8,
        <br />
        <span style={{ color: "#ff9500" }}>从 Rolldown 到 Environment API。</span>
      </div>

      {/* 副标题 */}
      <div
        style={{
          marginTop: 28,
          fontSize: 24,
          color: "#94a3b8",
          lineHeight: 1.5,
          maxWidth: 800,
        }}
      >
        中文社区第一份系统化 Vite 8 学习指南 · Rolldown 架构 · Environment API · Hooks 时序 · 10 个实战项目
      </div>

      {/* 底部作者信息 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#334155",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          J
        </div>
        <span style={{ color: "#64748b", fontSize: 16 }}>
          {SITE.author.name} · {SITE.author.handle}
        </span>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
