# @vite-mastery/tailwind-config

Shared Tailwind CSS v4 theme package for Vite Mastery. It uses the CSS-first Tailwind v4 model instead of a JavaScript config file.

## Usage

```css
/* apps/web/app/[lang]/styles/globals.css */
@import "tailwindcss";
@import "@vite-mastery/tailwind-config/theme.css";
@import "@vite-mastery/tailwind-config/base.css";
```

## Token Direction

| Category      | Choice                                   | Reason                                                   |
| ------------- | ---------------------------------------- | -------------------------------------------------------- |
| Brand color   | Warm amber-orange `oklch(0.685 0.18 55)` | References Vite's flame while staying calmer in prose UI |
| Accent color  | Cool iris `oklch(0.555 0.19 285)`        | Creates contrast for links and focus rings               |
| Neutral scale | Slate                                    | Works well for long-form documentation contrast          |
| Color space   | OKLCH                                    | More stable perceived lightness across dark mode         |
| Fonts         | Inter Variable and Geist Mono            | Clean reading text and precise code rendering            |

## Dark Mode

Dark mode rewrites semantic aliases such as `--color-bg` and `--color-fg`. Raw color scales stay stable. Components should use semantic utilities like `bg-bg` and `text-fg-muted` instead of hard-coded scale values such as `bg-slate-100`.
