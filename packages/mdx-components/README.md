# @vite-mastery/mdx-components

文档 MDX 里能直接用的组件。

## 入口

| 入口                                              | 内容                                                             |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| `@vite-mastery/mdx-components`                    | `Callout / CodeBlock / CodeGroup / Detail / Diff / Steps / Tabs` |
| `@vite-mastery/mdx-components/shiki`              | Shiki 高亮器单例 + 默认 transformer                              |
| `@vite-mastery/mdx-components/use-mdx-components` | 给 `apps/web/mdx-components.tsx` 注入                            |

## 组件清单(阶段 2 骨架)

| 组件          | 用途                                      | 是否完成 |
| ------------- | ----------------------------------------- | -------- |
| `<Callout>`   | 教程里的提示块,5 种 type                  | ✅       |
| `<CodeBlock>` | Shiki 渲染的代码块,filename / 高亮 / copy | ✅       |
| `<CodeGroup>` | 多代码块切换(配合 filename)               | ✅       |
| `<Diff>`      | `<CodeBlock kind="diff">` 的语义糖        | ✅       |
| `<Steps>`     | 有编号的步骤列表(纯 CSS counter)          | ✅       |
| `<Detail>`    | 折叠区,基于原生 `<details>`               | ✅       |
| `<Tabs>`      | MDX 友好的 tabs 简写                      | ✅       |

## 阶段 5 会补充

`<HookExplorer>` `<PluginPipeline>` `<HmrDemo>` `<ConfigPlayground>` `<DepGraph>` —— 这五个交互式重组件归阶段 5。
