// 渲染进程脚本
document.addEventListener("DOMContentLoaded", function () {
  console.log("渲染进程已加载");

  // 初始化应用
  initializeApp();

  // 绑定事件监听器
  bindEventListeners();

  // 加载应用数据
  loadAppData();
});

// 初始化应用
function initializeApp() {
  // 设置当前时间
  updateTime();
  setInterval(updateTime, 1000);

  // 加载应用版本
  loadAppVersion();

  // 加载平台信息
  loadPlatformInfo();

  // 加载设置
  loadSettings();
}

// 绑定事件监听器
function bindEventListeners() {
  // 导航按钮
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      switchTab(this.dataset.tab);
    });
  });

  // 快速操作按钮
  document.querySelectorAll(".quick-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      handleQuickAction(this.dataset.action);
    });
  });

  // 新建项目按钮
  document.getElementById("newProjectBtn").addEventListener("click", () => {
    showNewProjectModal();
  });

  // 添加项目按钮
  document.getElementById("addProjectBtn").addEventListener("click", () => {
    showNewProjectModal();
  });

  // 设置按钮
  document.getElementById("saveSettings").addEventListener("click", () => {
    saveSettings();
  });

  document.getElementById("resetSettings").addEventListener("click", () => {
    resetSettings();
  });

  // 模态框事件
  bindModalEvents();

  // 菜单事件监听
  if (window.electronAPI) {
    window.electronAPI.onMenuNewProject(() => {
      showNewProjectModal();
    });

    window.electronAPI.onMenuOpenProject((event, projectPath) => {
      openProject(projectPath);
    });

    window.electronAPI.onMenuSettings(() => {
      switchTab("settings");
    });
  }
}

// 切换标签页
function switchTab(tabName) {
  // 隐藏所有标签页内容
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // 移除所有导航按钮的激活状态
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // 显示选中的标签页
  document.getElementById(tabName).classList.add("active");

  // 激活对应的导航按钮
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  console.log("切换到标签页:", tabName);
}

// 处理快速操作
function handleQuickAction(action) {
  switch (action) {
    case "new-project":
      showNewProjectModal();
      break;
    case "open-project":
      openProjectDialog();
      break;
    case "recent-projects":
      showRecentProjects();
      break;
    default:
      console.log("未知操作:", action);
  }
}

// 显示新建项目模态框
function showNewProjectModal() {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  modalTitle.textContent = "新建项目";
  modalBody.innerHTML = `
        <div class="form-group">
            <label for="projectName">项目名称:</label>
            <input type="text" id="projectName" class="form-input" placeholder="输入项目名称">
        </div>
        <div class="form-group">
            <label for="projectPath">项目路径:</label>
            <input type="text" id="projectPath" class="form-input" placeholder="选择项目路径" readonly>
            <button class="btn btn-secondary" id="selectPathBtn">选择路径</button>
        </div>
        <div class="form-group">
            <label for="projectType">项目类型:</label>
            <select id="projectType" class="form-select">
                <option value="web">Web项目</option>
                <option value="desktop">桌面应用</option>
                <option value="mobile">移动应用</option>
                <option value="other">其他</option>
            </select>
        </div>
    `;

  modal.classList.add("show");

  // 绑定路径选择按钮
  document.getElementById("selectPathBtn").addEventListener("click", () => {
    selectProjectPath();
  });

  // 绑定确认按钮
  document.getElementById("modalConfirm").onclick = () => {
    createProject();
  };
}

// 选择项目路径
async function selectProjectPath() {
  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.showOpenDialog({
        properties: ["openDirectory"],
        title: "选择项目文件夹",
      });

      if (!result.canceled) {
        document.getElementById("projectPath").value = result.filePaths[0];
      }
    } catch (error) {
      console.error("选择路径失败:", error);
    }
  }
}

// 创建项目
function createProject() {
  const projectName = document.getElementById("projectName").value;
  const projectPath = document.getElementById("projectPath").value;
  const projectType = document.getElementById("projectType").value;

  if (!projectName || !projectPath) {
    alert("请填写项目名称和路径");
    return;
  }

  // 这里可以添加创建项目的逻辑
  console.log("创建项目:", { projectName, projectPath, projectType });

  // 关闭模态框
  closeModal();

  // 显示成功消息
  showNotification("项目创建成功", "success");
}

