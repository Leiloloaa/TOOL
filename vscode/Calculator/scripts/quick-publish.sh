#!/bin/bash

# Calculator Helper 快速发布脚本
echo "⚡ 快速发布 Calculator Helper 扩展..."

# 检查环境
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在扩展根目录运行此脚本"
    exit 1
fi

# 编译
echo "🔨 编译扩展..."
npm run compile

# 检查编译结果
if [ ! -f "out/extension.js" ]; then
    echo "❌ 错误: 编译失败"
    exit 1
fi

# 直接发布
echo "🚀 发布到 Marketplace..."
vsce publish

echo "✅ 发布完成!"
