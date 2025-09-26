// 弹出窗口脚本
document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const analyzePageBtn = document.getElementById("analyzePage");
  const monitorPerformanceBtn = document.getElementById("monitorPerformance");
  const debugStylesBtn = document.getElementById("debugStyles");
  const quickActionsBtn = document.getElementById("quickActions");
  const statusInfo = document.getElementById("statusInfo");
  const helpLink = document.getElementById("helpLink");

  // 更新状态显示
  function updateStatus(message, type = "info") {
    const statusText = statusInfo.querySelector(".status-text");
    const statusIndicator = statusInfo.querySelector(".status-indicator");

    statusText.textContent = message;

    // 根据类型设置指示器颜色
    switch (type) {
      case "success":
        statusIndicator.style.background = "#27ae60";
        break;
      case "error":
        statusIndicator.style.background = "#e74c3c";
        break;
      case "warning":
        statusIndicator.style.background = "#f39c12";
        break;
      default:
        statusIndicator.style.background = "#3498db";
    }
  }

  // 页面分析功能
  analyzePageBtn.addEventListener("click", async function () {
    updateStatus("正在分析页面...", "info");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // 向内容脚本发送分析请求
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "analyzePage",
      });

      if (response && response.success) {
        updateStatus("页面分析完成", "success");
        // 可以在这里显示分析结果
        console.log("页面分析结果:", response.data);
      } else {
        updateStatus("页面分析失败", "error");
      }
    } catch (error) {
      console.error("页面分析错误:", error);
      updateStatus("页面分析出错", "error");
    }
  });

  // 性能监控功能
  monitorPerformanceBtn.addEventListener("click", async function () {
    updateStatus("开始性能监控...", "info");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "monitorPerformance",
      });

      if (response && response.success) {
        updateStatus("性能监控已启动", "success");
      } else {
        updateStatus("性能监控启动失败", "error");
      }
    } catch (error) {
      console.error("性能监控错误:", error);
      updateStatus("性能监控出错", "error");
    }
  });

  // 样式调试功能
  debugStylesBtn.addEventListener("click", async function () {
    updateStatus("启动样式调试...", "info");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "debugStyles",
      });

      if (response && response.success) {
        updateStatus("样式调试已启动", "success");
      } else {
        updateStatus("样式调试启动失败", "error");
      }
    } catch (error) {
      console.error("样式调试错误:", error);
      updateStatus("样式调试出错", "error");
    }
  });

  // 快速操作功能
  quickActionsBtn.addEventListener("click", async function () {
    updateStatus("执行快速操作...", "info");

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "quickActions",
      });

      if (response && response.success) {
        updateStatus("快速操作完成", "success");
      } else {
        updateStatus("快速操作失败", "error");
      }
    } catch (error) {
      console.error("快速操作错误:", error);
      updateStatus("快速操作出错", "error");
    }
  });

  // 帮助链接
  helpLink.addEventListener("click", function (e) {
    e.preventDefault();
    chrome.tabs.create({
      url: "https://github.com/your-repo/chrome-extension-help",
    });
  });

  // 初始化状态
  updateStatus("扩展已就绪", "success");
});