// 打开项目对话框
async function openProjectDialog() {
  if (window.electronAPI) {
    try {
      const result = await window.electronAPI.showOpenDialog({
        properties: ["openDirectory"],
        title: "选择项目文件夹",
      });

      if (!result.canceled) {
        openProject(result.filePaths[0]);
      }
    } catch (error) {
      console.error("打开项目失败:", error);
    }
  }
}

// 打开项目
function openProject(projectPath) {
  console.log("打开项目:", projectPath);
  // 这里可以添加打开项目的逻辑
  showNotification("项目已打开", "success");
}

// 显示最近项目
function showRecentProjects() {
  console.log("显示最近项目");
  // 这里可以添加显示最近项目的逻辑
}

// 绑定模态框事件
function bindModalEvents() {
  const modal = document.getElementById("modal");
  const closeBtn = document.querySelector(".modal-close");
  const cancelBtn = document.getElementById("modalCancel");

  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// 关闭模态框
function closeModal() {
  document.getElementById("modal").classList.remove("show");
}

// 加载应用数据
async function loadAppData() {
  // 加载项目数据
  await loadProjects();

  // 加载统计信息
  updateStats();
}

// 加载应用版本
async function loadAppVersion() {
  if (window.electronAPI) {
    try {
      const version = await window.electronAPI.getAppVersion();
      document.getElementById("appVersion").textContent = version;
    } catch (error) {
      console.error("加载版本信息失败:", error);
    }
  }
}

// 加载平台信息
function loadPlatformInfo() {
  const platform = navigator.platform;
  document.getElementById("platform").textContent = platform;
}

// 加载项目数据
async function loadProjects() {
  // 这里可以添加从存储加载项目的逻辑
  console.log("加载项目数据");
}

// 更新统计信息
function updateStats() {
  // 这里可以添加更新统计信息的逻辑
  document.getElementById("totalProjects").textContent = "0";
  document.getElementById("recentProjects").textContent = "0";
}

// 加载设置
async function loadSettings() {
  if (window.electronAPI) {
    try {
      const autoStart = await window.electronAPI.getStoreValue("autoStart");
      const showNotifications = await window.electronAPI.getStoreValue(
        "showNotifications"
      );
      const theme = await window.electronAPI.getStoreValue("theme");
      const language = await window.electronAPI.getStoreValue("language");

      if (autoStart !== undefined) {
        document.getElementById("autoStart").checked = autoStart;
      }
      if (showNotifications !== undefined) {
        document.getElementById("showNotifications").checked =
          showNotifications;
      }
      if (theme) {
        document.getElementById("theme").value = theme;
      }
      if (language) {
        document.getElementById("language").value = language;
      }
    } catch (error) {
      console.error("加载设置失败:", error);
    }
  }
}

// 保存设置
async function saveSettings() {
  if (window.electronAPI) {
    try {
      const settings = {
        autoStart: document.getElementById("autoStart").checked,
        showNotifications: document.getElementById("showNotifications").checked,
        theme: document.getElementById("theme").value,
        language: document.getElementById("language").value,
      };

      for (const [key, value] of Object.entries(settings)) {
        await window.electronAPI.setStoreValue(key, value);
      }

      showNotification("设置已保存", "success");
    } catch (error) {
      console.error("保存设置失败:", error);
      showNotification("保存设置失败", "error");
    }
  }
}

// 重置设置
async function resetSettings() {
  if (confirm("确定要重置所有设置吗？")) {
    if (window.electronAPI) {
      try {
        // 重置为默认值
        const defaultSettings = {
          autoStart: true,
          showNotifications: true,
          theme: "auto",
          language: "zh-CN",
        };

        for (const [key, value] of Object.entries(defaultSettings)) {
          await window.electronAPI.setStoreValue(key, value);
        }

        // 更新界面
        document.getElementById("autoStart").checked =
          defaultSettings.autoStart;
        document.getElementById("showNotifications").checked =
          defaultSettings.showNotifications;
        document.getElementById("theme").value = defaultSettings.theme;
        document.getElementById("language").value = defaultSettings.language;

        showNotification("设置已重置", "success");
      } catch (error) {
        console.error("重置设置失败:", error);
        showNotification("重置设置失败", "error");
      }
    }
  }
}

// 更新时间显示
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("statusTime").textContent = timeString;
}

// 显示通知
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
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // 3秒后自动移除
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
