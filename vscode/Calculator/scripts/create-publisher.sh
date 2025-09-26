#!/bin/bash

# Calculator Helper Publisher 创建脚本
echo "🔐 开始创建 Publisher..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在扩展根目录运行此脚本"
    exit 1
fi

# 从package.json中读取publisher名称
PUBLISHER_NAME=$(grep '"publisher"' package.json | cut -d'"' -f4)
echo "📦 Publisher名称: $PUBLISHER_NAME"

# 检查vsce是否安装
if ! command -v vsce &> /dev/null; then
    echo "❌ 错误: vsce 未安装"
    echo "请运行: npm install -g @vscode/vsce"
    exit 1
fi

# 检查当前登录状态
echo "🔍 检查当前登录状态..."
vsce ls

# 询问是否继续
read -p "是否继续创建Publisher? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 操作已取消"
    exit 1
fi

# 创建Publisher
echo "🚀 创建Publisher: $PUBLISHER_NAME"
vsce create-publisher $PUBLISHER_NAME

# 验证创建结果
echo "✅ 验证Publisher创建..."
vsce ls

echo "🎉 Publisher创建完成!"
echo "现在您可以发布扩展了: vsce publish"
