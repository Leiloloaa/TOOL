// 设置页面脚本
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("settingsForm");
  const resetBtn = document.getElementById("resetSettings");
  const exportBtn = document.getElementById("exportSettings");

  // 默认设置
  const defaultSettings = {
    autoAnalyze: true,
    showNotifications: true,
    debugMode: false,
    analysisInterval: 30,
    maxElements: 1000,
    theme: "auto",
    language: "zh-CN",
  };

  // 加载设置
  loadSettings();

  // 保存设置
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    saveSettings();
  });

  // 重置设置
  resetBtn.addEventListener("click", function () {
    if (confirm("确定要重置所有设置吗？")) {
      resetSettings();
    }
  });

  // 导出设置
  exportBtn.addEventListener("click", function () {
    exportSettings();
  });

  // 加载设置函数
  function loadSettings() {
    chrome.storage.sync.get(["settings"], function (result) {
      const settings = result.settings || defaultSettings;

      // 填充表单
      document.getElementById("autoAnalyze").checked = settings.autoAnalyze;
      document.getElementById("showNotifications").checked =
        settings.showNotifications;
      document.getElementById("debugMode").checked = settings.debugMode;
      document.getElementById("analysisInterval").value =
        settings.analysisInterval;
      document.getElementById("maxElements").value = settings.maxElements;
      document.getElementById("theme").value = settings.theme;
      document.getElementById("language").value = settings.language;

      console.log("设置已加载:", settings);
    });
  }

  // 保存设置函数
  function saveSettings() {
    const settings = {
      autoAnalyze: document.getElementById("autoAnalyze").checked,
      showNotifications: document.getElementById("showNotifications").checked,
      debugMode: document.getElementById("debugMode").checked,
      analysisInterval: parseInt(
        document.getElementById("analysisInterval").value
      ),
      maxElements: parseInt(document.getElementById("maxElements").value),
      theme: document.getElementById("theme").value,
      language: document.getElementById("language").value,
    };

    chrome.storage.sync.set({ settings: settings }, function () {
      console.log("设置已保存:", settings);
      showNotification("设置已保存", "success");
    });
  }

  // 重置设置函数
  function resetSettings() {
    chrome.storage.sync.set({ settings: defaultSettings }, function () {
      console.log("设置已重置");
      loadSettings();
      showNotification("设置已重置", "info");
    });
  }

  // 导出设置函数
  function exportSettings() {
    chrome.storage.sync.get(["settings"], function (result) {
      const settings = result.settings || defaultSettings;
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(dataBlob);
      link.download = "dev-tools-settings.json";
      link.click();

      showNotification("设置已导出", "success");
    });
  }

  // 显示通知函数
  function showNotification(message, type = "info") {
    // 创建通知元素
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加样式
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

    // 根据类型设置颜色
    switch (type) {
      case "success":
        notification.style.background = "#27ae60";
        break;
      case "error":
        notification.style.background = "#e74c3c";
        break;
      case "warning":
        notification.style.background = "#f39c12";
        break;
      default:
        notification.style.background = "#3498db";
    }

    // 添加动画样式
    const style = document.createElement("style");
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // 表单验证
  function validateForm() {
    const analysisInterval = parseInt(
      document.getElementById("analysisInterval").value
    );
    const maxElements = parseInt(document.getElementById("maxElements").value);

    if (analysisInterval < 1 || analysisInterval > 300) {
      showNotification("分析间隔必须在1-300秒之间", "error");
      return false;
    }

    if (maxElements < 100 || maxElements > 10000) {
      showNotification("最大元素数必须在100-10000之间", "error");
      return false;
    }

    return true;
  }

  // 添加表单验证
  form.addEventListener("submit", function (e) {
    if (!validateForm()) {
      e.preventDefault();
    }
  });
});
