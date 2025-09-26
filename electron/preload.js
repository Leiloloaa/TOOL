// 预加载脚本 - 在主进程和渲染进程之间安全通信
const { contextBridge, ipcRenderer } = require("electron");

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  // 应用信息
  getAppVersion: () => ipcRenderer.invoke("get-app-version"),

  // 存储操作
  getStoreValue: (key) => ipcRenderer.invoke("get-store-value", key),
  setStoreValue: (key, value) =>
    ipcRenderer.invoke("set-store-value", key, value),

  // 对话框
  showSaveDialog: (options) => ipcRenderer.invoke("show-save-dialog", options),
  showOpenDialog: (options) => ipcRenderer.invoke("show-open-dialog", options),
  showMessageBox: (options) => ipcRenderer.invoke("show-message-box", options),

  // 自动更新
  restartApp: () => ipcRenderer.invoke("restart-app"),

  // 监听事件
  onUpdateAvailable: (callback) => ipcRenderer.on("update-available", callback),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update-downloaded", callback),

  // 菜单事件
  onMenuNewProject: (callback) => ipcRenderer.on("menu-new-project", callback),
  onMenuOpenProject: (callback) =>
    ipcRenderer.on("menu-open-project", callback),
  onMenuSettings: (callback) => ipcRenderer.on("menu-settings", callback),

  // 移除监听器
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// 页面加载完成后的初始化
window.addEventListener("DOMContentLoaded", () => {
  console.log("预加载脚本已执行");

  // 设置页面标题
  document.title = "开发工具助手";

  // 添加应用信息到页面
  const appInfo = document.createElement("div");
  appInfo.id = "app-info";
  appInfo.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        display: none;
    `;
  document.body.appendChild(appInfo);

  // 开发模式下显示应用信息
  if (process.env.NODE_ENV === "development") {
    appInfo.style.display = "block";
    appInfo.textContent = "Electron App - 开发模式";
  }
});
