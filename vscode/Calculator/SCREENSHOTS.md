# 功能截图说明

本文档描述了 Calculator Helper 扩展的功能截图，用于VSCode Marketplace展示。

## 截图要求

所有截图都应该：
- 分辨率：至少 1280x720 像素
- 格式：PNG 或 JPG
- 文件大小：每个文件不超过 1MB
- 展示清晰的功能演示

## 需要创建的截图

### 1. 主功能截图 (main-feature.png)
**文件名**: `images/main-feature.png`
**描述**: 展示扩展的主要功能
**内容**:
- VSCode编辑器界面
- 代码中包含数学表达式（如 `1+2+3`、`2*3*4`）
- 悬停提示显示计算结果
- 状态栏显示计算结果
- 内联显示 `= 结果 (点击替换)`

### 2. 悬停提示截图 (hover-demo.png)
**文件名**: `images/hover-demo.png`
**描述**: 展示悬停提示功能
**内容**:
- 鼠标悬停在数学表达式上
- 显示悬停提示框，包含计算结果
- 格式：`## 计算结果\n\n**表达式 = 结果**`

### 3. 内联显示截图 (inline-demo.png)
**文件名**: `images/inline-demo.png`
**描述**: 展示内联显示和点击替换功能
**内容**:
- 表达式后面显示 `= 结果 (点击替换)`
- 点击按钮的交互效果
- 替换后的结果

### 4. 状态栏截图 (statusbar-demo.png)
**文件名**: `images/statusbar-demo.png`
**描述**: 展示状态栏集成
**内容**:
- VSCode状态栏
- 显示 `$(symbol-numeric) 1+2+3 = 6`
- 工具提示显示详细计算结果

### 5. 设置界面截图 (settings-demo.png)
**文件名**: `images/settings-demo.png`
**描述**: 展示配置选项
**内容**:
- VSCode设置界面
- Calculator Helper 配置选项
- 精度设置、自动计算开关等

## 截图制作指南

### 1. 准备环境
```bash
# 确保扩展已安装并激活
# 打开VSCode
# 创建测试文件
```

### 2. 测试代码示例
创建以下测试代码来展示功能：

```javascript
// 基本运算测试
const basicMath = 1 + 2;
const multiplication = 2 * 3;
const division = 8 / 2;

// 连续运算测试
const continuousAdd = 1 + 2 + 3;
const continuousMultiply = 2 * 3 * 4;

// 混合运算测试
const mixedOperations = 1 + 2 * 3;
const complexExpression = 10 - 2 * 3 + 4;

// 小数运算测试
const decimalMath = 1.5 + 2.3;
const precisionTest = 2.5 * 3.7;
```

### 3. 截图步骤

#### 主功能截图
1. 打开VSCode
2. 创建新文件，输入测试代码
3. 将鼠标悬停在数学表达式上
4. 截图整个编辑器界面
5. 确保状态栏和内联显示都可见

#### 悬停提示截图
1. 将鼠标悬停在表达式上
2. 等待悬停提示出现
3. 截图悬停提示框
4. 确保提示内容清晰可见

#### 内联显示截图
1. 输入数学表达式
2. 等待内联显示出现
3. 截图显示 `= 结果 (点击替换)` 的部分
4. 可以展示点击前后的对比

#### 状态栏截图
1. 输入数学表达式
2. 等待状态栏更新
3. 截图状态栏区域
4. 确保显示计算结果

#### 设置界面截图
1. 打开VSCode设置 (Ctrl/Cmd + ,)
2. 搜索 "Calculator Helper"
3. 截图配置选项
4. 确保所有设置项都可见

## 文件结构

```
images/
├── icon.png          # 扩展图标 (128x128)
├── icon.svg          # 扩展图标SVG版本
├── main-feature.png  # 主功能截图
├── hover-demo.png    # 悬停提示截图
├── inline-demo.png    # 内联显示截图
├── statusbar-demo.png # 状态栏截图
└── settings-demo.png  # 设置界面截图
```

## 注意事项

1. **隐私保护**: 确保截图中不包含敏感信息
2. **清晰度**: 使用高分辨率显示器截图
3. **一致性**: 保持相同的主题和字体设置
4. **完整性**: 确保功能演示完整且准确
5. **美观性**: 使用合适的代码示例和布局

## 替代方案

如果无法创建实际截图，可以：
1. 使用VSCode的官方截图
2. 创建功能演示的GIF动画
3. 使用模拟的界面截图
4. 提供详细的功能描述

## 更新说明

- 每次功能更新时，需要更新相应的截图
- 保持截图与最新版本功能一致
- 定期检查截图的清晰度和准确性
