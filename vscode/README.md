# VSCode扩展工具集合

这个目录包含VSCode编辑器扩展相关的开发工具和插件。

## 目录说明

- 存放VSCode扩展的源代码和配置文件
- 提供代码编辑辅助功能
- 提升开发效率和体验

## 扩展列表

### 📊 Calculator - 计算器插件
- **位置**: `vscode/Calculator/`
- **功能**: 智能数学表达式计算
- **特性**: 
  - 实时计算和悬停提示
  - 内联显示和点击替换
  - 状态栏集成显示

## VSCode扩展开发

### 基本结构
```
vscode/
├── Calculator/           # 计算器扩展
│   ├── package.json     # 扩展清单
│   ├── src/
│   │   └── extension.ts # 扩展主文件
│   ├── out/             # 编译输出
│   └── README.md        # 扩展说明
└── README.md            # 工具集合说明
```

### 开发环境设置

1. **安装依赖**
   ```bash
   cd vscode/Calculator
   npm install
   ```

2. **编译扩展**
   ```bash
   npm run compile
   ```

3. **调试扩展**
   - 按 F5 启动调试
   - 在新窗口中测试功能

4. **打包扩展**
   ```bash
   npm install -g vsce
   vsce package
   ```

## 扩展开发指南

### 创建新扩展
1. 使用VSCode扩展生成器
   ```bash
   npm install -g yo generator-code
   yo code
   ```

2. 配置 `package.json`
   - 定义扩展基本信息
   - 配置激活事件
   - 设置命令和快捷键

3. 实现核心功能
   - 编写TypeScript代码
   - 使用VSCode Extension API
   - 处理用户交互

### 扩展功能类型

- **命令扩展**: 提供自定义命令
- **语言扩展**: 支持特定编程语言
- **主题扩展**: 提供编辑器主题
- **调试扩展**: 集成调试器
- **工作台扩展**: 扩展工作台功能

## 技术栈

- **开发语言**: TypeScript/JavaScript
- **API基础**: VSCode Extension API
- **构建工具**: TypeScript Compiler
- **打包工具**: vsce (Visual Studio Code Extension Manager)

## 开发最佳实践

- 🎯 明确扩展的用途和目标用户
- 📝 编写清晰的文档和注释
- 🧪 充分测试各种使用场景
- ⚡ 优化扩展性能，避免影响编辑器
- 🔒 遵循安全开发规范
- 📦 合理管理依赖和资源

## 调试技巧

- 使用 `console.log` 输出调试信息
- 利用VSCode的调试功能
- 查看扩展主机日志
- 使用 `Developer Tools` 检查问题

## 发布流程

1. **准备发布**
   - 完善扩展文档
   - 测试所有功能
   - 准备扩展图标

2. **创建发布账号**
   - 注册Azure DevOps账号
   - 创建Personal Access Token
   - 配置vsce认证

3. **发布扩展**
   ```bash
   vsce publish
   ```

4. **管理版本**
   - 遵循语义化版本控制
   - 更新CHANGELOG
   - 处理用户反馈

## 扩展市场

- [VSCode Marketplace](https://marketplace.visualstudio.com/)
- 搜索和安装扩展
- 管理已安装的扩展
- 评价和反馈

## 相关资源

- [VSCode扩展开发文档](https://code.visualstudio.com/api)
- [Extension API参考](https://code.visualstudio.com/api/references/vscode-api)
- [扩展示例](https://github.com/microsoft/vscode-extension-samples)
- [扩展指南](https://code.visualstudio.com/api/get-started/your-first-extension)

---

**提示**: 开发VSCode扩展时，请确保了解VSCode的架构和Extension API的使用方法，并遵循最佳实践。
