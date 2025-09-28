#!/bin/bash

# VSCode 插件安装验证脚本
# 使用方法: ./scripts/verify-installation.sh

echo "🔍 验证 VSCode 插件安装状态..."

# 检查插件是否已发布
echo "📋 检查插件发布状态..."
vsce show devtools-helper.code-inline-calculator

if [ $? -eq 0 ]; then
    echo "✅ 插件已成功发布到市场"
else
    echo "❌ 插件未找到，请检查发布状态"
    exit 1
fi

echo ""
echo "🔗 插件市场链接:"
echo "https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator"

echo ""
echo "💻 直接安装命令:"
echo "ext install devtools-helper.code-inline-calculator"

echo ""
echo "📱 安装方法:"
echo "1. 在 VSCode 中按 Ctrl+Shift+P"
echo "2. 输入: ext install devtools-helper.code-inline-calculator"
echo "3. 按回车键安装"

echo ""
echo "🧪 测试步骤:"
echo "1. 创建测试文件 (如 test.txt)"
echo "2. 输入数学表达式: 1+2+3"
echo "3. 等待50ms，应该弹出计算弹框"
echo "4. 按回车键替换表达式为结果"

echo ""
echo "🔧 如果搜索不到插件:"
echo "1. 重启 VSCode"
echo "2. 清除扩展缓存"
echo "3. 使用直接安装命令"
echo "4. 访问市场网页版安装"

echo ""
echo "📊 插件统计:"
echo "访问: https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator"
echo "查看安装次数、评分和用户反馈"


