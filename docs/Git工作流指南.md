# Git日常工作流指南

## 一、日常开发Git操作流程

### 1.1 开发前准备
```bash
# 确保在开发前先拉取最新代码
git pull origin master

# 检查当前状态
git status
```

### 1.2 开发中操作
```bash
# 添加变更到暂存区
git add <文件路径>
# 或者添加所有变更
git add .

# 提交变更（使用规范的提交信息）
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复bug"
git commit -m "docs: 更新文档"
git commit -m "refactor: 重构代码"
git commit -m "style: 格式化代码"
git commit -m "test: 添加测试"
git commit -m "chore: 构建/工具链相关"
```

### 1.3 开发完成后推送
```bash
# 推送到GitHub
git push origin master

# 如果推送后检查状态
git status
```

## 二、提交信息规范

### 2.1 类型前缀
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构（不改变功能的代码变动）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

## 三、GitHub连接方案

### 3.1 方案一：使用GitHub Desktop（推荐）

1. 下载安装 GitHub Desktop
2. 打开 GitHub Desktop，登录GitHub账号
3. 在 GitHub Desktop 中添加本地仓库
4. 使用 GUI 界面进行提交和推送

### 3.2 方案二：使用SSH Key

```bash
# 1. 生成SSH Key
ssh-keygen -t ed25519 -C "2985362759@qq.com"

# 2. 复制公钥
cat ~/.ssh/id_ed25519.pub

# 3. 在GitHub设置中添加SSH Key
# 访问：https://github.com/settings/keys

# 4. 更改远程URL为SSH
git remote set-url origin git@github.com:mituwanwan/mituword.git

# 5. 测试连接
ssh -T git@github.com

# 6. 推送
git push origin master
```

### 3.3 方案三：使用有效的Personal Access Token

```bash
# 1. 访问 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

# 2. 生成新Token，选择以下权限：
#    - repo (Full control of private repositories)
#    - workflow (Update GitHub Action workflows)
#    - write:packages (Upload packages to GitHub Package Registry)
#    - delete:packages (Delete packages from GitHub Package Registry)

# 3. 使用Token更新远程URL
git remote set-url origin https://<你的用户名>:<你的Token>@github.com/mituwanwan/mituword.git

# 4. 推送
git push origin master
```

## 四、日常检查清单

每次开发完成后，请检查以下内容：

- [ ] 代码已测试通过
- [ ] 所有变更已添加到暂存区
- [ ] 使用规范的提交信息
- [ ] 已推送到GitHub
- [ ] 推送成功后检查远程仓库

## 五、常用Git命令

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline

# 查看变更
git diff

# 撤销工作区变更
git restore <文件>

# 撤销暂存区变更
git restore --staged <文件>

# 查看远程仓库
git remote -v

# 查看分支
git branch

# 拉取最新代码
git pull origin master

# 推送到远程
git push origin master
```
