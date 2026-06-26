# @vite-mastery/ui

vite-mastery 内部组件库。**底层 primitive = Base UI**(`@base-ui/react`),设计 token 来自 `@vite-mastery/tailwind-config`。

## 用法

```ts
import { Button, Dialog, cn } from "@vite-mastery/ui";

function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="primary">打开</Button>} />
      <Dialog.Content title="示例" description="弹个窗">
        <Dialog.Body>内容</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="secondary">关闭</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

## 组件清单(阶段 2 验收)

| 类别 | 组件                          | Base UI 底层                      |
| ---- | ----------------------------- | --------------------------------- |
| 原子 | `Button` `IconButton`         | 原生 `<button>`                   |
| 原子 | `Switch` `Toggle` `Separator` | `@base-ui/react/switch` 等        |
| 复合 | `Dialog` `Sheet`              | `@base-ui/react/dialog`           |
| 复合 | `Popover` `Tooltip`           | 同名子包                          |
| 复合 | `Tabs` `Select` `Combobox`    | 同名子包(Combobox = AutoComplete) |
| 复合 | `ScrollArea`                  | `@base-ui/react/scroll-area`      |
| 容器 | `CodeBlockContainer`          | 无,纯样式                         |
| 工具 | `cn`                          | clsx + tailwind-merge             |

## 版本基线

| 包               | 版本                                           |
| ---------------- | ---------------------------------------------- |
| `@base-ui/react` | `^1.0.0-beta`(API 仍在演进,见各组件注释)       |
| `react`          | `^19.0.0`(peer)                                |
| `tailwindcss`    | `^4.0.0`(透过 `@vite-mastery/tailwind-config`) |

> [!NOTE]
> 阶段 2 验收只要求 IntelliSense 可用与 typecheck 通过。组件的交互细节(键盘可达、动效曲线、focus 管理)会在阶段 5 引入 `ui-ux-pro-max` 精修。
