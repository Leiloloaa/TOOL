// 内容脚本 - 在网页中运行
console.log("开发工具助手内容脚本已加载");

// 监听来自弹出窗口的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("收到消息:", request);

  switch (request.action) {
    case "analyzePage":
      analyzePage()
        .then((result) => {
          sendResponse({ success: true, data: result });
        })
        .catch((error) => {
          console.error("页面分析错误:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开放

    case "monitorPerformance":
      startPerformanceMonitoring()
        .then((result) => {
          sendResponse({ success: true, data: result });
        })
        .catch((error) => {
          console.error("性能监控错误:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case "debugStyles":
      startStyleDebugging()
        .then((result) => {
          sendResponse({ success: true, data: result });
        })
        .catch((error) => {
          console.error("样式调试错误:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case "quickActions":
      performQuickActions()
        .then((result) => {
          sendResponse({ success: true, data: result });
        })
        .catch((error) => {
          console.error("快速操作错误:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    default:
      sendResponse({ success: false, error: "未知操作" });
  }
});

// 页面分析功能
async function analyzePage() {
  const analysis = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString(),
    dom: {
      totalElements: document.querySelectorAll("*").length,
      images: document.querySelectorAll("img").length,
      links: document.querySelectorAll("a").length,
      scripts: document.querySelectorAll("script").length,
      stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
    },
    performance: {
      loadTime: performance.timing
        ? performance.timing.loadEventEnd - performance.timing.navigationStart
        : null,
      domContentLoaded: performance.timing
        ? performance.timing.domContentLoadedEventEnd -
          performance.timing.navigationStart
        : null,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

  console.log("页面分析结果:", analysis);
  return analysis;
}

// 性能监控功能
async function startPerformanceMonitoring() {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log("性能条目:", entry);
    });
  });

  try {
    observer.observe({ entryTypes: ["navigation", "resource", "paint"] });
    console.log("性能监控已启动");
    return { message: "性能监控已启动", observer: true };
  } catch (error) {
    console.error("性能监控启动失败:", error);
    throw error;
  }
}

// 样式调试功能
async function startStyleDebugging() {
  // 添加调试样式
  const debugStyle = document.createElement("style");
  debugStyle.id = "dev-tools-debug-style";
  debugStyle.textContent = `
        .dev-tools-debug-outline {
            outline: 2px solid #ff6b6b !important;
            outline-offset: 2px !important;
        }
        .dev-tools-debug-info {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
        }
    `;
  document.head.appendChild(debugStyle);

  // 添加鼠标悬停效果
  document.addEventListener("mouseover", function (e) {
    if (e.target !== document.body) {
      e.target.classList.add("dev-tools-debug-outline");
    }
  });

  document.addEventListener("mouseout", function (e) {
    e.target.classList.remove("dev-tools-debug-outline");
  });

  console.log("样式调试已启动");
  return { message: "样式调试已启动" };
}

// 快速操作功能
async function performQuickActions() {
  const actions = [];

  // 清除控制台
  console.clear();
  actions.push("控制台已清除");

  // 显示页面信息
  console.log("页面信息:", {
    url: window.location.href,
    title: document.title,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent,
  });
  actions.push("页面信息已输出到控制台");

  // 高亮所有图片
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.style.border = "2px solid #4CAF50";
  });
  actions.push(`高亮了 ${images.length} 个图片`);

  // 显示链接数量
  const links = document.querySelectorAll("a");
  console.log(`页面包含 ${links.length} 个链接`);
  actions.push(`发现 ${links.length} 个链接`);

  return { message: "快速操作完成", actions: actions };
}

// 页面加载完成后的初始化
document.addEventListener("DOMContentLoaded", function () {
  console.log("开发工具助手已就绪");
});
