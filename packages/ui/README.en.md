# @vite-mastery/ui

Internal component package for Vite Mastery. The primitive layer is Base UI (`@base-ui/react`), while design tokens come from `@vite-mastery/tailwind-config`.

## Usage

```tsx
import { Button, Dialog, cn } from "@vite-mastery/ui"

function Example() {
  return (
    <Dialog.Root>
      <Dialog.Trigger render={<Button variant="primary">Open</Button>} />
      <Dialog.Content title="Example" description="A small dialog">
        <Dialog.Body>Content</Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close render={<Button variant="secondary">Close</Button>} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  )
}
```

## Components

| Category  | Components                      | Base Layer                            |
| --------- | ------------------------------- | ------------------------------------- |
| Atomic    | `Button`, `IconButton`          | Native `<button>`                     |
| Atomic    | `Switch`, `Toggle`, `Separator` | Base UI switch and related primitives |
| Composite | `Dialog`, `Sheet`               | `@base-ui/react/dialog`               |
| Composite | `Popover`, `Tooltip`            | Matching Base UI packages             |
| Composite | `Tabs`, `Select`, `Combobox`    | Matching Base UI packages             |
| Composite | `ScrollArea`                    | `@base-ui/react/scroll-area`          |
| Container | `CodeBlockContainer`            | Styled container                      |
| Utility   | `cn`                            | `clsx` plus `tailwind-merge`          |

## Version Baseline

| Package          | Version                                          |
| ---------------- | ------------------------------------------------ |
| `@base-ui/react` | `^1.0.0-beta`; APIs may still evolve             |
| `react`          | `^19.0.0` peer dependency                        |
| `tailwindcss`    | `^4.0.0` through `@vite-mastery/tailwind-config` |
