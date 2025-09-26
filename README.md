# TOOL - 开发工具集合

这是一个包含多种开发工具的集合项目，旨在为开发者提供便捷的辅助工具。

## 项目结构

```
TOOL/
├── chorme/          # Chrome浏览器扩展工具
├── electron/        # Electron桌面应用工具
├── vscode/          # VSCode扩展工具
│   └── Calculator/  # 计算器插件
└── README.md        # 项目说明文档
```

## 工具分类

### 🌐 Chrome扩展 (chorme/)
- 浏览器相关的开发工具和扩展
- 提供网页开发辅助功能

### 🖥️ Electron应用 (electron/)
- 跨平台桌面应用工具
- 基于Electron框架开发

### 🔧 VSCode扩展 (vscode/)
- VSCode编辑器插件集合
- 提升代码编辑效率

#### 计算器插件 (vscode/Calculator/)
- 智能数学表达式计算
- 支持内联显示和实时计算
- 提供悬停提示和状态栏显示

## 开发环境

### 前置要求
- Node.js (推荐 v16+)
- npm 或 yarn
- Git

### 安装依赖
```bash
# 安装所有子项目的依赖
npm run install:all
```

### 开发指南
```bash
# 开发VSCode扩展
cd vscode/Calculator
npm install
npm run compile

# 开发Electron应用
cd electron
npm install
npm start

# 开发Chrome扩展
cd chorme
# 按照Chrome扩展开发流程进行
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 参与讨论

---

**注意**: 每个子项目都有独立的README文档，请查看对应目录下的README.md了解具体使用方法。
