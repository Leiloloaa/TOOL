# ConsoleErrorCollector 学习指南

> 一个功能强大的JavaScript错误收集器，支持多种错误类型监听、自动保存、批量发送等功能。

## 📚 学习路径概览

本指南将分4个阶段带你从零开始学习这个错误收集器：

- **阶段1：基础概念** - 了解什么是错误收集器，为什么需要它
- **阶段2：核心功能** - 学习基本使用方法和配置选项
- **阶段3：高级特性** - 掌握批量发送、错误合并等高级功能
- **阶段4：实战应用** - 在实际项目中集成和使用

---

## 🎯 阶段1：基础概念理解

### 1.1 什么是错误收集器？

错误收集器是一个工具，用于：
- **自动捕获** 网页中发生的各种错误
- **记录信息** 包括错误内容、发生时间、页面URL等
- **存储管理** 将错误信息保存到本地或发送到服务器
- **统计分析** 提供错误统计和趋势分析

### 1.2 为什么需要错误收集器？

在Web开发中，用户可能遇到各种错误：
- JavaScript运行时错误
- 网络请求失败
- 用户操作异常
- 第三方库错误

**问题**：开发者很难知道用户遇到了什么错误
**解决**：错误收集器自动收集并上报这些错误

### 1.3 这个收集器能捕获什么？

```javascript
// 1. 控制台错误
console.error("这是一个错误");

// 2. 控制台警告  
console.warn("这是一个警告");

// 3. JavaScript运行时错误
throw new Error("运行时错误");

// 4. Promise拒绝
Promise.reject("Promise被拒绝");
```

### 1.4 快速体验

让我们先看看这个收集器长什么样：

```javascript
// 最简单的使用方式
import ConsoleErrorCollector from './ConsoleErrorCollector.js';

const collector = new ConsoleErrorCollector({
  targets: ["console.error", "console.warn"],
  autoStart: true
});

// 现在任何 console.error 或 console.warn 都会被自动收集
console.error("测试错误"); // 这会被收集器捕获
```

**练习1**：在你的项目中试试上面的代码，看看控制台输出什么。

---

## 🔧 阶段2：核心功能学习

### 2.1 基本配置选项

让我们详细了解每个配置选项：

```javascript
const collector = new ConsoleErrorCollector({
  // 监听哪些类型的错误
  targets: ["console.error", "console.warn", "javascript", "promise"],
  
  // 是否自动开始监听
  autoStart: false,
  
  // 最大收集错误数量
  maxErrors: 100,
  
  // 活动ID，用于标识错误来源
  activityId: "USER_SESSION_123",
  
  // 是否使用sessionStorage存储
  useSessionStorage: true,
  
  // 存储键名
  storageKey: "console_error_collector"
});
```

### 2.2 监听目标详解

| 目标类型        | 说明         | 示例                            |
| --------------- | ------------ | ------------------------------- |
| `console.error` | 控制台错误   | `console.error("错误信息")`     |
| `console.warn`  | 控制台警告   | `console.warn("警告信息")`      |
| `javascript`    | JS运行时错误 | `throw new Error("运行时错误")` |
| `promise`       | Promise拒绝  | `Promise.reject("拒绝原因")`    |

### 2.3 基本使用方法

```javascript
// 1. 创建收集器实例
const collector = new ConsoleErrorCollector({
  targets: ["console.error", "console.warn"],
  autoStart: false
});

// 2. 启动收集
collector.start();

// 3. 获取收集到的错误
const errors = collector.getErrors();
console.log("收集到的错误:", errors);

// 4. 获取统计信息
const stats = collector.getStats();
console.log("错误统计:", stats);

// 5. 停止收集
collector.stop();
```

### 2.4 错误信息结构

每个收集到的错误都有以下结构：

