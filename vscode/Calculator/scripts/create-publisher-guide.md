# 创建 VSCode 发布者指南

## 创建 token

https://dev.azure.com/cailei1234567/_usersSettings/tokens

## 🌐 通过 VSCode Marketplace 创建发布者

### 步骤 1: 访问创建页面
1. 打开浏览器，访问：https://marketplace.visualstudio.com/manage
2. 使用与 Personal Access Token 相同的微软账号登录

### 步骤 2: 创建新发布者
1. 点击 "Create Publisher" 或 "New Publisher"
2. 填写发布者信息：

```
Publisher ID: devtools-helper
Publisher Name: DevTools Helper
Email: your-email@example.com
```

### 步骤 3: 验证创建
1. 确认 Publisher ID 与 package.json 中的 publisher 字段一致
2. 保存发布者信息

### 步骤 4: 配置本地环境
```bash
# 登录到发布者账号
vsce login devtools-helper

# 验证登录状态
vsce ls
```

## 🔑 重要注意事项

### Publisher ID 要求
- 必须与 package.json 中的 `"publisher": "devtools-helper"` 完全一致
- 一旦创建就不能更改
- 只能包含小写字母、数字和连字符

### 账号要求
- 必须使用与 Personal Access Token 相同的微软账号
- 确保账号有足够的权限
- 建议使用组织账号而非个人账号

### 权限配置
- 确保 Personal Access Token 有 Marketplace 管理权限
- 检查 Azure DevOps 组织权限设置

## 🚀 创建后的验证步骤

### 1. 检查发布者状态
```bash
vsce ls
```

### 2. 测试打包功能
```bash
cd /Users/stone/Desktop/TOOL/vscode/Calculator
vsce package
```

### 3. 测试发布功能
```bash
vsce publish
```

## 🔧 常见问题解决

### 问题 1: 发布者已存在
- 如果发布者已存在，直接使用现有发布者
- 确保有发布者管理权限

### 问题 2: 权限不足
- 检查 Personal Access Token 权限
- 确保有 Marketplace 管理权限

### 问题 3: 账号不匹配
- 确保使用与 Personal Access Token 相同的微软账号
- 重新登录 VSCode Marketplace

## 📋 创建检查清单

- [ ] 使用正确的微软账号登录
- [ ] Publisher ID 与 package.json 一致
- [ ] 发布者信息填写完整
- [ ] 本地登录成功
- [ ] 权限验证通过
- [ ] 打包测试成功

## 🎯 下一步

创建发布者后，您可以：
1. 编译扩展：`npm run compile`
2. 发布扩展：`vsce publish`
3. 验证发布：访问 VSCode Marketplace

---

**按照上述步骤，您就可以成功创建发布者并发布扩展了！** 🚀
