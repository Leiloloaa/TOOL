# Electron桌面应用工具

这个目录包含基于Electron框架开发的跨平台桌面应用程序。

## 目录说明

- 存放Electron应用的源代码和配置文件
- 提供跨平台桌面应用开发功能
- 支持Windows、macOS、Linux平台

## Electron应用开发

### 基本结构
```
electron/
├── package.json         # 项目配置和依赖
├── main.js             # 主进程入口文件
├── renderer/           # 渲染进程文件
│   ├── index.html      # 主页面
│   ├── style.css       # 样式文件
│   └── renderer.js     # 渲染进程脚本
├── preload.js          # 预加载脚本
├── assets/             # 资源文件
└── build/              # 构建输出目录
```

### 开发环境设置

1. **安装依赖**
   ```bash
   npm install
   ```

2. **开发模式运行**
   ```bash
   npm start
   # 或
   npm run dev
   ```

3. **构建应用**
   ```bash
   npm run build
   ```

4. **打包分发**
   ```bash
   npm run dist
   ```

### 核心概念

- **主进程 (Main Process)**: 控制应用生命周期，创建渲染进程
- **渲染进程 (Renderer Process)**: 显示用户界面，运行网页内容
- **预加载脚本 (Preload Script)**: 在主进程和渲染进程之间安全通信

## 功能特性

- 🖥️ 跨平台桌面应用
- 🎨 现代化用户界面
- ⚡ 高性能渲染引擎
- 🔧 丰富的系统API访问
- 📦 自动更新支持
- 🛡️ 安全沙箱环境

## 开发指南

### 创建新应用
1. 初始化项目结构
2. 配置 `package.json`
3. 创建主进程文件 (`main.js`)
4. 设计用户界面 (`index.html`)
5. 实现应用逻辑
6. 测试和调试

### 应用打包
1. 配置构建脚本
2. 选择打包工具 (electron-builder, electron-packager)
3. 设置平台特定配置
4. 生成安装包

### 发布应用
1. 准备应用图标和资源
2. 配置代码签名
3. 构建发布版本
4. 上传到分发平台

## 技术栈

- **框架**: Electron
- **前端**: HTML5, CSS3, JavaScript/TypeScript
- **构建工具**: Webpack, Vite, Rollup
- **UI框架**: React, Vue, Angular (可选)
- **打包工具**: electron-builder, electron-packager

## 最佳实践

- 🔒 使用预加载脚本进行安全通信
- 🎯 合理使用主进程和渲染进程
- 📱 响应式设计适配不同屏幕
- 🚀 优化应用启动性能
- 🔄 实现自动更新机制
- 🛡️ 遵循安全开发规范

## 调试技巧

- 使用Chrome DevTools调试渲染进程
- 使用VS Code调试主进程
- 查看Electron日志输出
- 使用 `--inspect` 参数调试

## 注意事项

- 注意主进程和渲染进程的通信安全
- 合理管理应用生命周期
- 优化内存使用和性能
- 遵循各平台的应用商店规范

## 相关资源

- [Electron官方文档](https://www.electronjs.org/docs)
- [Electron API参考](https://www.electronjs.org/docs/api)
- [Electron最佳实践](https://www.electronjs.org/docs/tutorial/security)
- [Electron Builder文档](https://www.electron.build/)

---

**提示**: 开发Electron应用时，请确保了解主进程和渲染进程的区别，并遵循安全开发最佳实践。
