# VSCode 插件发布说明

## 当前状态
✅ 插件已成功打包: `code-inline-calculator-1.2.0.vsix` (44.76KB)

## 发布前需要完成的步骤

### 1. 创建 Azure DevOps 账户
1. 访问 [Azure DevOps](https://dev.azure.com/)
2. 使用 Microsoft 账户登录
3. 创建新的组织（如果还没有）

### 2. 创建个人访问令牌 (PAT)
1. 在 Azure DevOps 中，点击右上角用户头像
2. 选择 "Personal access tokens"
3. 点击 "New Token"
4. 配置令牌：
   - **Name**: VSCode Extension Publishing
   - **Organization**: 选择你的组织
   - **Scopes**: 选择 "Custom defined"
   - **Permissions**: 选择 "Marketplace" → "Manage"
5. 点击 "Create" 并复制令牌

### 3. 登录 VSCode 发布工具
```bash
cd /Users/stone/Desktop/TOOL/vscode/Calculator
vsce login devtools-helper
```
输入你的个人访问令牌

### 4. 发布插件
```bash
vsce publish
```

## 发布后验证

### 1. 检查市场页面
访问: https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator

### 2. 测试安装
在 VSCode 中：
1. 打开扩展面板 (Ctrl+Shift+X)
2. 搜索 "Code Inline Calculator"
3. 点击安装

### 3. 验证功能
1. 创建测试文件
2. 输入数学表达式: `1+2+3`
3. 验证弹框功能
4. 测试替换功能

## 插件信息

### 基本信息
- **名称**: Code Inline Calculator
- **ID**: devtools-helper.code-inline-calculator
- **版本**: 2.0.0
- **大小**: 44.76KB
- **文件数**: 27个

### 功能特性
- 🔢 支持四种基本运算符：`+`、`-`、`*`、`/`
- 🧮 支持多个数的连续计算
- ⚡ 输入触发弹框（50ms延迟）
- 🎯 弹框显示计算结果
- ⌨️ 回车键替换表达式
- 🚫 防重复触发机制

### 支持的表达式
- 基本运算: `1+2`, `3*4`, `10/2`
- 连续计算: `1+2+3`, `2*3*4`
- 混合运算: `1+2*3`, `10-2*3+4`
- 小数计算: `1.5+2.3`, `3.14*2`

## 推广建议

### 1. 社交媒体
- 在 Twitter 分享插件链接
- 在 LinkedIn 发布介绍
- 在相关技术群组推荐

### 2. 技术社区
- 在 VSCode 相关论坛分享
- 在 GitHub 相关项目推荐
- 在技术博客介绍

### 3. 文档完善
- 添加更多使用示例
- 创建视频教程
- 收集用户反馈

## 维护计划

### 短期 (1-3个月)
- 收集用户反馈
- 修复发现的 bug
- 优化性能

### 中期 (3-6个月)
- 添加新功能
- 支持更多数学函数
- 改进用户界面

### 长期 (6个月+)
- 支持变量和常量
- 添加历史记录
- 支持自定义快捷键

## 联系信息

如有问题，可以通过以下方式联系：
- GitHub Issues: 在项目仓库创建 issue
- VSCode 市场: 通过市场页面反馈
- 邮箱: 通过发布者信息联系

## 成功发布后的链接

发布成功后，插件将在以下位置可见：
- **VSCode 市场**: https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator
- **安装命令**: `ext install devtools-helper.code-inline-calculator`
- **GitHub**: 项目仓库链接
