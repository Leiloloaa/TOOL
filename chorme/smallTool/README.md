# 小工具集合 Chrome 扩展

一个易于扩展的浏览器小工具集合插件，提供各种实用工具。

## 功能特性

- ✅ **中英文翻译工具** - 快速将中文翻译成英文
- ✅ **小驼峰转换工具** - 将文本转换为小驼峰格式并自动复制到剪贴板
- ✅ **二维码生成工具** - 自动获取当前网页链接或手动输入链接生成二维码
- 🔄 **模块化设计** - 易于添加新工具
- 🎨 **现代化 UI** - 美观的用户界面
- ⚡ **快速响应** - 高效的翻译服务

## 安装方法

### 0. 生成图标文件（推荐）

在加载扩展之前，建议先生成图标文件：

1. 在浏览器中打开 `generate-icons.html` 文件
2. 点击"生成所有图标"按钮，会自动下载三个尺寸的图标
3. 将下载的图标文件（`icon16.png`, `icon48.png`, `icon128.png`）移动到 `icons/` 目录

**注意**：如果没有图标文件，扩展仍然可以加载，但会显示警告信息。

### 1. 加载未打包的扩展

1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目的 `chorme/smallTool` 目录
6. 扩展安装完成！

### 2. 使用扩展

#### 翻译工具
1. 点击浏览器工具栏中的扩展图标
2. 选择"翻译工具"标签
3. 在输入框中输入中文内容
4. 点击"翻译"按钮或使用快捷键 `Ctrl/Cmd + Enter`
5. 查看翻译结果

#### 小驼峰转换工具
1. 点击浏览器工具栏中的扩展图标
2. 选择"小驼峰转换"标签
3. 在输入框中输入文本（支持空格、连字符、下划线等分隔符）
   - 例如：`Alibaba Cloud` → `alibabaCloud`
   - 例如：`user-name` → `userName`
   - 例如：`hello_world` → `helloWorld`
4. 输入时会自动转换并显示结果
5. 点击"转换并复制"按钮，结果会自动复制到剪贴板

#### 二维码生成工具
1. 点击浏览器工具栏中的扩展图标
2. 选择"二维码生成"标签
3. 方式一：点击"获取当前页面"按钮，自动获取当前网页链接并生成二维码
4. 方式二：在输入框中手动输入链接地址，点击"生成二维码"按钮
5. 二维码生成后，可以点击"下载二维码"按钮保存为 PNG 图片

## 项目结构

```
smallTool/
├── manifest.json          # 扩展配置文件
├── popup.html            # 弹出窗口 HTML
├── popup.css             # 样式文件
├── popup.js              # 主逻辑文件
├── tools/                # 工具模块目录
│   ├── translator.js     # 翻译工具模块
│   ├── camelCase.js      # 小驼峰转换工具模块
│   └── qrcode.js         # 二维码生成工具模块
├── icons/                # 图标文件目录
│   └── README.md         # 图标说明
└── README.md             # 本文件
```

## 如何添加新工具

### 步骤 1: 创建工具模块

在 `tools/` 目录下创建新的 JavaScript 文件，例如 `tools/myTool.js`:

```javascript
const MyTool = {
  // 初始化工具
  init() {
    // 获取 DOM 元素
    // 绑定事件监听器
  },
  
  // 工具的主要功能
  doSomething() {
    // 实现工具逻辑
  }
};
```

### 步骤 2: 在 HTML 中添加工具界面

在 `popup.html` 中添加：

1. **工具标签**（在 `.tool-nav` 中）:
```html
<button class="tool-tab" data-tool="myTool">我的工具</button>
```

2. **工具面板**（在 `.tool-content` 中）:
```html
<div id="myTool-tool" class="tool-panel">
  <!-- 你的工具界面 -->
</div>
```

### 步骤 3: 引入工具模块

在 `popup.html` 的 `</body>` 标签前添加：
```html
<script src="tools/myTool.js"></script>
```

### 步骤 4: 初始化工具

在 `popup.js` 的 `DOMContentLoaded` 事件中添加：
```javascript
if (typeof MyTool !== 'undefined') {
  MyTool.init();
}
```

## 工具开发规范

### 命名规范

