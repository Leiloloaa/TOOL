const { contextBridge, ipcRenderer } = require("electron");

// 暴露安全的API到渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
  // 选择文件夹
  selectFolder: () => ipcRenderer.invoke("select-folder"),

  // 处理图片
  processImages: (folderPath, namingMode, options = {}) =>
    ipcRenderer.invoke("process-images", folderPath, namingMode, options),

  // 生成配置
  generateConfig: (folderPath) =>
    ipcRenderer.invoke("generate-config", folderPath),

  // 复制到剪贴板
  copyToClipboard: (text) => ipcRenderer.invoke("copy-to-clipboard", text),

  // 加载导航组件
  loadNavigation: (currentPage) =>
    ipcRenderer.invoke("load-navigation", currentPage),

  // 监听处理进度
  onProgress: (callback) => ipcRenderer.on("processing-progress", callback),

  // 监听处理日志
  onLog: (callback) => ipcRenderer.on("processing-log", callback),

  // 监听处理完成
  onComplete: (callback) => ipcRenderer.on("processing-complete", callback),

  // 监听处理错误
  onError: (callback) => ipcRenderer.on("processing-error", callback),

  // 移除监听器
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),

  // 创建活动相关API
  getActivityInfo: () => ipcRenderer.invoke("get-activity-info"),
  submitActivity: (data) => ipcRenderer.invoke("submit-activity", data),
  uploadActivityText: (data) =>
    ipcRenderer.invoke("upload-activity-text", data),
  updateActivityBase: (data) =>
    ipcRenderer.invoke("update-activity-base", data),
  sendActivityText: (data) => ipcRenderer.invoke("send-activity-text", data),

  // 文件选择API
  selectFile: (options) => ipcRenderer.invoke("select-file", options),

  // 文件读取API
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),

  // 文件夹监听API
  startWatchFolder: (folderPath, namingMode, options = {}) =>
    ipcRenderer.invoke("start-watch-folder", folderPath, namingMode, options),
  stopWatchFolder: () => ipcRenderer.invoke("stop-watch-folder"),

  // 监听器
  onFileChange: (callback) => ipcRenderer.on("file-change", callback),
  onImageProcessStart: (callback) =>
    ipcRenderer.on("image-process-start", callback),
  onImageProcessComplete: (callback) =>
    ipcRenderer.on("image-process-complete", callback),
  onImageProcessError: (callback) =>
    ipcRenderer.on("image-process-error", callback),
  onWatchError: (callback) => ipcRenderer.on("watch-error", callback),
  onWatchStop: (callback) => ipcRenderer.on("watch-stop", callback),
});
