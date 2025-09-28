# Cursor 插件缓存清理指南

## 🔧 手动清理Cursor插件缓存

### 方法1: 清理扩展缓存目录

#### macOS
```bash
# 清理Cursor扩展缓存
rm -rf ~/Library/Application\ Support/Cursor/CachedExtensions
rm -rf ~/Library/Application\ Support/Cursor/logs
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage

# 重启Cursor
killall Cursor
open -a Cursor
```

#### Windows
```cmd
# 清理Cursor扩展缓存
rmdir /s /q "%APPDATA%\Cursor\CachedExtensions"
rmdir /s /q "%APPDATA%\Cursor\logs"
rmdir /s /q "%APPDATA%\Cursor\User\workspaceStorage"

# 重启Cursor
taskkill /f /im Cursor.exe
start Cursor
```

#### Linux
```bash
# 清理Cursor扩展缓存
rm -rf ~/.config/Cursor/CachedExtensions
rm -rf ~/.config/Cursor/logs
rm -rf ~/.config/Cursor/User/workspaceStorage

# 重启Cursor
pkill Cursor
cursor
```

### 方法2: 通过Cursor设置清理

#### 步骤1: 打开Cursor设置
1. 按 `Cmd+,` (macOS) 或 `Ctrl+,` (Windows/Linux)
2. 搜索 "cache" 或 "缓存"

#### 步骤2: 清理缓存
1. 找到 "Extensions" 相关设置
2. 点击 "Clear Cache" 或 "清理缓存"
3. 重启Cursor

### 方法3: 重置Cursor扩展系统

#### 完全重置（谨慎使用）
```bash
# macOS
rm -rf ~/Library/Application\ Support/Cursor

# Windows
rmdir /s /q "%APPDATA%\Cursor"

# Linux
rm -rf ~/.config/Cursor
```

## 🔄 强制刷新插件市场

### 方法1: 重启Cursor
1. 完全关闭Cursor
2. 等待5-10秒
3. 重新打开Cursor

### 方法2: 重新加载窗口
1. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
2. 输入: `Developer: Reload Window`
3. 按回车键

### 方法3: 清除网络缓存
```bash
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Windows
ipconfig /flushdns

# Linux
sudo systemctl restart systemd-resolved
```

## 📦 手动安装插件到Cursor

### 方法1: 直接安装VSIX文件
1. 在Cursor中按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
2. 输入: `Extensions: Install from VSIX...`
3. 选择: `/Users/stone/Desktop/TOOL/vscode/Calculator/code-inline-calculator-2.0.0.vsix`
4. 点击安装

### 方法2: 复制到扩展目录
```bash
# 创建扩展目录
mkdir -p ~/.cursor/extensions/devtools-helper.code-inline-calculator-2.0.0

# 解压VSIX文件到扩展目录
cd ~/.cursor/extensions/devtools-helper.code-inline-calculator-2.0.0
unzip /Users/stone/Desktop/TOOL/vscode/Calculator/code-inline-calculator-2.0.0.vsix
```

## 🛠️ 创建Cursor缓存清理脚本
