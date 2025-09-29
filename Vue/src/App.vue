<template>
  <div id="app">
    <main class="main">
      <div class="error-collector-section">
        <h2>错误收集器</h2>
        <div class="error-controls">
          <button @click="printAllErrors" class="btn btn-secondary">
            打印所有错误
          </button>

          <button @click="clearAllErrors" class="btn btn-warning">
            清空所有错误
          </button>

          <button @click="checkStatus" class="btn btn-success">查看状态</button>

          <button @click="sendBatchNow" class="btn btn-secondary">
            立即发送批量错误
          </button>

          <button @click="toggleSendMode" class="btn btn-info">
            切换发送模式
          </button>

          <button @click="generateTestError" class="btn btn-info">
            生成测试错误
          </button>
          <button @click="generateReferenceError" class="btn btn-danger">
            生成 ReferenceError
          </button>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>Vue3 + Vite 模板项目</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
// 错误收集器实例现在在 main.js 中创建
// 通过全局变量访问，添加安全检查
const errorCollector = window.errorCollector || {
  getErrors: () => [],
  getAllErrors: () => [],
  getStats: () => ({ total: 0, byType: {}, recent: [] }),
  clearErrors: () => {},
  start: () => {},
  stop: () => {},
  manualCheck: () => {},
  startAutoCheck: () => {},
  stopAutoCheck: () => {},
  saveToSessionStorage: () => {},
  loadFromSessionStorage: () => {},
  destroy: () => {},
};

const printAllErrors = () => {
  // 检查错误收集器是否可用
  if (!window.errorCollector) {
    console.log("⚠️ 错误收集器尚未初始化，请稍后再试");
    return;
  }

  // 获取所有错误（包括已发送的）
  const allErrors = errorCollector.getAllErrors();
  const unsentErrors = errorCollector.getErrors();

  if (allErrors.length === 0) {
    console.log("📝 当前没有收集到任何错误");
    return;
  }

  console.log(
    `📊 所有收集到的错误 (共 ${allErrors.length} 个，未发送 ${unsentErrors.length} 个):`
  );
  allErrors.forEach((error, index) => {
    // 格式化时间
    const time = new Date(error.timestamp).toLocaleString("zh-CN");

    // 截取错误信息（最多80个字符）
    const shortData =
      error.data.length > 80 ? error.data.substring(0, 80) + "..." : error.data;

    // 发送状态
    const sentStatus = error.isSent ? "✅已发送" : "⏳未发送";

    // 精炼的打印格式
    console.log(
      `${index + 1}. [${error.type}] ${shortData} | ${time} | ${
        error.url
      } | ${sentStatus}`
    );
  });
  console.log(`✅ 已打印 ${allErrors.length} 个错误到控制台`);
};

const clearAllErrors = () => {
  // 检查错误收集器是否可用
  if (!window.errorCollector) {
    console.log("⚠️ 错误收集器尚未初始化，请稍后再试");
    return;
  }

  const errorCount = errorCollector.getErrors().length;
  errorCollector.clearErrors();
  console.log(`🗑️ 已清空 ${errorCount} 个错误`);
};

const checkStatus = () => {
  // 检查错误收集器是否可用
  if (!window.errorCollector) {
    console.log("⚠️ 错误收集器尚未初始化，请稍后再试");
    return;
  }

  const status = errorCollector.getStatus();
  console.log("📊 状态:", status);
  console.log(`🌐 服务器URL: ${status.serverUrl || "未设置"}`);
  console.log(`🔄 正在收集: ${status.isCollecting ? "是" : "否"}`);
  console.log(`📝 未发送错误: ${status.errorCount}`);
  console.log(`📊 总错误数量: ${status.totalErrorCount}`);
  console.log(`✅ 已发送错误: ${status.sentErrorCount}`);
  console.log(`📤 发送模式: ${status.sendMode}`);
  console.log(`📦 待发送错误: ${status.pendingErrorsCount}`);
  console.log(`⏰ 批量定时器: ${status.batchTimerActive ? "活跃" : "未激活"}`);
};

const sendBatchNow = () => {
  // 检查错误收集器是否可用
  if (!window.errorCollector) {
    console.log("⚠️ 错误收集器尚未初始化，请稍后再试");
    return;
  }

  errorCollector.sendBatchNow();
  console.log("📦 已触发立即发送批量错误");
};

const toggleSendMode = () => {
  // 检查错误收集器是否可用
  if (!window.errorCollector) {
    console.log("⚠️ 错误收集器尚未初始化，请稍后再试");
    return;
  }

  const currentMode = errorCollector.getStatus().sendMode;
  const newMode = currentMode === "immediate" ? "batch" : "immediate";
  errorCollector.setSendMode(newMode);
  console.log(`📤 发送模式已切换为: ${newMode}`);
};

const generateTestError = () => {
  // 生成不同类型的测试错误
  console.error("这是一个测试错误 - console.error");
  // console.warn("这是一个测试警告 - console.warn");

  // // 生成 JavaScript 错误
  // try {
  //   throw new Error("这是一个测试的 JavaScript 错误");
  // } catch (e) {
  //   console.error("捕获的测试错误:", e);
  // }
  // // 生成 Promise 拒绝
  // Promise.reject("这是一个测试的 Promise 拒绝");
};

const generateReferenceError = () => {
  // 生成 ReferenceError - 访问未定义的变量
  try {
    // 这会触发 ReferenceError
    console.log(undefinedVariable);
  } catch (e) {
    console.error("捕获的 ReferenceError:", e);
  }

  // 或者直接触发 ReferenceError（不会被 try-catch 捕获，但会被全局错误处理器捕获）
  setTimeout(() => {
    // 这会在下一个事件循环中触发 ReferenceError
    console.log(anotherUndefinedVariable);
  }, 100);

  updateErrorStats();
};
</script>

<style scoped>
.header {
  text-align: center;
  padding: 2rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
}

.header p {
  margin: 0;
  opacity: 0.9;
}

.main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.counter-section,
.todo-section,
.error-collector-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.counter-section h2,
.todo-section h2,
.error-collector-section h2 {
  margin-top: 0;
  color: #333;
}

.counter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.count {
  font-size: 2rem;
  font-weight: bold;
  min-width: 3rem;
  text-align: center;
}

.todo-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.todo-input-field {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item .completed {
  text-decoration: line-through;
  color: #999;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.footer {
  text-align: center;
  padding: 2rem 0;
  margin-top: 2rem;
  background: #f8f9fa;
  color: #666;
}

/* 错误收集器样式 */
.error-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.error-stats {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error-stats p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.status-active {
  color: #28a745;
  font-weight: bold;
}

.status-inactive {
  color: #dc3545;
  font-weight: bold;
}

.recent-errors {
  margin-top: 1rem;
}

.recent-errors h3 {
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.error-list {
  max-height: 300px;
  overflow-y: auto;
}

.error-item {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
}

.error-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.error-type {
  background: #dc3545;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
  font-weight: bold;
}

.error-time {
  font-size: 0.8rem;
  color: #666;
}

.error-content {
  font-family: "Courier New", monospace;
  font-size: 0.85rem;
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 3px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 100px;
  overflow-y: auto;
}
</style>
