#!/bin/bash

# Code Inline Calculator 自动安装脚本
# 使用方法: ./scripts/auto-install.sh

echo "🎯 Code Inline Calculator 插件安装助手"
echo "========================================"

# 检查插件发布状态
echo "📋 检查插件发布状态..."
vsce show devtools-helper.code-inline-calculator > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ 插件已成功发布到VSCode市场"
    echo ""
    echo "📊 插件信息:"
    vsce show devtools-helper.code-inline-calculator | head -10
    echo ""
else
    echo "❌ 插件未找到，请检查发布状态"
    exit 1
fi

echo "🔧 安装方法选择:"
echo "1. 通过VSCode扩展面板安装（推荐）"
echo "2. 通过命令安装"
echo "3. 通过网页安装"
echo "4. 手动安装VSIX文件"
echo ""

echo "📱 方法1: 通过VSCode扩展面板安装"
echo "--------------------------------"
echo "1. 打开VSCode"
echo "2. 按 Ctrl+Shift+X (Windows/Linux) 或 Cmd+Shift+X (macOS)"
echo "3. 搜索: Code Inline Calculator"
echo "4. 点击 Install 按钮"
echo ""

echo "⌨️ 方法2: 通过命令安装"
echo "---------------------"
echo "1. 在VSCode中按 Ctrl+Shift+P (Windows/Linux) 或 Cmd+Shift+P (macOS)"
echo "2. 输入: ext install devtools-helper.code-inline-calculator"
echo "3. 按回车键"
echo ""

echo "🌐 方法3: 通过网页安装"
echo "---------------------"
echo "1. 访问: https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator"
echo "2. 点击绿色的 Install 按钮"
echo "3. 会自动打开VSCode并安装插件"
echo ""

echo "📦 方法4: 手动安装VSIX文件"
echo "-------------------------"
echo "1. 在VSCode中按 Ctrl+Shift+P (Windows/Linux) 或 Cmd+Shift+P (macOS)"
echo "2. 输入: Extensions: Install from VSIX..."
echo "3. 选择文件: $(pwd)/code-inline-calculator-2.0.0.vsix"
echo "4. 点击 Install 按钮"
echo ""

echo "🧪 安装后测试步骤:"
echo "-----------------"
echo "1. 创建测试文件 (如 test.txt)"
echo "2. 输入数学表达式: 1+2+3"
echo "3. 等待50ms，应该弹出计算弹框"
echo "4. 按回车键替换表达式为结果"
echo ""

echo "✨ 功能特性:"
echo "-----------"
echo "- 🔢 支持基本数学运算 (+, -, *, /)"
echo "- ⚡ 输入触发弹框 (50ms延迟)"
echo "- 🎯 弹框显示计算结果"
echo "- ⌨️ 回车键替换表达式"
echo "- 🚫 防重复触发机制"
echo "- 📊 状态栏集成显示"
echo ""

echo "🔗 相关链接:"
echo "-----------"
echo "- VSCode市场: https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator"
echo "- 项目文档: 查看 README.md"
echo "- 安装指南: 查看 INSTALL_GUIDE.md"
echo ""

echo "🎉 安装完成后，你将获得完整的数学计算功能！"
echo "如有问题，请查看故障排除指南或联系技术支持。"
