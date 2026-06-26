/**
 * @vite-mastery/ui 公开 API。
 *
 * 设计:
 *   - 原子组件直接命名导出:Button、IconButton、Switch、Toggle、Separator
 *   - 复合组件以命名空间导出:Dialog、Sheet、Popover、Tooltip、Tabs、Select、Combobox、ScrollArea、Collapsible
 *   - 工具函数:cn
 *   - 容器:CodeBlockContainer
 */

export { cn } from "./lib/utils"

export { Button, buttonVariants, type ButtonProps } from "./components/button"
export { IconButton, type IconButtonProps } from "./components/icon-button"

export { Dialog } from "./components/dialog"
export { Sheet } from "./components/sheet"
export { Popover } from "./components/popover"
export { Tooltip } from "./components/tooltip"
export { Tabs } from "./components/tabs"
export { Select } from "./components/select"
export { Combobox } from "./components/combobox"
export { ScrollArea } from "./components/scroll-area"
export { Collapsible } from "./components/collapsible"

export { Toggle } from "./components/toggle"
export { Switch } from "./components/switch"
export { Separator } from "./components/separator"

export { CodeBlockContainer } from "./components/code-block-container"
