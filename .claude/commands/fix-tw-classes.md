# Fix Tailwind Arbitrary Variant Classes

扫描项目里所有可以简化的 Tailwind class 写法，判断哪些有官方简写，然后直接修改。

## 步骤

### 1. 收集所有可能可简写的 class（五类）

**1a. 任意变体 `xxx-[yyy]:`（条件修饰符，末尾有冒号）**

```bash
grep -roh '\b[a-zA-Z][a-zA-Z0-9_-]*-\[[^\]]*\]:' \
  apps packages \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=.turbo \
  | sort -u
```

**1b. CSS 变量短语法 `xxx-(--yyy)`**

```bash
grep -roh '[a-zA-Z][a-zA-Z0-9_-]*-(--[a-zA-Z][a-zA-Z0-9_-]*)' \
  apps packages \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=.turbo \
  | sort -u
```

**1c. var() 包装的变量引用 `xxx-[var(--yyy)]`**

```bash
grep -roh '[a-zA-Z][a-zA-Z0-9_-]*-\[var(--[a-zA-Z][a-zA-Z0-9_-]*)[/0-9]*\]' \
  apps packages \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=.turbo \
  | sort -u
```

**1d. 任意数值 `[Nrem]` / `[Npx]`**

```bash
grep -roh '[a-zA-Z][a-zA-Z0-9_-]*-\[[0-9][0-9.]*\(rem\|px\)\]' \
  apps packages \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=.turbo \
  | sort -u
```

**1e. 已废弃的 utility 名**

```bash
grep -roh '\bflex-shrink[0-9-]*\b\|\bflex-grow[0-9-]*\b\|\boverflow-ellipsis\b' \
  apps packages \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=dist --exclude-dir=.turbo \
  | sort -u
```

### 2. 分析哪些可以简写

**1a 任意变体 `xxx-[content]:`：**

- `content` **不含** `=`（纯属性名，如 `data-[selected]:`）→ 可简写为 `data-selected:`
- `content` **含** `=`（如 `data-[state=open]:`）→ **不能简写**，保持原样
- `content` **含** `.` 或 `:`（CSS 选择器/属性值）→ 保持原样

**1b CSS 变量短语法 `xxx-(--yyy)`：**

查看 `packages/tailwind-config/theme.css` 的 `@theme` 定义：

- `max-w-(--container-doc)` → `max-w-doc` ✅（`--container-doc` 在 `@theme` 中有对应 token）
- `h-(--collapsible-panel-height)` → 保持原样（Base UI 运行时变量，非 `@theme` token）

**1c var() 包装 `xxx-[var(--yyy)]`：**

- `--color-X-N` 型（颜色 token）→ 直接写 token 名：`text-[var(--color-brand-700)]` → `text-brand-700`
- `--ease-X` 型（缓动 token）→ `ease-[var(--ease-out-quart)]` → `ease-out-quart`
- 其他自定义变量 → 至少去掉 `var()` 包装：`h-[var(--X)]` → `h-(--X)`

**1d 任意数值 `[Nrem]` / `[Npx]`：**

- rem 值：`N rem ÷ 0.25 = 整数或 .5` → 可换为 Tailwind 数字（如 `10rem → 40`）
- px 值：`N px ÷ 4 = 整数` → 只在 IntelliSense 明确提示时才换，否则 px 更直观
- 自定义 token：`text-[11px]` → `text-2xs`（需要对照 `@theme` 的 `--text-*` 定义）

**1e 废弃 utility：**

- `flex-shrink-0` → `shrink-0`，`flex-grow` → `grow`（Tailwind v3→v4 更名）

### 3. 执行替换

优先使用 `pnpm fix:tw`（已内置 14 条规则，覆盖以上大部分情况）：

```bash
pnpm fix:tw
```

对 `pnpm fix:tw` 未覆盖的新模式，用 sed 或 Edit 工具针对性修改，并将规则追加到
`scripts/fix-tw-classes.ts` 的 `TRANSFORMS` 数组中。

### 4. 验证

```bash
pnpm --filter @vite-mastery/web typecheck
```

报告：修改了哪些文件、共多少处、哪些模式保持了原样及原因。

## 注意事项

- 只替换**确定安全**的模式，不确定的保持原样并在报告中注明
- 不替换带有 `=` 的任意变体（`data-[state=open]:`）
- 不替换含 CSS 选择器的写法（`group-[.sidebar-open]:`）
- px 值：**优先保留**，仅在 IntelliSense 明确提示或 `@theme` 有对应 token 时才换
- Base UI / 第三方库注入的运行时 CSS 变量（如 `--anchor-width`、`--collapsible-panel-height`）不替换
