// 后台脚本 - 扩展的后台服务
console.log("开发工具助手后台脚本已加载");

// 扩展安装时的初始化
chrome.runtime.onInstalled.addListener((details) => {
  console.log("扩展安装/更新:", details.reason);

  if (details.reason === "install") {
    // 首次安装时的设置
    chrome.storage.sync.set({
      settings: {
        autoAnalyze: true,
        showNotifications: true,
        debugMode: false,
      },
    });

    // 显示欢迎页面
    chrome.tabs.create({
      url: chrome.runtime.getURL("welcome.html"),
    });
  }
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    console.log("标签页加载完成:", tab.url);

    // 可以在这里执行一些自动化的操作
    // 比如自动分析页面性能等
  }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("后台收到消息:", request);

  switch (request.action) {
    case "getSettings":
      chrome.storage.sync.get(["settings"], (result) => {
        sendResponse({ success: true, data: result.settings || {} });
      });
      return true;

    case "saveSettings":
      chrome.storage.sync.set({ settings: request.settings }, () => {
        sendResponse({ success: true });
      });
      return true;

    case "getTabInfo":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          sendResponse({
            success: true,
            data: {
              id: tabs[0].id,
              url: tabs[0].url,
              title: tabs[0].title,
              status: tabs[0].status,
            },
          });
        } else {
          sendResponse({ success: false, error: "未找到活动标签页" });
        }
      });
      return true;

    default:
      sendResponse({ success: false, error: "未知操作" });
  }
});

// 定期清理存储的数据
chrome.alarms.create("cleanup", { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "cleanup") {
    console.log("执行定期清理");
    // 这里可以添加清理逻辑
  }
});

// 处理扩展图标点击
chrome.action.onClicked.addListener((tab) => {
  console.log("扩展图标被点击");
  // 可以在这里添加点击图标的逻辑
});
