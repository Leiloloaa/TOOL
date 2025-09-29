# 文件夹监听功能实现总结

## 🎯 功能概述

成功创建了一个新的文件夹监听页面，模仿 `handleImg` 的样式，实现了监听文件夹变化并自动压缩图片的功能。

## 📁 创建的文件

### 1. 页面文件
- `pages/watchFolder/watchFolder.html` - 页面结构
- `pages/watchFolder/watchFolder.css` - 样式文件
- `pages/watchFolder/watchFolder.js` - 页面逻辑
- `pages/watchFolder/README.md` - 功能说明文档

### 2. 脚本文件
- `scripts/watchFolder.js` - 文件夹监听核心逻辑

### 3. 修改的文件
- `preload.js` - 添加文件夹监听 API
- `index.js` - 添加 IPC 处理程序
- `pages/shared/nav.html` - 添加导航链接

## 🔧 技术实现

### 核心特性
- ✅ **原生 Node.js API**: 使用 `fs.watch` 而非第三方库
- ✅ **实时监听**: 监听文件夹变化
- ✅ **智能过滤**: 只处理图片文件（PNG、JPG、JPEG、GIF、BMP、WebP）
- ✅ **防重复处理**: 避免重复处理同一文件
- ✅ **队列处理**: 支持多文件并发处理
- ✅ **文件稳定性检测**: 等待文件写入完成
- ✅ **错误处理**: 完善的错误处理机制

### 监听机制
```javascript
fs.watch(folderPath, { 
  recursive: true,
  persistent: true 
}, (eventType, fileName) => {
  // 处理文件变化
});
```

### 处理流程
1. 检测文件变化
2. 过滤图片文件
3. 等待文件写入稳定
4. 创建临时目录
5. 调用图片压缩功能
6. 替换原文件
7. 清理临时文件

## 🎨 UI 设计

### 页面布局
- **标题区域**: 功能说明
- **文件夹选择**: 选择监听目录
- **命名模式**: 保持原文件名或自定义前缀
- **操作按钮**: 开始/停止监听
- **状态显示**: 实时监听状态
- **日志区域**: 处理日志和进度

### 样式特点
- 与 `handleImg` 页面保持一致的视觉风格
- 渐变背景和现代化设计
- 响应式布局，支持移动端
- 动画效果和交互反馈

## 🔌 API 接口

### 主进程 API
```javascript
// 开始监听
ipcMain.handle("start-watch-folder", async (event, folderPath, namingMode) => {})

// 停止监听
ipcMain.handle("stop-watch-folder", async (event) => {})
```

### 渲染进程 API
```javascript
// 开始监听
window.electronAPI.startWatchFolder(folderPath, namingMode)

// 停止监听
window.electronAPI.stopWatchFolder()

// 事件监听
window.electronAPI.onFileChange(callback)
window.electronAPI.onImageProcessStart(callback)
window.electronAPI.onImageProcessComplete(callback)
window.electronAPI.onImageProcessError(callback)
window.electronAPI.onWatchError(callback)
window.electronAPI.onWatchStop(callback)
```

## 🚀 使用方法

1. **启动应用**: 运行 `npm start`
2. **导航到页面**: 点击导航栏中的"文件夹监听"
3. **选择文件夹**: 点击"选择监听文件夹"按钮
4. **设置选项**: 选择命名模式（保持原文件名或自定义前缀）
5. **开始监听**: 点击"开始监听"按钮
6. **监控状态**: 查看实时状态和日志
7. **停止监听**: 点击"停止监听"按钮

## ⚠️ 注意事项

- 只监听指定文件夹内的直接变化
- 忽略隐藏文件（以 . 开头的文件）
- 处理过程中会创建临时目录
- 支持的文件格式：PNG、JPG、JPEG、GIF、BMP、WebP
- 建议在稳定的网络环境下使用

## 🎉 完成状态

- ✅ 页面创建完成
- ✅ 样式设计完成
- ✅ 核心逻辑实现
- ✅ API 接口集成
- ✅ 导航集成完成
- ✅ 错误处理完善
- ✅ 文档编写完成

## 🔄 与 handleImg 的关系

新功能复用了 `handleImg` 中的图片压缩逻辑：
- 调用 `scripts/handleImage.js` 中的 `processImages` 函数
- 保持相同的命名模式和压缩参数
- 使用相同的错误处理机制

这样确保了功能的一致性和代码的复用性。
