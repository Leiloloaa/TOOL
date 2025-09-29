# Vue3 项目模板

这是一个基于 Vue3 + Vite 的现代化前端项目模板，包含了常用的开发配置和示例代码。

## 特性

- ✅ Vue 3.4+ (Composition API)
- ✅ Vite 5.0+ (快速构建工具)
- ✅ 现代化开发体验
- ✅ 响应式设计
- ✅ 示例组件和功能

## 项目结构

```
Vue/
├── index.html          # 入口 HTML 文件
├── package.json        # 项目配置和依赖
├── vite.config.js      # Vite 配置文件
├── src/
│   ├── main.js         # 应用入口文件
│   ├── App.vue         # 根组件
│   └── style.css       # 全局样式
└── README.md           # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
cd Vue
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 `http://localhost:3000` 启动

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 功能示例

项目包含了以下示例功能：

- **计数器**: 演示 Vue3 的响应式数据
- **待办事项**: 演示列表操作和状态管理
- **错误收集器**: 自动收集控制台错误和异常
- **响应式设计**: 适配移动端和桌面端

## 错误收集功能

### 主要特性
- ✅ **自动收集**: 实时捕获 `console.error`、`console.warn`
- ✅ **错误类型**: JavaScript 错误、Promise 拒绝、Vue 组件错误
- ✅ **自动检查**: 每5分钟自动检查控制台错误
- ✅ **手动检查**: 随时手动触发错误检查
- ✅ **持久化**: 错误数据自动保存到 localStorage
- ✅ **导出功能**: 一键导出错误日志到 txt 文件
- ✅ **实时显示**: 界面实时显示错误统计和最近错误

### 使用方法
1. **启动收集**: 点击"开始收集"按钮开始捕获错误
2. **自动检查**: 点击"开始自动检查"每5分钟自动检查
3. **手动检查**: 点击"手动检查"立即检查控制台
4. **导出日志**: 点击"导出错误日志"下载错误报告
5. **测试功能**: 点击"生成测试错误"验证收集功能

### 错误信息包含
- 📅 时间戳
- 🏷️ 错误类型 (console.error, JavaScript Error, Promise Rejection 等)
- 📝 错误内容
- 🌐 页面 URL
- 💻 用户代理信息
- 📊 错误统计

## 技术栈

- **Vue 3**: 渐进式 JavaScript 框架
- **Vite**: 下一代前端构建工具
- **Composition API**: Vue3 的组合式 API
- **现代 CSS**: 响应式设计和现代样式

## 开发建议

1. 使用 Composition API 编写组件
2. 利用 `<script setup>` 语法糖
3. 使用 `ref()` 和 `reactive()` 管理响应式数据
4. 遵循 Vue3 最佳实践

## 扩展功能

可以根据需要添加：

- Vue Router (路由管理)
- Pinia (状态管理)
- Axios (HTTP 客户端)
- Element Plus (UI 组件库)
- TypeScript 支持

## 许可证

MIT License
