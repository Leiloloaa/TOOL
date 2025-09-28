#!/bin/bash

# Cursor VSIX 安装脚本
# 使用方法: ./scripts/install-to-cursor.sh

echo "🎯 将 Code Inline Calculator 安装到 Cursor 编辑器"
echo "================================================="

# 检查VSIX文件
VSIX_FILE="code-inline-calculator-2.0.0.vsix"
if [ ! -f "$VSIX_FILE" ]; then
    echo "❌ 找不到VSIX文件: $VSIX_FILE"
    echo "正在重新打包插件..."
    vsce package
    if [ $? -ne 0 ]; then
        echo "❌ 打包失败"
        exit 1
    fi
    echo "✅ 插件包已生成"
fi

echo "📦 插件文件信息:"
echo "文件名: $VSIX_FILE"
echo "大小: $(ls -lh "$VSIX_FILE" | awk '{print $5}')"
echo "位置: $(pwd)/$VSIX_FILE"
echo ""

echo "🔧 安装步骤:"
echo "1. 打开 Cursor 编辑器"
echo "2. 按 Cmd+Shift+P (macOS) 或 Ctrl+Shift+P (Windows/Linux)"
echo "3. 输入: Extensions: Install from VSIX..."
echo "4. 选择文件: $(pwd)/$VSIX_FILE"
echo "5. 点击安装并重启Cursor"
echo ""

echo "🧪 安装后测试:"
echo "1. 创建测试文件 (如 test.txt)"
echo "2. 输入数学表达式: 1+2+3"
echo "3. 等待50ms，应该弹出计算弹框"
echo "4. 按回车键替换表达式为结果"
echo ""

echo "✨ 功能特性:"
echo "- 🔢 支持基本数学运算 (+, -, *, /)"
echo "- ⚡ 输入触发弹框 (50ms延迟)"
echo "- 🎯 弹框显示计算结果"
echo "- ⌨️ 回车键替换表达式"
echo "- 🚫 防重复触发机制"
echo "- 📊 状态栏集成显示"
echo ""

echo "📱 支持的表达式:"
echo "- 基本运算: 1+2, 3*4, 10/2"
echo "- 连续运算: 1+2+3, 2*3*4"
echo "- 混合运算: 1+2*3, 10-2*3+4"
echo "- 小数计算: 1.5+2.3, 3.14*2"
echo ""

echo "🔗 文件位置:"
echo "$(pwd)/$VSIX_FILE"
echo ""

echo "📚 详细说明:"
echo "查看 CURSOR_VSIX_INSTALL.md 获取完整安装指南"
echo ""

echo "✅ 准备就绪！"
echo "请按照上述步骤在Cursor中安装插件。"
