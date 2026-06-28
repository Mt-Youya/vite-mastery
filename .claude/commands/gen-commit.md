根据当前暂存区和未暂存的变更，生成英文 commit message。**只生成文本，不执行 git commit。**

## 步骤

1. 运行 `git diff --staged` 查看暂存区变更
2. 运行 `git diff` 查看未暂存变更（两者都为空则报错退出）
3. 运行 `git log --oneline -10` 了解仓库已有的 commit 风格
4. 分析变更内容，归纳为一个英文 commit message

## 输出格式

```
<type>: <简短摘要>
```

- `<type>` 从 conventional commits 中选择：feat / fix / docs / refactor / style / test / chore / perf / ci / build
- 摘要用祈使语气（如 "add" 而非 "added"），首字母小写，不超过 50 字符

## 参数

如果用户附加了参数（如 `--detail` / `-d` 或 `--verbose` / `-v`），则在简短摘要之后追加正文：

```
<type>: <简短摘要>

- 变更点 1
- 变更点 2
- ...
```

正文每行以 `- ` 开头，描述每条变更的 WHAT 和 WHY。

## 说明

- 不自动执行 `git commit`，只输出文本供用户复制使用
- 仅暂存区有内容时，只分析暂存区
- 仅工作区有内容时，分析工作区
- 两者都有时，分别说明 staged / unstaged 各包含什么
- 如果变更杂乱、无法归纳为一个主题，输出多条候选 message 让用户挑选
