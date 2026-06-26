修复上次提交的 git 作者信息（email/name 不对），并强推覆盖远端。

## 步骤

1. 运行 `git config user.email 'dd257248@163.com'` 和 `git config user.name 'Mt-Youya'` 确认本地配置已正确
2. 运行 `git commit --amend --reset-author --no-edit` 修改上次提交的作者信息
3. 运行 `git push --force` 强推覆盖远端

## 说明

- `--reset-author`：用当前 `user.email` / `user.name` 重新署名
- `--no-edit`：保持提交信息不变，不打开编辑器
- 强推会覆盖远端历史，仅适用于个人分支或刚推送的提交
