// DOM 元素
const selectFolderBtn = document.getElementById("selectFolderBtn");
const selectedPathDiv = document.getElementById("selectedPath");
const processBtn = document.getElementById("processBtn");
const progressArea = document.getElementById("progressArea");
const logContent = document.getElementById("logContent");
const clearLogBtn = document.getElementById("clearLogBtn");
const navContainer = document.getElementById("navContainer");
const toastContainer = document.getElementById("toastContainer");
const loadingOverlay = document.getElementById("loadingOverlay");
const loadingTime = document.getElementById("loadingTime");
const customPrefixGroup = document.getElementById("customPrefixGroup");
const customPrefix = document.getElementById("customPrefix");

// 状态变量
let selectedFolderPath = null;
let isProcessing = false;
let startTime = null;
let timeInterval = null;

// 初始化
document.addEventListener("DOMContentLoaded", async () => {
  await loadNavigation();
  setupEventListeners();
  setupProgressListeners();
});

// 加载导航组件
async function loadNavigation() {
  try {
    const result = await window.electronAPI.loadNavigation("handleImg");
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

// 设置事件监听器
function setupEventListeners() {
  // 选择文件夹按钮
  selectFolderBtn.addEventListener("click", async () => {
    if (isProcessing) return;

    // 重置相关状态
    progressArea.style.display = "none";
    logContent.innerHTML = "";

    try {
      const result = await window.electronAPI.selectFolder();
      if (result.canceled) {
        addLog("用户取消了文件夹选择", "info");
        return;
      }

      selectedFolderPath = result.filePath;
      selectedPathDiv.textContent = selectedFolderPath;
      selectedPathDiv.classList.add("has-path");
      processBtn.disabled = false;

      addLog(`已选择文件夹: ${selectedFolderPath}`, "success");
    } catch (error) {
      addLog(`选择文件夹失败: ${error.message}`, "error");
    }
  });

  // 开始处理按钮
  processBtn.addEventListener("click", async () => {
    if (!selectedFolderPath || isProcessing) return;

    const selectedMode = document.querySelector(
      'input[name="namingMode"]:checked'
    );

    if (!selectedMode) {
      showToast("请选择命名模式", "error");
      return;
    }

    const namingMode = selectedMode.value;

    // 检查自定义前缀
    if (namingMode === "custom") {
      const prefix = customPrefix.value.trim();
      if (!prefix) {
        showToast("请输入自定义前缀", "error");
        customPrefix.focus();
        return;
      }

      // 将自定义前缀作为参数传递
      const customNamingMode = `custom:${prefix}`;

      try {
        isProcessing = true;
        processBtn.disabled = true;
        selectFolderBtn.disabled = true;

        // 显示进度区域
        progressArea.style.display = "block";

        // 重置进度
        addLog("开始处理图片...", "info");

        // 显示 Loading
        showLoading();

        // 获取清理选项
        const removeExtractedDirs = document.getElementById("removeExtractedDirs").checked;

        // 调用主进程处理图片
        await window.electronAPI.processImages(
          selectedFolderPath,
          customNamingMode,
          { removeExtractedDirs }
        );
      } catch (error) {
        addLog(`处理失败: ${error.message}`, "error");
        showToast("处理失败，请查看日志", "error");
      } finally {
        // 隐藏 Loading
        hideLoading();
        resetUI();
      }
    } else {
      // 原有的处理逻辑
      try {
        isProcessing = true;
        processBtn.disabled = true;
        selectFolderBtn.disabled = true;

        // 显示进度区域
        progressArea.style.display = "block";

        // 重置进度
        addLog("开始处理图片...", "info");

        // 显示 Loading
        showLoading();

        // 获取清理选项
        const removeExtractedDirs = document.getElementById("removeExtractedDirs").checked;

        // 调用主进程处理图片
        await window.electronAPI.processImages(selectedFolderPath, namingMode, { removeExtractedDirs });
      } catch (error) {
        addLog(`处理失败: ${error.message}`, "error");
        showToast("处理失败，请查看日志", "error");
      } finally {
        // 隐藏 Loading
        hideLoading();
        resetUI();
      }
    }
  });

  // 清空日志按钮
  clearLogBtn.addEventListener("click", () => {
    logContent.innerHTML = "";
  });

  // 命名模式单选按钮事件
  const namingModeRadios = document.querySelectorAll(
    'input[name="namingMode"]'
  );
  namingModeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.value === "custom") {
        customPrefixGroup.style.display = "block";
        customPrefix.focus();
      } else {
        customPrefixGroup.style.display = "none";
        customPrefix.value = "";
      }
    });
  });
}

// 设置进度监听器
function setupProgressListeners() {
  // 监听处理日志
  window.electronAPI.onLog((event, data) => {
    addLog(data.message, data.type);
  });

  // 监听处理完成
  window.electronAPI.onComplete((event, data) => {
    addLog("处理完成！", "success");
    showToast("图片处理完成！", "success");
    hideLoading();
    resetUI();
  });

  // 监听处理错误
  window.electronAPI.onError((event, data) => {
    addLog(`处理错误: ${data.message}`, "error");
    showToast("处理失败，请查看日志", "error");
    hideLoading();
    resetUI();
  });
}

// 添加日志
function addLog(message, type = "info") {
  const logItem = document.createElement("div");
  logItem.className = `log-item ${type}`;

  const timestamp = new Date().toLocaleTimeString();
  logItem.textContent = `[${timestamp}] ${message}`;

  logContent.appendChild(logItem);
}

// 重置UI状态
function resetUI() {
  isProcessing = false;
  processBtn.disabled = true; // 重新禁用处理按钮
  selectFolderBtn.disabled = false;

  // 清空文件夹路径
  selectedFolderPath = null;
  selectedPathDiv.textContent = "";
  selectedPathDiv.classList.remove("has-path");
}

// 页面卸载时清理监听器
window.addEventListener("beforeunload", () => {
  window.electronAPI.removeAllListeners("processing-log");
  window.electronAPI.removeAllListeners("processing-complete");
  window.electronAPI.removeAllListeners("processing-error");
});