```javascript
{
  id: 1703123456789.123,           // 唯一标识
  timestamp: "2023-12-21T10:30:45.123Z", // 发生时间
  type: "console.error",           // 错误类型
  data: "这是一个测试错误",         // 错误内容
  url: "http://localhost:3000",    // 页面URL
  userAgent: "Mozilla/5.0...",    // 用户代理
  activityId: "USER_SESSION_123", // 活动ID
  isSent: false                    // 是否已发送
}
```

**练习2**：创建一个收集器，监听所有类型的错误，然后故意触发一些错误，观察收集结果。

---

## 🚀 阶段3：高级特性掌握

### 3.1 发送模式：立即 vs 批量

#### 立即发送模式 (immediate)
```javascript
const collector = new ConsoleErrorCollector({
  sendMode: "immediate",  // 立即发送
  serverUrl: "https://your-api.com/errors"
});

// 错误发生后立即发送到服务器
```

#### 批量发送模式 (batch)
```javascript
const collector = new ConsoleErrorCollector({
  sendMode: "batch",                    // 批量发送
  batchInterval: 2 * 60 * 1000,        // 2分钟间隔
  serverUrl: "https://your-api.com/errors"
});

// 错误会先存储，然后定时批量发送
```

### 3.2 错误合并机制

批量模式下，相同错误会被合并：

```javascript
// 如果多次触发相同错误
console.error("网络连接失败");
console.error("网络连接失败");
console.error("网络连接失败");

// 收集器会合并为：
{
  type: "console.error",
  data: "网络连接失败",
  count: 3,                    // 出现次数
  firstOccurred: "2023-12-21T10:30:45.123Z",  // 首次出现
  lastOccurred: "2023-12-21T10:32:15.456Z"   // 最后出现
}
```

### 3.3 服务器集成

```javascript
// 设置服务器接口
collector.setServerUrl("https://your-api.com/errors");

// 发送错误到服务器
await collector.sendErrorToServer(errorInfo);

// 手动发送批量错误
collector.sendBatchNow();
```

### 3.4 状态管理

```javascript
// 获取收集器状态
const status = collector.getStatus();
console.log("服务器URL:", status.serverUrl);
console.log("是否正在收集:", status.isCollecting);
console.log("错误数量:", status.errorCount);
console.log("发送模式:", status.sendMode);
console.log("待发送错误:", status.pendingErrorsCount);
```

**练习3**：设置一个批量发送的收集器，触发多个相同错误，观察合并效果。

---

## 🎯 阶段4：实战应用

### 4.1 在Vue项目中使用

```javascript
// main.js
import ConsoleErrorCollector from './utils/ConsoleErrorCollector.js';

// 创建全局错误收集器
const errorCollector = new ConsoleErrorCollector({
  targets: ["console.error", "console.warn", "javascript", "promise"],
  autoStart: true,
  sendMode: "batch",
  batchInterval: 5 * 60 * 1000, // 5分钟
  activityId: `USER_${Date.now()}`,
  onError: (error) => {
    console.log("捕获到错误:", error);
  }
});

// 设置服务器接口
errorCollector.setServerUrl("https://your-api.com/errors");

// 将收集器挂载到Vue实例上
app.config.globalProperties.$errorCollector = errorCollector;
```

### 4.2 在组件中使用

```vue
<template>
  <div>
    <button @click="triggerError">触发错误</button>
    <button @click="getErrorStats">查看错误统计</button>
  </div>
</template>

<script>
export default {
  methods: {
    triggerError() {
      // 故意触发错误
      console.error("用户触发的错误");
    },
    
    getErrorStats() {
      const stats = this.$errorCollector.getStats();
      console.log("错误统计:", stats);
    }
  }
}
</script>
```

### 4.3 生产环境配置

```javascript
// 生产环境配置
const isProduction = process.env.NODE_ENV === 'production';

const collector = new ConsoleErrorCollector({
  targets: ["console.error", "console.warn", "javascript", "promise"],
  autoStart: isProduction,
  sendMode: "batch",
  batchInterval: 10 * 60 * 1000, // 生产环境10分钟
  maxErrors: 200,
  activityId: `PROD_${Date.now()}`,
  serverUrl: isProduction ? "https://api.yoursite.com/errors" : null
});
```

