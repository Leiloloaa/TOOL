# Cursor 编辑器安装指南

## 🎯 快速安装方法

### 方法1: 直接安装VSIX文件

#### 步骤1: 获取插件包
```bash
# 插件包位置
/Users/stone/Desktop/TOOL/vscode/Calculator/code-inline-calculator-2.0.0.vsix
```

#### 步骤2: 在Cursor中安装
1. 打开Cursor编辑器
2. 按 `Cmd+Shift+P` (macOS) 或 `Ctrl+Shift+P` (Windows/Linux)
3. 输入: `Extensions: Install from VSIX...`
4. 选择 `code-inline-calculator-2.0.0.vsix` 文件
5. 点击 "Install" 按钮

#### 步骤3: 验证安装
1. 打开扩展面板 (Cmd+Shift+X 或 Ctrl+Shift+X)
2. 搜索 "Code Inline Calculator"
3. 确认插件已安装并启用

### 方法2: 开发模式运行

#### 步骤1: 打开项目
```bash
# 在Cursor中打开项目目录
cd /Users/stone/Desktop/TOOL/vscode/Calculator
cursor .
```

#### 步骤2: 启动调试模式
1. 按 `F5` 或点击 "Run and Debug"
2. 选择 "Run Extension"
3. 在新窗口中测试插件

#### 步骤3: 测试功能
1. 创建测试文件 (如 `test.txt`)
2. 输入数学表达式: `1+2+3`
3. 验证弹框功能

## 🔧 故障排除

### 问题1: 找不到VSIX文件
**解决方案:**
```bash
# 重新打包插件
cd /Users/stone/Desktop/TOOL/vscode/Calculator
vsce package
```

### 问题2: 安装后插件不工作
**检查步骤:**
1. 确认插件已启用
2. 重启Cursor编辑器
3. 检查控制台是否有错误信息

### 问题3: 权限问题
**解决方案:**
```bash
# 确保有读取VSIX文件的权限
chmod 644 code-inline-calculator-2.0.0.vsix
```

## 📱 功能测试

### 基本功能测试
1. **输入触发**: 输入 `1+2+3`，等待50ms
2. **弹框显示**: 应该弹出计算弹框
3. **回车替换**: 按回车键替换表达式
4. **状态栏**: 右下角显示计算结果

### 高级功能测试
1. **复杂表达式**: `2*3+4`, `10/2-1`
2. **小数计算**: `1.5+2.3`, `3.14*2`
3. **连续运算**: `1+2+3+4`, `2*3*4`

## 🎨 Cursor特定优化

### 主题适配
插件会自动适配Cursor的主题：
- 明暗主题自动切换
- 颜色方案跟随编辑器
- 字体样式保持一致

### 性能优化
- 50ms快速响应
- 防抖机制避免频繁弹框
- 内存使用优化

## 📊 使用统计

安装后，你可以：
1. 在Cursor中正常使用所有功能
2. 享受与VSCode相同的体验
3. 获得完整的计算器功能

## 🔄 更新插件

### 手动更新
1. 下载新版本的VSIX文件
2. 卸载旧版本插件
3. 安装新版本插件

### 自动更新（如果支持）
1. Cursor可能会检查插件更新
2. 在扩展面板中查看更新
3. 点击更新按钮

## 📞 技术支持

### 常见问题
1. **插件不工作**: 检查是否已启用
2. **弹框不显示**: 确认输入的是数学表达式
3. **替换失败**: 检查光标位置

### 获取帮助
1. 查看项目文档
2. 在GitHub创建issue
3. 联系开发者

## 🎉 安装成功

安装成功后，你将获得：
- ✅ 输入触发弹框功能
- ✅ 实时计算结果显示
- ✅ 一键替换表达式
- ✅ 状态栏集成显示
- ✅ 完整的数学计算支持

享受在Cursor中使用Code Inline Calculator的便利！
