# 更新日志

所有重要的项目变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且此项目遵循 [语义化版本](https://semver.org/spec/v2.0.0.html)。

## [1.0.0] - 2024-01-15

### 新增
- 🎉 首次发布 Code Inline Calculator 扩展
- ✨ 智能数学表达式识别和计算
- 🔍 悬停提示显示计算结果
- 📊 状态栏实时显示计算结果
- 🎯 内联显示计算结果和点击替换功能
- ⌨️ 回车键自动替换表达式为结果
- ⚙️ 可配置的计算精度设置
- 🎨 支持多种数学运算符：`+`、`-`、`*`、`/`
- 🧮 支持连续计算：`1+2+3`、`2*3*4`
- 📈 运算符优先级处理（先乘除，后加减）
- 🎯 精度控制（默认保留两位小数）
- 🔧 配置选项：
  - `calculator-helper.precision`: 设置小数位数
  - `calculator-helper.autoCalculate`: 自动计算开关
  - `calculator-helper.showStatusBar`: 状态栏显示开关

### 功能特性
- **实时计算**: 输入数学表达式时自动计算并显示结果
- **悬停提示**: 鼠标悬停在表达式上显示详细计算结果
- **内联显示**: 表达式后面显示 `= 结果 (点击替换)`
- **一键替换**: 点击按钮或按回车键将表达式替换为结果
- **状态栏集成**: 右下角状态栏显示当前计算结果
- **智能识别**: 自动识别各种数学表达式格式
- **错误处理**: 除零检测和表达式验证

### 支持的表达式格式
- **基本运算**: `1+2`、`10-5`、`2*3`、`8/2`
- **连续运算**: `1+2+3`、`2*3*4`、`10-5-2`
- **混合运算**: `1+2*3`、`2*3+4`、`10-2*3`
- **小数计算**: `1.5+2.3`、`2.5*3.7`
- **精度控制**: 自动保留两位小数

### 技术实现
- **开发语言**: TypeScript
- **API基础**: VSCode Extension API
- **核心功能**:
  - `HoverProvider`: 提供悬停提示
  - `CodeLensProvider`: 实现内联显示和点击替换
  - `onDidChangeTextDocument`: 监听文档变化实现实时计算
  - `StatusBarItem`: 状态栏集成显示计算结果
- **计算引擎**:
  - 支持运算符优先级（先乘除，后加减）
  - 精度控制（保留两位小数）
  - 错误处理（除零检测）

### 用户体验
- 🎨 现代化UI设计
- ⚡ 快速响应和实时计算
- 🔄 无缝集成到VSCode工作流
- 📱 支持所有文件类型
- 🎯 直观的操作方式

---

## 开发计划

### 即将推出
- 🔧 更多数学函数支持（sin, cos, sqrt等）
- 📊 计算历史记录
- 🎨 主题定制选项
- 🌍 多语言支持
- 📈 性能优化

### 长期计划
- 🤖 AI智能计算建议
- 📊 可视化计算过程
- 🔗 与其他扩展集成
- 📱 移动端支持

---

## 贡献指南

我们欢迎社区贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目开发。

### 如何报告问题
1. 查看 [Issues](https://github.com/your-repo/vscode-calculator-helper/issues) 确认问题未被报告
2. 使用问题模板创建新的Issue
3. 提供详细的复现步骤和环境信息

### 如何提交功能请求
1. 查看 [Issues](https://github.com/your-repo/vscode-calculator-helper/issues) 确认功能未被请求
2. 使用功能请求模板创建新的Issue
3. 详细描述功能需求和预期行为

---

## 许可证

本项目采用 MIT 许可证。详情请查看 [LICENSE](LICENSE) 文件。

---

## 联系方式

- **GitHub**: [vscode-calculator-helper](https://github.com/your-repo/vscode-calculator-helper)
- **Issues**: [报告问题](https://github.com/your-repo/vscode-calculator-helper/issues)
- **Discussions**: [社区讨论](https://github.com/your-repo/vscode-calculator-helper/discussions)

---

**感谢使用 Calculator Helper！** 🎉
