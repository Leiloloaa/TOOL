#!/bin/bash

# Cursor 编辑器插件安装脚本
# 使用方法: ./scripts/install-for-cursor.sh

echo "🎯 为 Cursor 编辑器安装 Code Inline Calculator 插件..."

# 检查VSIX文件是否存在
VSIX_FILE="code-inline-calculator-2.0.0.vsix"
if [ ! -f "$VSIX_FILE" ]; then
    echo "❌ 找不到插件包文件: $VSIX_FILE"
    echo "正在重新打包插件..."
    vsce package
    if [ $? -ne 0 ]; then
        echo "❌ 打包失败"
        exit 1
    fi
    echo "✅ 插件包已生成"
fi

echo "📦 插件包信息:"
ls -lh "$VSIX_FILE"

echo ""
echo "🔧 安装步骤:"
echo "1. 打开 Cursor 编辑器"
echo "2. 按 Cmd+Shift+P (macOS) 或 Ctrl+Shift+P (Windows/Linux)"
echo "3. 输入: Extensions: Install from VSIX..."
echo "4. 选择文件: $(pwd)/$VSIX_FILE"
echo "5. 点击 Install 按钮"

echo ""
echo "🧪 测试步骤:"
echo "1. 创建测试文件 (如 test.txt)"
echo "2. 输入数学表达式: 1+2+3"
echo "3. 等待50ms，应该弹出计算弹框"
echo "4. 按回车键替换表达式为结果"

echo ""
echo "📱 功能特性:"
echo "- 🔢 支持基本数学运算 (+, -, *, /)"
echo "- ⚡ 输入触发弹框 (50ms延迟)"
echo "- 🎯 弹框显示计算结果"
echo "- ⌨️ 回车键替换表达式"
echo "- 🚫 防重复触发机制"

echo ""
echo "🔗 插件文件位置:"
echo "$(pwd)/$VSIX_FILE"

echo ""
echo "📚 更多信息:"
echo "- 查看 CURSOR_INSTALL_GUIDE.md 获取详细说明"
echo "- 查看 CURSOR_SUPPORT.md 了解技术支持"
echo "- 查看 README.md 了解插件功能"

echo ""
echo "✅ 安装脚本执行完成！"
echo "请按照上述步骤在 Cursor 中安装插件。"
