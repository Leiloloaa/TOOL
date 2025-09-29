// DOM 元素
const selectFolderBtn = document.getElementById("selectFolderBtn");
const selectedPathDiv = document.getElementById("selectedPath");
const processBtn = document.getElementById("processBtn");
const resultArea = document.getElementById("resultArea");
const configPreview = document.getElementById("configPreview");
const copyConfigBtn = document.getElementById("copyConfigBtn");
const navContainer = document.getElementById("navContainer");
const toastContainer = document.getElementById("toastContainer");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingTime = document.getElementById("loadingTime");

// 状态变量
let selectedFolderPath = null;
let isProcessing = false;
let generatedConfig = null;
let startTime = null;
let timeInterval = null;

// 初始化
document.addEventListener("DOMContentLoaded", async () => {
  await loadNavigation();
  setupEventListeners();
});

// 加载导航组件
async function loadNavigation() {
  try {
    const result = await window.electronAPI.loadNavigation("handleReward");
    if (result.success) {
      // 注入CSS样式
      const style = document.createElement("style");
      style.textContent = result.css;
      document.head.appendChild(style);

      // 注入HTML内容
      navContainer.innerHTML = result.html;
    }
  } catch (error) {
    console.error("Failed to load navigation:", error);
  }
}

// 显示 Loading
function showLoading() {
  loadingOverlay.style.display = "flex";
  startTime = Date.now();
  loadingTime.textContent = "等待: 0秒";

  // 开始计时
  timeInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    loadingTime.textContent = `等待: ${elapsed}秒`;
  }, 1000);
}

// 隐藏 Loading
function hideLoading() {
  loadingOverlay.style.display = "none";

  // 停止计时
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }

  // 显示最终耗时
  if (startTime) {
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(`处理完成，总耗时: ${totalTime}秒`);
    startTime = null;
  }
}

// 显示 Toast 通知
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  };

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    </div>
  `;

  toastContainer.appendChild(toast);

  // 触发动画
  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  // 自动移除
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 显示结果
function showResult(configPath, config) {
  // 显示结果区域
  resultArea.style.display = "block";

  // 更新配置预览（自动展开）
  configPreview.textContent = JSON.stringify(config, null, 2);
}

// 添加日志（已注释掉日志区域，所以这个函数不再使用）
// function addLog(message, type = "info") {
//   const logItem = document.createElement("div");
//   logItem.className = `log-item ${type}`;

//   const timestamp = new Date().toLocaleTimeString();
//   logItem.textContent = `[${timestamp}] ${message}`;

//   logContent.appendChild(logItem);

//   // 自动滚动到底部
//   logContent.scrollTop = logContent.scrollHeight;
// }

// 设置事件监听器
function setupEventListeners() {
  // 选择文件夹按钮
  selectFolderBtn.addEventListener("click", async () => {
    if (isProcessing) return;

    // 重置相关状态
    resultArea.style.display = "none";
    generatedConfig = null;

    try {
      const result = await window.electronAPI.selectFolder();
      if (result.canceled) {
        return;
      }

      selectedFolderPath = result.filePath;
      selectedPathDiv.textContent = selectedFolderPath;
      selectedPathDiv.classList.add("has-path");
      processBtn.disabled = false;
    } catch (error) {
      showToast(`选择文件夹失败: ${error.message}`, "error");
    }
  });

  // 生成配置按钮
  processBtn.addEventListener("click", async () => {
    if (!selectedFolderPath || isProcessing) return;

    try {
      isProcessing = true;
      processBtn.disabled = true;
      selectFolderBtn.disabled = true;

      // 显示 Loading
      showLoading();

      // 调用主进程生成配置
      const result =
        await window.electronAPI.generateConfig(selectedFolderPath);

      if (result.success) {
        generatedConfig = result.config;
        showResult(result.configPath, result.config);
        showToast("配置已复制到剪切板！", "success");
      }
    } catch (error) {
      showToast("配置生成失败", "error");
    } finally {
      // 隐藏 Loading
      hideLoading();
      isProcessing = false;
      processBtn.disabled = true; // 重新禁用处理按钮
      selectFolderBtn.disabled = false;

      // 清空文件夹路径
      selectedFolderPath = null;
      selectedPathDiv.textContent = "";
      selectedPathDiv.classList.remove("has-path");
    }
  });

  // 展开/收起预览按钮（已移除，现在自动展开）
  // expandPreviewBtn.addEventListener("click", () => {
  //   configPreview.classList.toggle("collapsed");
  //   expandPreviewBtn.textContent = configPreview.classList.contains("collapsed")
  //     ? "展开"
  //     : "收起";
  // });

  // 复制配置按钮
  copyConfigBtn.addEventListener("click", async () => {
    if (!generatedConfig) return;

    try {
      const configText = JSON.stringify(generatedConfig, null, 2);
      await window.electronAPI.copyToClipboard(configText);
      showToast("配置已复制到剪贴板", "success");
    } catch (error) {
      showToast("复制失败", "error");
    }
  });

  // 清空日志按钮（已注释掉日志区域，所以这个监听器不再使用）
  // clearLogBtn.addEventListener("click", () => {
  //   logContent.innerHTML = "";
  // });
}
