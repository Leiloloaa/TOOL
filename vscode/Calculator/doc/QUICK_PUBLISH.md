# 快速发布指南

## 🚀 一键发布

你的插件已经准备就绪！只需要完成以下步骤：

### 1. 创建 Azure DevOps 账户
1. 访问 https://dev.azure.com/
2. 使用 Microsoft 账户登录
3. 创建组织（如果还没有）

### 2. 创建个人访问令牌
1. 在 Azure DevOps 中，点击右上角用户头像
2. 选择 "Personal access tokens" → "New Token"
3. 配置：
   - **Name**: VSCode Extension Publishing
   - **Scopes**: Custom defined → Marketplace → Manage
4. 复制生成的令牌

### 3. 登录并发布
```bash
# 登录发布者
vsce login devtools-helper

# 发布插件
vsce publish
```

## 📦 当前插件信息

- **名称**: Code Inline Calculator
- **版本**: 2.0.0
- **大小**: 44.76KB
- **包文件**: `code-inline-calculator-2.0.0.vsix`

## ✨ 功能特性

- 🔢 支持基本数学运算 (+, -, *, /)
- ⚡ 输入触发弹框 (50ms延迟)
- 🎯 弹框显示计算结果
- ⌨️ 回车键替换表达式
- 🚫 防重复触发机制

## 📱 发布后链接

发布成功后，插件将在以下位置可见：
- **VSCode 市场**: https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator
- **安装命令**: `ext install devtools-helper.code-inline-calculator`

## 🎯 测试建议

发布后，建议进行以下测试：
1. 在 VSCode 中安装插件
2. 创建测试文件，输入 `1+2+3`
3. 验证弹框功能
4. 测试回车键替换

## 📞 需要帮助？

如果遇到问题，请查看：
- `RELEASE_INSTRUCTIONS.md` - 详细发布说明
- `PUBLISH_GUIDE.md` - 完整发布指南
- VSCode 官方文档: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