- 工具模块使用大驼峰命名：`MyTool`
- 工具 ID 使用小驼峰命名：`myTool`
- 文件名使用小驼峰命名：`myTool.js`

### 状态消息

使用全局函数显示状态消息：

```javascript
// 显示成功消息（3秒后自动隐藏）
window.showStatusMessage('操作成功！', 'success');

// 显示错误消息
window.showStatusMessage('操作失败！', 'error');

// 显示加载消息（不自动隐藏）
window.showStatusMessage('处理中...', 'loading', 0);

// 隐藏消息
window.hideStatusMessage();
```

### 样式规范

- 使用现有的 CSS 类名保持一致性
- 主要按钮使用 `primary-btn` 类
- 次要按钮使用 `secondary-btn` 类
- 输入框和文本域使用统一的样式

## 工具详细说明

### 翻译工具

#### 使用的 API

1. **主要方法**: Google Translate 非官方 API
   - 端点: `https://translate.googleapis.com/translate_a/single`
   - 优点: 免费、快速
   - 缺点: 非官方，可能不稳定

2. **备用方法**: MyMemory Translation API
   - 端点: `https://api.mymemory.translated.net/get`
   - 优点: 官方 API，稳定
   - 缺点: 有请求频率限制

#### 快捷键

- `Ctrl/Cmd + Enter`: 执行翻译

### 小驼峰转换工具

#### 功能说明

将输入的文本转换为小驼峰（camelCase）格式，并自动复制到剪贴板。

#### 支持的输入格式

- **空格分隔**: `Alibaba Cloud` → `alibabaCloud`
- **连字符分隔**: `user-name` → `userName`
- **下划线分隔**: `hello_world` → `helloWorld`
- **点号分隔**: `com.example` → `comExample`
- **混合格式**: `hello-world_test` → `helloWorldTest`

#### 转换规则

1. 自动识别各种分隔符（空格、连字符、下划线、点号等）
2. 第一个单词全小写
3. 后续单词首字母大写，其余小写
4. 自动过滤特殊字符，只保留字母和数字

#### 特性

- **实时转换**: 输入时自动显示转换结果
- **自动复制**: 点击"转换并复制"按钮后自动复制到剪贴板
- **快捷键**: 支持 `Ctrl/Cmd + Enter` 快速转换并复制

#### 使用示例

```
输入: "Alibaba Cloud"
输出: "alibabaCloud" (已复制到剪贴板)

输入: "user-name-format"
输出: "userNameFormat" (已复制到剪贴板)

输入: "Hello World Test"
输出: "helloWorldTest" (已复制到剪贴板)
```

### 二维码生成工具

#### 功能说明

快速生成二维码，支持自动获取当前网页链接或手动输入链接。

#### 使用方式

1. **自动获取当前页面链接**
   - 点击"获取当前页面"按钮
   - 自动获取当前标签页的 URL
   - 自动生成二维码

2. **手动输入链接**
   - 在输入框中输入或粘贴链接地址
   - 点击"生成二维码"按钮
   - 支持完整 URL（如 `https://example.com`）或不完整 URL（会自动添加 `https://` 前缀）

#### 特性

- **自动获取当前页面**：一键获取当前网页链接
- **URL 验证**：自动验证和格式化 URL
- **下载功能**：生成后可下载为 PNG 图片
- **快捷键**：支持 `Ctrl/Cmd + Enter` 快速生成

#### 使用示例

```
当前页面: https://www.example.com
→ 点击"获取当前页面" → 自动生成二维码

手动输入: www.example.com
→ 自动格式化为 https://www.example.com → 生成二维码
```

## 注意事项

1. **图标文件**: 如果没有图标文件，插件仍可正常工作，但会显示默认图标
2. **网络权限**: 翻译功能需要网络连接；二维码工具需要网络连接加载 QRCode 库
3. **API 限制**: 免费翻译 API 可能有请求频率限制
4. **剪贴板权限**: 小驼峰转换工具需要剪贴板写入权限，用于自动复制功能
5. **标签页权限**: 二维码生成工具需要 tabs 权限，用于获取当前页面 URL

## 未来计划

- [ ] 添加更多翻译语言支持
- [ ] 添加翻译历史记录
- [ ] 添加更多实用工具
- [ ] 支持自定义快捷键
- [ ] 添加设置页面

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

