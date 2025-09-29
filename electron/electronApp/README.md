# 活动管理工具 (Activity Management Tool)

一个基于 Electron 的桌面应用程序，用于管理和创建活动项目，支持多项目模板、文案上传、图片处理等功能。

## 🚀 功能特性

### 核心功能
- **活动创建**: 自动生成活动项目结构和配置文件
- **文案管理**: 上传和管理活动文案
- **图片处理**: 批量处理活动相关图片
- **多项目支持**: 支持 Yoho、Hiyoo、SoulStar 等多个项目
- **模板系统**: 支持活动、OP、HOT 等多种模板类型

### 技术特性
- **跨平台**: 支持 Windows、macOS、Linux
- **智能路径**: 自动识别项目根目录，支持打包后环境
- **实时预览**: 即时查看处理结果
- **错误处理**: 完善的错误提示和日志系统

## 📋 系统要求

- **Node.js**: 16.0 或更高版本
- **npm**: 8.0 或更高版本
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Python**: 3.7+ (用于活动时间脚本)
- **Git**: 用于获取当前分支信息

## 🛠️ 安装和运行

### 开发环境

1. **克隆项目**
```bash
git clone <repository-url>
cd yoho-activity-h5/extension/electronApp
```

2. **安装依赖**
```bash
npm install
```

**主要依赖说明**:
- `electron`: 桌面应用框架
- `axios`: HTTP 请求库
- `nodemon`: 开发环境自动重启
- `@electron-forge/*`: 应用打包工具

3. **启动开发服务器**
```bash
npm start
```

### 生产环境

1. **构建应用**
```bash
npm run build
```

2. **打包应用**
```bash
npm run package
```

3. **制作安装包**
```bash
npm run make
```

4. **运行打包后的应用**
```bash
# Windows
./out/my-electron-app-win32-x64/my-electron-app.exe

# macOS
./out/my-electron-app-darwin-arm64/my-electron-app.app

# Linux
./out/my-electron-app-linux-x64/my-electron-app

# 或者使用工具命令打开 (macOS)
npm run tool
```

## 📁 项目结构

```
electronApp/
├── pages/                    # 页面文件
│   ├── handleImg/           # 图片处理页面
│   ├── createActivity/      # 活动创建页面
│   └── shared/              # 共享组件
├── scripts/                 # 核心脚本
│   ├── createActivity.js    # 活动创建逻辑
│   ├── handleImage.js       # 图片处理逻辑
│   └── template/            # 项目模板
├── index.js                 # 主进程文件
├── preload.js              # 预加载脚本
└── package.json            # 项目配置
```

## 🎯 使用指南

### 创建活动

1. **打开应用** → 点击"创建活动"标签
2. **填写信息**:
   - 项目名称: 选择 Yoho/Hiyoo/SoulStar
   - 活动目录: 选择活动分类 (如 202508)
   - 活动名称: 输入活动名称
   - 活动ID: 输入活动ID
3. **选择模板**:
   - 基础活动模板
   - OP模板 (可选)
   - HOT模板 (可选)
4. **提交创建** → 系统自动生成项目结构和配置文件

### 上传文案

1. **准备Excel文件** → 包含活动文案数据
2. **选择文件** → 点击"选择Excel文件"
3. **上传文案** → 系统自动解析并上传到服务器
4. **查看结果** → 确认上传成功

### 处理图片

1. **选择文件夹** → 包含需要处理的图片
2. **选择命名模式** → 选择图片重命名规则
3. **开始处理** → 系统批量处理图片
4. **查看结果** → 确认处理完成

## 🔧 配置说明

### 项目配置

应用支持多个项目的配置管理：

```javascript
// 项目映射配置
const urlMap = {
  Yoho: "activity-vite",
  Hiyoo: "activity-h5/activity-vite", 
  SoulStar: "maidocha-activity-h5"
};
```

### 模板配置

支持的活动模板类型：

- **activity**: 基础活动模板
- **activity_op**: OP活动模板
- **activity_op_hot**: HOT活动模板

### 路径配置

应用使用智能路径查找系统：

1. **开发环境**: 基于相对路径
2. **打包环境**: 自动识别项目根目录
3. **跨平台**: 支持不同操作系统的路径格式

## 🐛 故障排除

### 常见问题

#### 1. "无法找到项目根目录"错误
**原因**: 项目目录结构不正确或路径查找失败
**解决方案**: 
- 确保项目包含 `event`、`activity-vite` 或 `extension` 目录
- 检查应用是否在正确的项目环境中运行

#### 2. Python脚本执行失败
**原因**: Python环境或脚本路径问题
**解决方案**:
- 确保 `event` 目录下有 `myenv` 虚拟环境
- 检查 Python 脚本文件是否存在
- 验证脚本执行权限

#### 3. 文件上传失败
**原因**: 网络连接或服务器问题
**解决方案**:
- 检查网络连接
- 验证服务器地址和端口
- 确认文件格式正确

### 调试模式

启用详细日志输出：

```javascript
// 在控制台中查看详细日志
console.log("=== 调试信息 ===");
console.log("当前工作目录:", process.cwd());
console.log("脚本目录:", __dirname);
```

## 🔄 更新日志

### v1.0.0 (2024-08-19)
- ✅ 初始版本发布
- ✅ 支持活动创建功能
- ✅ 支持文案上传功能
- ✅ 支持图片处理功能
- ✅ 智能路径查找系统
- ✅ 多项目模板支持

## 🤝 贡献指南

1. **Fork 项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **创建 Pull Request**

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [故障排除](#故障排除) 部分
2. 搜索现有的 [Issues](../../issues)
3. 创建新的 Issue 并详细描述问题

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

## 🌍 项目环境

### 项目结构要求
应用需要在以下项目结构中运行：
```
yoho-activity-h5/
├── activity-vite/          # 活动项目
├── event/                  # Python脚本目录
├── extension/              # 本应用目录
└── ...
```

### 环境变量
- 确保 `event` 目录下有 Python 虚拟环境 `myenv`
- 确保 Python 脚本文件存在且可执行
- 确保网络连接正常，可访问相关 API

---

**注意**: 这是一个内部工具，请确保在正确的项目环境中使用。
