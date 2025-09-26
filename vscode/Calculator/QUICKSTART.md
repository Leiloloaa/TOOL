# Calculator Helper 快速开始指南

## 🚀 快速发布步骤

### 1. 环境准备
```bash
# 安装必要工具
npm install -g @vscode/vsce

# 验证安装
vsce --version
```

### 2. 编译扩展
```bash
cd /Users/stone/Desktop/TOOL/vscode/Calculator
npm run compile
```

### 3. 创建图标文件
```bash
# 将 images/icon.svg 转换为 PNG 格式
# 尺寸: 128x128 像素
# 保存为: images/icon.png
```

### 4. 配置发布账号
```bash
# 登录到 VSCode Marketplace
vsce login devtools-helper

# 输入 Personal Access Token
```

### 5. 发布扩展
```bash
# 使用发布脚本
./scripts/publish.sh

# 或直接发布
vsce publish
```

## 📋 发布检查清单

### 必需文件
- [ ] `package.json` - 扩展配置
- [ ] `README.md` - 扩展说明
- [ ] `CHANGELOG.md` - 更新日志
- [ ] `LICENSE` - 许可证
- [ ] `images/icon.png` - 扩展图标 (128x128)
- [ ] `out/extension.js` - 编译后的代码

### 功能测试
- [ ] 扩展可以正常激活
- [ ] 悬停提示功能正常
- [ ] 状态栏显示正常
- [ ] 内联显示功能正常
- [ ] 点击替换功能正常

## 🔧 常见问题解决

### 1. 编译失败
```bash
# 检查 TypeScript 配置
npm run compile

# 安装依赖
npm install
```

### 2. 发布失败
```bash
# 检查登录状态
vsce ls

# 重新登录
vsce logout
vsce login devtools-helper
```

### 3. 图标问题
- 确保图标文件为 PNG 格式
- 尺寸为 128x128 像素
- 文件大小不超过 1MB

## 📚 详细文档

- [发布指南](PUBLISH.md) - 详细的发布说明
- [检查清单](CHECKLIST.md) - 完整的检查项目
- [截图说明](SCREENSHOTS.md) - 功能截图要求
- [更新日志](CHANGELOG.md) - 版本变更记录

## 🎯 发布后验证

1. 访问 [VSCode Marketplace](https://marketplace.visualstudio.com/)
2. 搜索 "Calculator Helper"
3. 安装扩展
4. 测试所有功能
5. 确认用户体验良好

## 📞 获取帮助

- GitHub Issues: [报告问题](https://github.com/your-repo/vscode-calculator-helper/issues)
- 项目主页: [Calculator Helper](https://github.com/your-repo/vscode-calculator-helper)
- 详细文档: [PUBLISH.md](PUBLISH.md)

---

**祝您发布顺利！** 🎉
