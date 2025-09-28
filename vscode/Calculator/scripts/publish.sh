#!/bin/bash

# VSCode 插件发布脚本
# 使用方法: ./scripts/publish.sh

echo "🚀 开始发布 VSCode 插件..."

# 检查是否已登录
echo "📋 检查发布者登录状态..."
if ! vsce ls-publishers | grep -q "devtools-helper"; then
    echo "❌ 未找到发布者 'devtools-helper'"
    echo "请先运行: vsce login devtools-helper"
    echo "然后输入你的个人访问令牌"
    exit 1
fi

echo "✅ 发布者已登录"

# 编译插件
echo "🔨 编译插件..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi

echo "✅ 编译成功"

# 打包插件
echo "📦 打包插件..."
vsce package

if [ $? -ne 0 ]; then
    echo "❌ 打包失败"
    exit 1
fi

echo "✅ 打包成功"

# 发布插件
echo "🌐 发布到 VSCode 市场..."
vsce publish

if [ $? -eq 0 ]; then
    echo "🎉 发布成功！"
    echo "📱 插件链接: https://marketplace.visualstudio.com/items?itemName=devtools-helper.code-inline-calculator"
    echo "💻 安装命令: ext install devtools-helper.code-inline-calculator"
else
    echo "❌ 发布失败"
    exit 1
fi