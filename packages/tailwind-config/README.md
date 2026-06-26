# @vite-mastery/tailwind-config

Tailwind v4 CSS-first 共享主题。

## 用法

```css
/* apps/web/app/globals.css */
@import "tailwindcss";
@import "@vite-mastery/tailwind-config/theme.css";
@import "@vite-mastery/tailwind-config/base.css";
```

## Token 设计倾向

| 类别          | 选型                               | 理由                                                          |
| ------------- | ---------------------------------- | ------------------------------------------------------------- |
| 主色 brand    | 琥珀暖橙(`oklch(0.685 0.18 55)`)   | 向 Vite Flame 致敬,但比官方 `#FFD028` 克制,作为正文背景不刺眼 |
| 强调色 accent | 冷紫 iris(`oklch(0.555 0.19 285)`) | 与暖主色对比明显,适合链接 / 焦点环                            |
| 中性色        | slate                              | 偏蓝中性,文档站正文 contrast 友好                             |
| 色彩空间      | OKLCH                              | v4 推荐,且 dark mode 切换时亮度感知更稳定                     |
| 字体          | Inter Variable + Geist Mono        | display/sans 统一,代码用 Geist Mono                           |

## 待办

> [!NOTE]
> 当前 token 是 "合理默认",并未经过 `gpt-taste` 精修。如需统一品牌色定调,后续应:
>
> 1. 跑 `gpt-taste` 重新拍 brand 中段(500/600)
> 2. 检查 OKLCH 在 sRGB 范围内的 fallback
> 3. 锁定字号节奏到具体 px 单位

## 与暗色模式

通过 `@variant dark` 重写**语义别名**(`--color-bg` / `--color-fg` 等),原始 50~950 色阶不动。组件应当用语义别名(`bg-bg`、`text-fg-muted`),不要直接拿 `bg-slate-100`。
