# Cursor 编辑器支持指南

## 🔍 问题分析

Cursor编辑器虽然基于VSCode，但使用独立的插件市场，不会自动同步VSCode市场的插件。这就是为什么在VSCode中能找到插件，但在Cursor中找不到的原因。

## 🛠️ 解决方案

### 方案1: 手动安装VSIX文件（推荐）

#### 步骤1: 下载插件包
```bash
# 在项目目录中，插件包已经准备好
ls -la *.vsix
# 应该能看到: code-inline-calculator-2.0.0.vsix
```

#### 步骤2: 在Cursor中安装
1. 打开Cursor编辑器
2. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
3. 输入: `Extensions: Install from VSIX...`
4. 选择 `code-inline-calculator-2.0.0.vsix` 文件
5. 点击安装

### 方案2: 发布到Cursor市场

#### 检查Cursor是否支持VSCode插件
```bash
# 检查Cursor的插件兼容性
# Cursor通常支持VSCode插件，但需要手动安装
```

#### 发布到Cursor市场（如果支持）
1. 访问Cursor的插件市场
2. 检查是否有发布插件的选项
3. 使用相同的VSIX文件发布

### 方案3: 本地开发模式

#### 在Cursor中直接运行插件
1. 克隆项目到本地
2. 在Cursor中打开项目
3. 按 `F5` 启动调试模式
4. 在新窗口中测试插件功能

## 📦 创建Cursor专用安装包

让我为你创建一个Cursor专用的安装指南：