### 4.4 错误处理最佳实践

```javascript
// 1. 页面卸载时清理
window.addEventListener('beforeunload', () => {
  collector.destroy();
});

// 2. 定期检查错误状态
setInterval(() => {
  const status = collector.getStatus();
  if (status.errorCount > 50) {
    console.warn("错误数量过多，请检查应用状态");
  }
}, 5 * 60 * 1000);

// 3. 错误回调处理
const collector = new ConsoleErrorCollector({
  onError: (error) => {
    // 可以在这里添加自定义处理逻辑
    if (error.type === 'javascript' && error.data.includes('网络')) {
      // 网络错误特殊处理
      console.log("检测到网络错误，尝试重连...");
    }
  }
});
```

**练习4**：在你的项目中完整集成这个错误收集器，包括生产环境配置。

---

## 🛠️ 常见问题与故障排除

### Q1: 收集器没有捕获到错误？
**检查清单：**
- ✅ 是否调用了 `start()` 方法？
- ✅ `targets` 配置是否包含要监听的错误类型？
- ✅ 错误是否在收集器启动后触发？

### Q2: 批量发送不工作？
**检查清单：**
- ✅ `sendMode` 是否设置为 `"batch"`？
- ✅ 是否设置了 `serverUrl`？
- ✅ `batchInterval` 是否合理？

### Q3: 错误重复发送？
**原因：** 可能是网络问题导致发送失败，但错误没有被标记为已发送
**解决：** 检查服务器接口是否正常，或增加重试机制

### Q4: 内存占用过高？
**原因：** 收集的错误数量过多
**解决：** 调整 `maxErrors` 配置，或定期清理已发送的错误

---

## 📖 API 参考

### 构造函数选项

| 选项                | 类型    | 默认值                                                       | 说明                   |
| ------------------- | ------- | ------------------------------------------------------------ | ---------------------- |
| `targets`           | Array   | `["console.error", "console.warn", "javascript", "promise"]` | 监听的错误类型         |
| `autoStart`         | Boolean | `false`                                                      | 是否自动开始监听       |
| `maxErrors`         | Number  | `100`                                                        | 最大收集错误数量       |
| `sendMode`          | String  | `"immediate"`                                                | 发送模式               |
| `batchInterval`     | Number  | `120000`                                                     | 批量发送间隔(毫秒)     |
| `activityId`        | String  | `null`                                                       | 活动ID                 |
| `useSessionStorage` | Boolean | `true`                                                       | 是否使用sessionStorage |

### 主要方法

| 方法                | 参数   | 返回值 | 说明             |
| ------------------- | ------ | ------ | ---------------- |
| `start()`           | 无     | void   | 开始收集错误     |
| `stop()`            | 无     | void   | 停止收集错误     |
| `getErrors()`       | 无     | Array  | 获取未发送的错误 |
| `getAllErrors()`    | 无     | Array  | 获取所有错误     |
| `getStats()`        | 无     | Object | 获取错误统计     |
| `clearErrors()`     | 无     | void   | 清空错误列表     |
| `setServerUrl(url)` | String | void   | 设置服务器URL    |
| `sendBatchNow()`    | 无     | void   | 立即发送批量错误 |

---

## 🎉 恭喜！

你已经完成了ConsoleErrorCollector的学习！现在你可以：

1. ✅ 理解错误收集器的基本概念
2. ✅ 掌握基本配置和使用方法  
3. ✅ 了解高级特性和批量发送
4. ✅ 在实际项目中应用这个工具

**下一步建议：**
- 在你的项目中实际使用这个收集器
- 根据具体需求调整配置参数
- 监控收集到的错误数据，优化应用质量

**需要帮助？** 查看 `errorCollectorExample.js` 文件中的完整示例代码。