/**
 * @vite-mastery/ui 公开 API。
 *
 * 设计:
 *   - 原子组件直接命名导出:Button、IconButton、Switch、Toggle、Separator
 *   - 复合组件以命名空间导出:Dialog、Sheet、Popover、Tooltip、Tabs、Select、Combobox、ScrollArea
 *   - 工具函数:cn
 *   - 容器:CodeBlockContainer
 */

export { cn } from "./lib/cn.ts";

export { Button, buttonVariants, type ButtonProps } from "./button.tsx";
export { IconButton, type IconButtonProps } from "./icon-button.tsx";

export { Dialog } from "./dialog.tsx";
export { Sheet } from "./sheet.tsx";
export { Popover } from "./popover.tsx";
export { Tooltip } from "./tooltip.tsx";
export { Tabs } from "./tabs.tsx";
export { Select } from "./select.tsx";
export { Combobox } from "./combobox.tsx";
export { ScrollArea } from "./scroll-area.tsx";

export { Toggle } from "./toggle.tsx";
export { Switch } from "./switch.tsx";
export { Separator } from "./separator.tsx";

export { CodeBlockContainer } from "./code-block-container.tsx";
