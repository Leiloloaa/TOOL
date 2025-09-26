#!/bin/bash

# Calculator Helper 发布脚本
echo "🚀 开始发布 Calculator Helper 扩展..."

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在扩展根目录运行此脚本"
    exit 1
fi

# 检查 Node.js 版本
node_version=$(node --version)
echo "📦 Node.js 版本: $node_version"

# 检查 vsce 是否安装
if ! command -v vsce &> /dev/null; then
    echo "❌ 错误: vsce 未安装"
    echo "请运行: npm install -g @vscode/vsce"
    exit 1
fi

# 安装依赖
echo "📥 安装依赖..."
npm install

# 编译扩展
echo "🔨 编译扩展..."
npm run compile

# 检查编译结果
if [ ! -f "out/extension.js" ]; then
    echo "❌ 错误: 编译失败"
    exit 1
fi

# 检查图标文件
if [ ! -f "images/icon.png" ]; then
    echo "⚠️  警告: 未找到图标文件 images/icon.png"
    echo "请确保图标文件存在"
fi

# 验证扩展配置
echo "🔍 验证扩展配置..."
vsce ls

# 打包扩展
echo "📦 打包扩展..."
vsce package

# 询问是否发布
read -p "是否发布到 Marketplace? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 发布到 Marketplace..."
    vsce publish
    echo "✅ 发布完成!"
else
    echo "📦 扩展已打包，但未发布"
fi

echo "🎉 完成!"
