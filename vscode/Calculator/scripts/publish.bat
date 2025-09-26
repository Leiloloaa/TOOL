@echo off
echo 🚀 开始发布 Calculator Helper 扩展...

REM 检查是否在正确的目录
if not exist "package.json" (
    echo ❌ 错误: 请在扩展根目录运行此脚本
    pause
    exit /b 1
)

REM 检查 Node.js 版本
node --version
echo.

REM 检查 vsce 是否安装
where vsce >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 错误: vsce 未安装
    echo 请运行: npm install -g @vscode/vsce
    pause
    exit /b 1
)

REM 安装依赖
echo 📥 安装依赖...
npm install

REM 编译扩展
echo 🔨 编译扩展...
npm run compile

REM 检查编译结果
if not exist "out\extension.js" (
    echo ❌ 错误: 编译失败
    pause
    exit /b 1
)

REM 检查图标文件
if not exist "images\icon.png" (
    echo ⚠️  警告: 未找到图标文件 images\icon.png
    echo 请确保图标文件存在
)

REM 验证扩展配置
echo 🔍 验证扩展配置...
vsce ls

REM 打包扩展
echo 📦 打包扩展...
vsce package

REM 询问是否发布
set /p choice="是否发布到 Marketplace? (y/N): "
if /i "%choice%"=="y" (
    echo 🚀 发布到 Marketplace...
    vsce publish
    echo ✅ 发布完成!
) else (
    echo 📦 扩展已打包，但未发布
)

echo 🎉 完成!
pause
