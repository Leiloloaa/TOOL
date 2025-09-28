#!/bin/bash

# Cursor 插件缓存清理脚本
# 使用方法: ./scripts/clear-cursor-cache.sh

echo "🧹 Cursor 插件缓存清理工具"
echo "=========================="

# 检测操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CURSOR_CACHE_DIR="$HOME/Library/Application Support/Cursor"
    CURSOR_CONFIG_DIR="$HOME/Library/Application Support/Cursor"
    echo "🍎 检测到 macOS 系统"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    CURSOR_CACHE_DIR="$HOME/.config/Cursor"
    CURSOR_CONFIG_DIR="$HOME/.config/Cursor"
    echo "🐧 检测到 Linux 系统"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    CURSOR_CACHE_DIR="$APPDATA/Cursor"
    CURSOR_CONFIG_DIR="$APPDATA/Cursor"
    echo "🪟 检测到 Windows 系统"
else
    echo "❌ 不支持的操作系统: $OSTYPE"
    exit 1
fi

echo "📁 Cursor 配置目录: $CURSOR_CONFIG_DIR"

# 检查Cursor是否在运行
if pgrep -f "Cursor" > /dev/null; then
    echo "⚠️  检测到 Cursor 正在运行"
    echo "请先关闭 Cursor，然后重新运行此脚本"
    echo "或者选择 'y' 强制清理（可能会丢失未保存的工作）"
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 操作已取消"
        exit 1
    fi
fi

echo ""
echo "🔧 清理选项:"
echo "1. 清理扩展缓存（推荐）"
echo "2. 清理所有缓存"
echo "3. 重置Cursor配置（谨慎）"
echo "4. 仅清理网络缓存"
echo ""

read -p "请选择清理选项 (1-4): " choice

case $choice in
    1)
        echo "🧹 清理扩展缓存..."
        if [ -d "$CURSOR_CACHE_DIR/CachedExtensions" ]; then
            rm -rf "$CURSOR_CACHE_DIR/CachedExtensions"
            echo "✅ 扩展缓存已清理"
        else
            echo "ℹ️  扩展缓存目录不存在"
        fi
        
        if [ -d "$CURSOR_CACHE_DIR/logs" ]; then
            rm -rf "$CURSOR_CACHE_DIR/logs"
            echo "✅ 日志文件已清理"
        fi
        ;;
    2)
        echo "🧹 清理所有缓存..."
        if [ -d "$CURSOR_CACHE_DIR/CachedExtensions" ]; then
            rm -rf "$CURSOR_CACHE_DIR/CachedExtensions"
            echo "✅ 扩展缓存已清理"
        fi
        
        if [ -d "$CURSOR_CACHE_DIR/logs" ]; then
            rm -rf "$CURSOR_CACHE_DIR/logs"
            echo "✅ 日志文件已清理"
        fi
        
        if [ -d "$CURSOR_CACHE_DIR/User/workspaceStorage" ]; then
            rm -rf "$CURSOR_CACHE_DIR/User/workspaceStorage"
            echo "✅ 工作区存储已清理"
        fi
        ;;
    3)
        echo "⚠️  重置Cursor配置（这将删除所有设置）"
        read -p "确认继续？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$CURSOR_CONFIG_DIR"
            echo "✅ Cursor配置已重置"
        else
            echo "❌ 操作已取消"
            exit 1
        fi
        ;;
    4)
        echo "🌐 清理网络缓存..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sudo dscacheutil -flushcache
            sudo killall -HUP mDNSResponder
            echo "✅ macOS DNS缓存已清理"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo systemctl restart systemd-resolved
            echo "✅ Linux DNS缓存已清理"
        else
            echo "ℹ️  请手动清理网络缓存"
        fi
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "🔄 重启Cursor..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    killall Cursor 2>/dev/null || true
    sleep 2
    open -a Cursor
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    pkill Cursor 2>/dev/null || true
    sleep 2
    cursor &
else
    # Windows
    taskkill /f /im Cursor.exe 2>/dev/null || true
    sleep 2
    start Cursor
fi

echo ""
echo "✅ 缓存清理完成！"
echo ""
echo "📦 现在可以安装插件:"
echo "1. 在Cursor中按 Cmd+Shift+P (macOS) 或 Ctrl+Shift+P (Windows/Linux)"
echo "2. 输入: Extensions: Install from VSIX..."
echo "3. 选择文件: $(pwd)/code-inline-calculator-2.0.0.vsix"
echo "4. 点击安装"
echo ""
echo "🧪 安装后测试:"
echo "1. 创建测试文件 (如 test.txt)"
echo "2. 输入数学表达式: 1+2+3"
echo "3. 等待50ms，应该弹出计算弹框"
echo "4. 按回车键替换表达式为结果"
