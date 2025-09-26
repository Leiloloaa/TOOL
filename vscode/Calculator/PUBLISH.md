# Calculator Helper 发布指南

本文档详细说明了如何发布 Calculator Helper VSCode 扩展到 VSCode Marketplace。

## 发布前准备

### 1. 环境要求
- Node.js (推荐 v16+)
- npm 或 yarn
- VSCode
- Git

### 2. 安装必要工具
```bash
# 安装 VSCode 扩展打包工具
npm install -g @vscode/vsce

# 验证安装
vsce --version
```

### 3. 检查文件完整性
确保以下文件存在：
```
vscode/Calculator/
├── package.json          # 扩展配置
├── README.md             # 扩展说明
├── CHANGELOG.md          # 更新日志
├── LICENSE               # 许可证
├── images/
│   ├── icon.png          # 扩展图标 (128x128)
│   └── icon.svg          # 扩展图标SVG
├── src/
│   └── extension.ts      # 扩展源码
├── out/
│   └── extension.js      # 编译后的代码
└── tsconfig.json         # TypeScript配置
```

## 发布步骤

### 1. 编译扩展
```bash
cd /Users/stone/Desktop/TOOL/vscode/Calculator
npm run compile
```

### 2. 验证扩展
```bash
# 检查扩展配置
vsce ls

# 验证扩展包
vsce package
```

### 3. 创建发布账号

#### 3.1 创建 Azure DevOps 账号
1. 访问 [Azure DevOps](https://dev.azure.com/)
2. 创建新组织或使用现有组织
3. 记录组织名称

#### 3.2 创建 Personal Access Token
1. 在 Azure DevOps 中，点击用户设置
2. 选择 "Personal Access Tokens"
3. 创建新令牌：
   - Name: `VSCode Extension Publishing`
   - Scopes: `Custom defined`
   - 选择 `Marketplace` → `Manage`
   - 过期时间：选择合适的期限
4. 复制生成的令牌（只显示一次）

#### 3.3 配置 VSCode 发布
```bash
# 登录到 VSCode Marketplace
vsce login <publisher-name>

# 输入 Personal Access Token
# 例如：vsce login devtools-helper
```

### 4. 发布扩展

#### 4.1 首次发布
```bash
# 发布到 Marketplace
vsce publish

# 或者指定版本
vsce publish 1.0.0
```

#### 4.2 更新发布
```bash
# 更新版本号
npm version patch  # 或 minor, major

# 发布更新
vsce publish
```

### 5. 验证发布
1. 访问 [VSCode Marketplace](https://marketplace.visualstudio.com/)
2. 搜索 "Calculator Helper"
3. 确认扩展已发布
4. 测试安装和功能

## 发布脚本

### 自动化发布脚本
创建 `scripts/publish.sh`:

```bash
#!/bin/bash

# Calculator Helper 发布脚本
echo "🚀 开始发布 Calculator Helper 扩展..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在扩展根目录运行此脚本"
    exit 1
fi

# 检查 Node.js 版本
node_version=$(node --version)
echo "📦 Node.js 版本: $node_version"

# 安装依赖
echo "📥 安装依赖..."
npm install

# 编译扩展
echo "🔨 编译扩展..."
npm run compile

# 检查编译结果
if [ ! -f "out/extension.js" ]; then
    echo "❌ 错误: 编译失败"
    exit 1
fi

# 检查图标文件
if [ ! -f "images/icon.png" ]; then
    echo "⚠️  警告: 未找到图标文件 images/icon.png"
    echo "请确保图标文件存在"
fi

# 验证扩展配置
echo "🔍 验证扩展配置..."
vsce ls

# 打包扩展
echo "📦 打包扩展..."
vsce package

# 询问是否发布
read -p "是否发布到 Marketplace? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 发布到 Marketplace..."
    vsce publish
    echo "✅ 发布完成!"
else
    echo "📦 扩展已打包，但未发布"
fi

echo "🎉 完成!"
```

### 使用发布脚本
```bash
# 给脚本执行权限
chmod +x scripts/publish.sh

# 运行发布脚本
./scripts/publish.sh
```

## 版本管理

### 版本号规则
- **主版本号** (Major): 不兼容的API修改
- **次版本号** (Minor): 向下兼容的功能性新增
- **修订号** (Patch): 向下兼容的问题修正

### 更新版本
```bash
# 自动更新版本号
npm version patch   # 0.0.1 → 0.0.2
npm version minor   # 0.0.2 → 0.1.0
npm version major   # 0.1.0 → 1.0.0

# 手动指定版本
npm version 1.2.3
```

## 发布检查清单

### 发布前检查
- [ ] 所有功能正常工作
- [ ] 代码已编译无错误
- [ ] 图标文件存在且格式正确
- [ ] README.md 内容完整
- [ ] CHANGELOG.md 已更新
- [ ] package.json 配置正确
- [ ] 许可证文件存在
- [ ] 测试扩展安装和卸载

### 发布后检查
- [ ] 扩展在 Marketplace 可见
- [ ] 扩展可以正常安装
- [ ] 所有功能正常工作
- [ ] 用户反馈正常
- [ ] 下载量统计正常

## 常见问题

### 1. 发布失败
```bash
# 检查登录状态
vsce ls

# 重新登录
vsce logout
vsce login <publisher-name>
```

### 2. 版本冲突
```bash
# 检查当前版本
npm version

# 更新版本号
npm version patch
```

### 3. 图标问题
- 确保图标文件为 PNG 格式
- 尺寸为 128x128 像素
- 文件大小不超过 1MB

### 4. 权限问题
- 确保 Personal Access Token 有正确权限
- 检查 Azure DevOps 组织设置
- 确认发布者账号权限

## 发布后维护

### 1. 监控指标
- 下载量
- 用户评分
- 用户反馈
- 错误报告

### 2. 定期更新
- 修复用户反馈的问题
- 添加新功能
- 更新依赖
- 优化性能

### 3. 社区互动
- 回复用户评论
- 处理 Issues
- 参与讨论
- 收集反馈

## 联系信息

如有问题，请通过以下方式联系：
- GitHub Issues: [报告问题](https://github.com/your-repo/vscode-calculator-helper/issues)
- Email: your-email@example.com
- 项目主页: [Calculator Helper](https://github.com/your-repo/vscode-calculator-helper)

---

**祝您发布顺利！** 🎉
