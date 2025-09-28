# 已屏蔽功能说明

## 概述

在v1.2.0版本中，为了简化用户体验和提升核心功能，我们屏蔽了一些历史功能。这些功能在代码中仍然保留，可以根据需要重新启用。

## 屏蔽的功能列表

### 1. 悬停触发功能

#### 功能描述
- 鼠标悬停在数学表达式上时显示计算结果
- 提供悬停提示框显示计算过程

#### 屏蔽位置
```typescript
// src/extension.ts 第87-94行
provideHover(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken
): vscode.ProviderResult<vscode.Hover> {
  // 悬停功能已屏蔽
  return null;
}
```

#### 重新启用方法
1. 取消`provideHover`方法中的注释
2. 恢复悬停检测逻辑
3. 重新编译插件

### 2. 内联显示功能

#### 功能描述
- 表达式后面显示`= 结果 (点击替换)`
- 提供内联的点击替换按钮

#### 屏蔽位置
```typescript
// src/extension.ts 第138-139行
// 更新代码镜头显示内联结果（已屏蔽）
// this.updateCodeLenses(document, position.line, expression, result);
```

#### 重新启用方法
1. 取消`onDocumentChange`方法中的注释
2. 恢复`updateCodeLenses`方法调用
3. 重新编译插件

### 3. 点击替换功能

#### 功能描述
- 点击内联按钮替换表达式
- 点击弹框选项替换表达式

#### 屏蔽位置
```typescript
// src/extension.ts 第525-531行
quickPick.onDidChangeSelection((selection) => {
  if (selection.length > 0) {
    // 点击选择项时只关闭弹框，不执行任何操作
    quickPick.hide();
    this.currentQuickPick = null;
  }
});
```

#### 重新启用方法
1. 恢复`onDidChangeSelection`中的替换逻辑
2. 添加替换表达式的方法调用
3. 重新编译插件

### 4. 复制功能

#### 功能描述
- 复制计算结果到剪贴板
- 提供复制选项

#### 屏蔽位置
- 复制相关代码已完全移除
- 弹框选项中不再包含复制选项

#### 重新启用方法
1. 重新添加复制相关代码
2. 在弹框选项中添加复制选项
3. 实现复制到剪贴板的功能

## 屏蔽原因分析

### 1. 用户体验优化
- **简化界面**：减少功能选项，降低用户学习成本
- **专注核心**：突出输入触发和回车替换的核心功能
- **减少混乱**：避免多种触发方式造成的用户困惑

### 2. 性能优化
- **减少监听**：减少不必要的事件监听器
- **降低复杂度**：简化事件处理逻辑
- **提升响应**：专注于核心功能的性能优化

### 3. 维护性提升
- **代码简化**：减少代码复杂度
- **测试简化**：减少测试用例数量
- **调试容易**：问题定位更加简单

## 重新启用指南

### 步骤1：评估需求
在重新启用功能前，请评估：
- 是否真的需要该功能？
- 是否会影响当前的用户体验？
- 是否会影响性能？

### 步骤2：代码修改
1. 找到对应的屏蔽位置
2. 取消相关代码的注释
3. 恢复相关的事件处理逻辑
4. 确保代码逻辑正确

### 步骤3：测试验证
1. 重新编译插件
2. 启动调试模式
3. 测试功能是否正常工作
4. 确保没有引入新的bug

### 步骤4：文档更新
1. 更新README.md
2. 更新CHANGELOG.md
3. 更新功能说明文档

## 代码示例

### 重新启用悬停功能
```typescript
provideHover(
  document: vscode.TextDocument,
  position: vscode.Position,
  token: vscode.CancellationToken
): vscode.ProviderResult<vscode.Hover> {
  const line = document.lineAt(position.line);
  const text = line.text;
  
  const expression = this.findMathExpression(text, position.character);
  if (expression) {
    const result = this.calculateExpression(expression);
    if (result !== null) {
      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(`## 计算结果\n\n`);
      markdown.appendMarkdown(`**${expression} = ${result}**`);
      return new vscode.Hover(markdown);
    }
  }
  
  return null;
}
```

### 重新启用内联显示
```typescript
// 在 onDocumentChange 方法中取消注释
this.updateCodeLenses(document, position.line, expression, result);
```

### 重新启用点击替换
```typescript
quickPick.onDidChangeSelection((selection) => {
  if (selection.length > 0) {
    const selected = selection[0];
    if (selected.label.includes("替换表达式")) {
      this.replaceExpression(expression, result);
    }
    quickPick.hide();
    this.currentQuickPick = null;
  }
});
```

## 注意事项

1. **兼容性**：重新启用功能时要注意与现有功能的兼容性
2. **性能**：确保重新启用的功能不会影响整体性能
3. **测试**：充分测试重新启用的功能
4. **文档**：及时更新相关文档

## 建议

1. **渐进式启用**：建议一次只启用一个功能，充分测试后再启用下一个
2. **用户反馈**：收集用户对重新启用功能的反馈
3. **性能监控**：监控重新启用功能后的性能表现
4. **版本管理**：为重新启用功能创建新的版本分支
