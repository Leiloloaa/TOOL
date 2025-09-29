import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import ConsoleErrorCollector from "./utils/ConsoleErrorCollector.js";

// 创建错误收集器实例
const errorCollector = new ConsoleErrorCollector({
  autoStart: true,
  targets: ["console.error", "console.warn", "javascript", "promise"],
  interval: 2 * 60 * 1000, // 5分钟
  maxErrors: 100,
  activityId: "10003", // 设置活动 ID
  useSessionStorage: true, // 使用 sessionStorage 存储
  storageKey: "vue3_error_collector", // 存储键名
  sendMode: "batch", // batch 批量发送模式 immediate 立即发送模式
  batchInterval: 3 * 1000, // 2分钟批量发送间隔
  onError: (error) => {
    console.log("收到新错误:", error);
  },
});

// 设置服务器接口URL（使用测试服务器）
errorCollector.setServerUrl("https://httpbin.org/post");

// 将错误收集器暴露到全局，方便调试
window.errorCollector = errorCollector;

// 创建 Vue 应用
const app = createApp(App);

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error("Vue 应用错误:", err);
  console.error("组件实例:", instance);
  console.error("错误信息:", info);

  // 将 Vue 错误也收集到错误收集器
  errorCollector.addError("Vue Error", {
    message: err.message,
    stack: err.stack,
    component: instance?.$options.name || "Unknown",
    info: info,
  });
};

// 挂载应用
app.mount("#app");
