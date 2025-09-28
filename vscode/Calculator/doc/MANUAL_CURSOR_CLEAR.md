# Cursor 手动缓存清理指南

## 🚨 重要提示

检测到Cursor正在运行，为了安全起见，请先关闭Cursor，然后按照以下步骤操作。

## 🔧 手动清理步骤

### 步骤1: 关闭Cursor
1. 保存所有工作
2. 完全关闭Cursor编辑器
3. 确认Cursor进程已结束

### 步骤2: 清理缓存目录

#### macOS 系统
```bash
# 清理扩展缓存
rm -rf ~/Library/Application\ Support/Cursor/CachedExtensions

# 清理日志文件
rm -rf ~/Library/Application\ Support/Cursor/logs

# 清理工作区存储
rm -rf ~/Library/Application\ Support/Cursor/User/workspaceStorage
```

#### Windows 系统
```cmd
# 清理扩展缓存
rmdir /s /q "%APPDATA%\Cursor\CachedExtensions"

# 清理日志文件
rmdir /s /q "%APPDATA%\Cursor\logs"

# 清理工作区存储
rmdir /s /q "%APPDATA%\Cursor\User\workspaceStorage"
```

#### Linux 系统
```bash
# 清理扩展缓存
rm -rf ~/.config/Cursor/CachedExtensions

# 清理日志文件
rm -rf ~/.config/Cursor/logs

# 清理工作区存储
rm -rf ~/.config/Cursor/User/workspaceStorage
```

### 步骤3: 清理网络缓存

#### macOS
```bash
# 清理DNS缓存
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

#### Windows
```cmd
# 清理DNS缓存
ipconfig /flushdns
```

#### Linux
```bash
# 清理DNS缓存
sudo systemctl restart systemd-resolved
```

### 步骤4: 重启Cursor
1. 重新打开Cursor编辑器
2. 等待完全加载
3. 检查扩展面板是否正常

## 📦 安装插件

缓存清理完成后，安装插件：

### 方法1: 通过VSIX文件安装
1. 在Cursor中按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
2. 输入: `Extensions: Install from VSIX...`
3. 选择文件: `/Users/stone/Desktop/TOOL/vscode/Calculator/code-inline-calculator-2.0.0.vsix`
4. 点击安装

### 方法2: 复制到扩展目录
```bash
# 创建扩展目录
mkdir -p ~/.cursor/extensions/devtools-helper.code-inline-calculator-2.0.0

# 解压VSIX文件
cd ~/.cursor/extensions/devtools-helper.code-inline-calculator-2.0.0
unzip /Users/stone/Desktop/TOOL/vscode/Calculator/code-inline-calculator-2.0.0.vsix
```

## 🧪 验证安装

安装完成后，测试插件功能：

1. **创建测试文件**（如 `test.txt`）
2. **输入数学表达式**：`1+2+3`
3. **等待50ms**，应该弹出计算弹框
4. **按回车键**替换表达式为结果

## 🔍 故障排除

### 问题1: 清理后Cursor无法启动
**解决方案:**
1. 检查Cursor安装是否完整
2. 重新安装Cursor
3. 恢复备份的配置文件

### 问题2: 插件仍然无法安装
**解决方案:**
1. 检查VSIX文件是否完整
2. 重新下载插件包
3. 检查Cursor版本兼容性

### 问题3: 缓存清理不彻底
**解决方案:**
1. 手动删除所有相关目录
2. 重启系统
3. 重新安装Cursor

## 📊 清理效果

清理完成后，你应该看到：
- ✅ Cursor启动更快
- ✅ 扩展面板响应更快
- ✅ 插件安装更顺利
- ✅ 市场同步更及时

## 🎯 下一步

1. 清理缓存
2. 重启Cursor
3. 安装插件
4. 测试功能
5. 享受使用！

## 📞 需要帮助？

如果遇到问题：
1. 查看详细错误信息
2. 检查Cursor版本
3. 联系技术支持
4. 查看项目文档
