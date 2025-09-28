# VSCode 插件发布指南

## 发布前准备

### 1. 检查清单
- [x] 插件功能完整测试
- [x] 版本号已更新 (v1.2.0)
- [x] package.json 配置正确
- [x] README.md 文档完整
- [x] 图标文件存在
- [x] 插件打包成功

### 2. 当前配置
- **插件名称**: Code Inline Calculator
- **发布者**: devtools-helper
- **版本**: 2.0.0
- **包大小**: 44.76KB
- **文件数量**: 27个文件

## 发布步骤

### 步骤1: 登录 Azure DevOps
```bash
# 使用个人访问令牌登录
vsce login devtools-helper
```

### 步骤2: 发布插件
```bash
# 发布到 VSCode 市场
vsce publish
```

### 步骤3: 验证发布
1. 访问 [VSCode 市场](https://marketplace.visualstudio.com/)
2. 搜索 "Code Inline Calculator"
3. 确认插件已成功发布

## 发布后操作

### 1. 更新文档
- 更新 README.md 中的安装说明
- 添加市场链接
- 更新版本信息

### 2. 推广插件
- 在社交媒体分享
- 在相关论坛推荐
- 收集用户反馈

### 3. 维护更新
- 监控用户反馈
- 修复 bug
- 添加新功能
- 定期更新版本

## 注意事项

### 1. 发布者账户
- 需要创建 Azure DevOps 账户
- 需要创建个人访问令牌
- 需要验证发布者身份

### 2. 版本管理
- 每次发布前更新版本号
- 遵循语义化版本规范
- 记录版本变更日志

### 3. 市场规范
- 遵守 VSCode 市场政策
- 提供准确的插件描述
- 使用合适的分类和关键词

## 故障排除

### 常见问题
1. **登录失败**: 检查个人访问令牌
2. **发布失败**: 检查网络连接和权限
3. **版本冲突**: 确保版本号唯一

### 联系支持
- VSCode 市场支持
- Azure DevOps 支持
- 社区论坛

## 成功发布后的链接

发布成功后，插件将在以下位置可见：
- VSCode 市场: `https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator`
- 安装命令: `ext install devtools-helper.code-inline-calculator`
