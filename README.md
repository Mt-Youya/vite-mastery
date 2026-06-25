# vite-mastery

中文社区第一份「Vite 核心机制 + 插件/Hooks 深度」的系统化学习指南。

> 目标读者:有 1~3 年前端经验、用过 Vite 但不懂原理的工程师
> 核心承诺:读完能写出生产级 Vite 插件,并理解 dev server / build / HMR 全链路

完整规划见 [PLAN.md](./PLAN.md),实施提示词见 [CLAUDE_CODE_PROMPT.md](./CLAUDE_CODE_PROMPT.md)。

## 仓库结构

```
vite-mastery/
├── apps/
│   ├── web/                  # 主站(Next.js 16)
│   └── playground/           # 在线交互式 demo
├── packages/
│   ├── ui/                   # shadcn + Base UI 组件库
│   ├── mdx-components/       # 自定义 MDX 组件
│   ├── content-config/       # content-collections 配置
│   ├── tailwind-config/      # Tailwind v4 共享主题
│   ├── tsconfig/             # 共享 tsconfig
│   └── eslint-config/        # oxlint 共享配置
├── content/                  # 教程 MDX 内容
└── examples/                 # 八个实战项目
```

## 开发

环境要求:Node **22+**、pnpm **10+**。

```bash
# 安装依赖
pnpm install

# 启动所有 app 的 dev server
pnpm dev

# 构建所有产物
pnpm build

# 静态检查
pnpm lint
pnpm typecheck
```

## 进度

按 [CLAUDE_CODE_PROMPT.md](./CLAUDE_CODE_PROMPT.md) 的 9 阶段逐步交付:

- [x] 阶段 1 · Monorepo 骨架
- [ ] 阶段 2 · 共享配置包
- [ ] 阶段 3 · Next.js 主站初始化
- [ ] 阶段 4 · 文档站骨架
- [ ] 阶段 5 · 交互式 MDX 组件
- [ ] 阶段 6 · 内容写作脚手架
- [ ] 阶段 7 · 实战项目目录骨架
- [ ] 阶段 8 · 部署配置
- [ ] 阶段 9 · 首批内容填充

## License

MIT(待定)
