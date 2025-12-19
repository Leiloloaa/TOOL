/**
 * 标签页 - 主逻辑
 */

// ========== 配置常量 ==========
const SEARCH_ENGINES = {
  google: {
    name: "Google",
    icon: "https://www.google.com/favicon.ico",
    url: "https://www.google.com/search?q=",
  },
  bing: {
    name: "Bing",
    icon: "https://www.bing.com/favicon.ico",
    url: "https://www.bing.com/search?q=",
  },
  baidu: {
    name: "百度",
    icon: "https://www.baidu.com/favicon.ico",
    url: "https://www.baidu.com/s?wd=",
  },
  duckduckgo: {
    name: "DuckDuckGo",
    icon: "https://duckduckgo.com/favicon.ico",
    url: "https://duckduckgo.com/?q=",
  },
};

const WEEKDAYS = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

// ========== 默认设置 ==========
const DEFAULT_SETTINGS = {
  mode: "minimal", // 'minimal' 或 'widgets'
  searchEngine: "google", // 默认搜索引擎
  wallpaperType: "video", // 'video' 或 'image'
  wallpaperId: "v1", // 当前壁纸ID
  widgets: {
    calendar: true, // 是否显示日历
    countdown: true, // 是否显示倒计时
  },
  countdowns: [], // 多个倒计时列表
  customRestDays: [], // 自定义休息日列表，格式: ["2025-01-15", "2025-01-16"]
  // 保留旧版兼容
  countdown: {
    title: "新年倒计时",
    datetime: `${new Date().getFullYear() + 1}-01-01T00:00`,
  },
};

// ========== 全局状态 ==========
let settings = { ...DEFAULT_SETTINGS };

// ========== 初始化 ==========
document.addEventListener("DOMContentLoaded", async () => {
  await loadSettings();
  initDateTime();
  initSearch();
  initPoem();
  initWallpaper();
  initSettingsPanel();
  initWidgets();
});

// ========== 设置存储 ==========
async function loadSettings() {
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      const result = await chrome.storage.local.get("startPageSettings");
      if (result.startPageSettings) {
        settings = { ...DEFAULT_SETTINGS, ...result.startPageSettings };
      }
    } else {
      // 本地测试时使用 localStorage
      const saved = localStorage.getItem("startPageSettings");
      if (saved) {
        settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    }
  } catch (e) {
    console.error("加载设置失败:", e);
  }

  // 数据迁移：将旧版单个 countdown 迁移到 countdowns 数组
  if (!settings.countdowns) {
    settings.countdowns = [];
  }
  if (
    settings.countdowns.length === 0 &&
    settings.countdown &&
    settings.countdown.datetime
  ) {
    settings.countdowns.push({
      id: "migrated",
      title: settings.countdown.title || "倒计时",
      datetime: settings.countdown.datetime,
    });
    saveSettings();
  }

  applySettings();
}

async function saveSettings() {
  try {
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.local.set({ startPageSettings: settings });
    } else {
      localStorage.setItem("startPageSettings", JSON.stringify(settings));
    }
  } catch (e) {
    console.error("保存设置失败:", e);
  }
}

function applySettings() {
  // 应用模式
  if (settings.mode === "widgets") {
    document.body.classList.add("widgets-mode");
  } else {
    document.body.classList.remove("widgets-mode");
  }

  // 更新模式按钮状态
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === settings.mode);
  });

  // 更新壁纸类型按钮状态
  document.querySelectorAll(".wallpaper-type-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.type === settings.wallpaperType);
  });
}

// ========== 时间日期 ==========
function initDateTime() {
  updateDateTime();
  setInterval(updateDateTime, 1000);
}

function updateDateTime() {
  const now = new Date();

  // 更新时间
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  document.getElementById("time").textContent = `${hours}:${minutes}`;

  // 更新日期
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekday = WEEKDAYS[now.getDay()];
  document.getElementById(
    "date"
  ).textContent = `${year}年${month}月${day}日 ${weekday}`;

  // 更新农历日期
  if (typeof getLunarDateString === "function") {
    const lunarEl = document.getElementById("lunar-date");
    if (lunarEl) {
      lunarEl.textContent = getLunarDateString(now);
    }
  }
}

// ========== 搜索功能 ==========
function initSearch() {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const engineSelector = document.getElementById("engine-selector");
  const engineDropdown = document.getElementById("engine-dropdown");
  const engineIcon = document.getElementById("engine-icon");
  const engineName = document.getElementById("engine-name");

  // 设置当前搜索引擎
  updateSearchEngine(settings.searchEngine);

  // 搜索引擎选择器点击
  engineSelector.addEventListener("click", (e) => {
    e.stopPropagation();
    engineSelector.classList.toggle("active");
    engineDropdown.classList.toggle("show");
  });

  // 选择搜索引擎
  document.querySelectorAll(".engine-option").forEach((option) => {
    option.addEventListener("click", () => {
      const engine = option.dataset.engine;
      updateSearchEngine(engine);
      settings.searchEngine = engine;
      saveSettings();
      engineDropdown.classList.remove("show");
      engineSelector.classList.remove("active");
    });
  });

  // 点击外部关闭下拉菜单
  document.addEventListener("click", () => {
    engineDropdown.classList.remove("show");
    engineSelector.classList.remove("active");
  });

  // 搜索按钮点击
  searchBtn.addEventListener("click", performSearch);

  // 回车搜索
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // 自动聚焦搜索框
  setTimeout(() => searchInput.focus(), 100);
}

function updateSearchEngine(engineKey) {
  const engine = SEARCH_ENGINES[engineKey];
  if (!engine) return;

  document.getElementById("engine-icon").src = engine.icon;
  document.getElementById("engine-name").textContent = engine.name;

  // 更新下拉菜单中的选中状态
  document.querySelectorAll(".engine-option").forEach((option) => {
    option.classList.toggle("active", option.dataset.engine === engineKey);
  });
}

function performSearch() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;

  const engine = SEARCH_ENGINES[settings.searchEngine];
  window.location.href = engine.url + encodeURIComponent(query);
}

// ========== 诗句功能 ==========
function initPoem() {
  showRandomPoem();
  // 每5分钟更换一次语录
  setInterval(showRandomPoem, 300000);
}

function showRandomPoem() {
  const poemElement = document.getElementById("poem");
  // 淡出效果
  poemElement.style.opacity = "0";

  setTimeout(() => {
    poemElement.textContent = getRandomPoem();
    // 淡入效果
    poemElement.style.transition = "opacity 0.5s ease";
    poemElement.style.opacity = "0.9";
  }, 300);
}

// ========== 壁纸功能 ==========
function initWallpaper() {
  loadWallpaper();
  renderWallpaperGrid();
}

function loadWallpaper() {
  const video = document.getElementById("video-wallpaper");
  const container = document.getElementById("wallpaper-container");

  if (settings.wallpaperType === "video") {
    // 视频壁纸
    let wallpaper = getWallpaperById(settings.wallpaperId, "video");

    // 如果找不到匹配的壁纸（可能是类型不匹配），使用默认壁纸
    if (!wallpaper) {
      wallpaper = getDefaultWallpaper("video");
      settings.wallpaperId = wallpaper.id;
      saveSettings();
    }

    console.log("加载视频壁纸:", wallpaper.name, wallpaper.url);

    // 移除可能存在的图片背景
    container.style.backgroundImage = "none";
    container.style.background = "";

    // 显示视频元素
    video.style.display = "block";

    // 先暂停当前视频
    video.pause();

    // 使用 once: true 自动移除事件监听器
    video.addEventListener(
      "canplay",
      () => {
        console.log("视频可以播放");
        video.play().catch((e) => {
          console.log("视频自动播放被阻止:", e);
        });
      },
      { once: true }
    );

    video.addEventListener(
      "error",
      (e) => {
        console.error("视频加载失败:", wallpaper.url, e);
        video.style.display = "none";
        container.style.background =
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)";
      },
      { once: true }
    );

    // 设置视频源并加载
    video.src = wallpaper.url;
    video.load();
  } else {
    // 图片壁纸
    let wallpaper = getWallpaperById(settings.wallpaperId, "image");

    // 如果找不到匹配的壁纸（可能是类型不匹配），使用默认壁纸
    if (!wallpaper) {
      wallpaper = getDefaultWallpaper("image");
      settings.wallpaperId = wallpaper.id;
      saveSettings();
    }

    console.log("加载图片壁纸:", wallpaper.name, wallpaper.url);

    // 隐藏视频
    video.pause();
    video.style.display = "none";
    video.src = "";

    // 设置图片背景
    container.style.background = "";
    container.style.backgroundImage = `url(${wallpaper.url})`;
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";
  }
}

function renderWallpaperGrid() {
  const grid = document.getElementById("wallpaper-grid");
  const wallpapers = getAllWallpapers(settings.wallpaperType);

  grid.innerHTML = wallpapers
    .map(
      (w) => `
    <div class="wallpaper-item ${
      w.id === settings.wallpaperId ? "active" : ""
    }" 
         data-id="${w.id}" data-type="${settings.wallpaperType}">
      <img src="${w.thumbnail}" alt="${w.name}" loading="lazy">
      <span class="wallpaper-label">${w.name}</span>
    </div>
  `
    )
    .join("");

  // 绑定点击事件
  grid.querySelectorAll(".wallpaper-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();

      const newId = item.dataset.id;
      console.log("切换壁纸:", newId, "类型:", settings.wallpaperType);

      settings.wallpaperId = newId;
      saveSettings();
      loadWallpaper();

      // 更新选中状态
      grid
        .querySelectorAll(".wallpaper-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
    });
  });
}

// ========== 设置面板 ==========
function initSettingsPanel() {
  const toggleBtn = document.getElementById("settings-toggle");
  const panel = document.getElementById("settings-panel");
  const closeBtn = document.getElementById("settings-close");

  // 打开设置
  toggleBtn.addEventListener("click", () => {
    panel.classList.add("show");
  });

  // 关闭设置
  closeBtn.addEventListener("click", () => {
    panel.classList.remove("show");
  });

  // 点击面板外部关闭
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !toggleBtn.contains(e.target)) {
      panel.classList.remove("show");
    }
  });

  // 模式切换
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.mode = btn.dataset.mode;
      saveSettings();
      applySettings();
    });
  });

  // 壁纸类型切换
  document.querySelectorAll(".wallpaper-type-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      settings.wallpaperType = btn.dataset.type;
      // 重置壁纸ID为该类型的第一个
      const defaultWallpaper = getDefaultWallpaper(settings.wallpaperType);
      settings.wallpaperId = defaultWallpaper.id;
      saveSettings();
      applySettings();
      loadWallpaper();
      renderWallpaperGrid();
    });
  });

  // 组件开关
  document.getElementById("toggle-calendar").checked =
    settings.widgets.calendar;
  document.getElementById("toggle-countdown").checked =
    settings.widgets.countdown;

  document.getElementById("toggle-calendar").addEventListener("change", (e) => {
    settings.widgets.calendar = e.target.checked;
    saveSettings();
    toggleWidget("calendar", e.target.checked);
  });

  document
    .getElementById("toggle-countdown")
    .addEventListener("change", (e) => {
      settings.widgets.countdown = e.target.checked;
      saveSettings();
      toggleWidget("countdown", e.target.checked);
    });

  // 倒计时设置
  const countdownTitle = document.getElementById("countdown-title");
  const countdownDatetime = document.getElementById("countdown-datetime");
  const addCountdownBtn = document.getElementById("add-countdown");
  const cancelEditBtn = document.getElementById("cancel-edit-countdown");
  const formLabel = document.getElementById("countdown-form-label");

  // 渲染倒计时管理列表
  renderCountdownManageList();

  // 添加/保存按钮
  addCountdownBtn.addEventListener("click", () => {
    const title = countdownTitle.value.trim();
    const datetime = countdownDatetime.value;

    if (!datetime) {
      alert("请选择目标时间");
      return;
    }

    // 使用统一的保存函数
    if (typeof saveCountdown === "function") {
      saveCountdown(title, datetime);
    }

    // 更新管理列表
    renderCountdownManageList();

    // 显示成功提示
    const isEditing = editingCountdownIndex >= 0;
    const originalText = addCountdownBtn.textContent;
    addCountdownBtn.textContent = isEditing ? "已保存" : "已添加";
    setTimeout(() => {
      addCountdownBtn.textContent = "添加";
    }, 1500);
  });

  // 取消编辑按钮
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      if (typeof cancelEditCountdown === "function") {
        cancelEditCountdown();
      }
      renderCountdownManageList();
    });
  }
}

// ========== 组件管理 ==========
function initWidgets() {
  // 初始化组件可见性
  toggleWidget("calendar", settings.widgets.calendar);
  toggleWidget("countdown", settings.widgets.countdown);

  // 组件关闭按钮
  document.querySelectorAll(".widget-close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const widgetName = btn.dataset.widget;
      settings.widgets[widgetName] = false;
      document.getElementById(`toggle-${widgetName}`).checked = false;
      saveSettings();
      toggleWidget(widgetName, false);
    });
  });

  // 初始化日历组件
  if (typeof initCalendar === "function") {
    initCalendar();
  }

  // 初始化倒计时组件
  if (typeof initCountdown === "function") {
    initCountdown();
  }
}

function toggleWidget(name, visible) {
  const widget = document.getElementById(`${name}-widget`);
  if (widget) {
    widget.classList.toggle("hidden", !visible);
  }
}

// ========== 倒计时管理 ==========
function renderCountdownManageList() {
  const container = document.getElementById("countdown-manage-list");
  if (!container) return;

  const countdowns = settings.countdowns || [];

  if (countdowns.length === 0) {
    container.innerHTML = '<p class="countdown-manage-empty">暂无倒计时</p>';
    return;
  }

  container.innerHTML = countdowns
    .map(
      (item, index) => `
    <div class="countdown-manage-item ${
      editingCountdownIndex === index ? "editing" : ""
    }" data-index="${index}">
      <div class="countdown-manage-info">
        <span class="countdown-manage-title">${item.title}</span>
        <span class="countdown-manage-time">${formatManageDate(
          item.datetime
        )}</span>
      </div>
      <div class="countdown-manage-actions">
        <button class="countdown-manage-edit" data-index="${index}">编辑</button>
        <button class="countdown-manage-delete" data-index="${index}">删除</button>
      </div>
    </div>
  `
    )
    .join("");

  // 绑定编辑事件
  container.querySelectorAll(".countdown-manage-edit").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      if (typeof startEditCountdown === "function") {
        startEditCountdown(index);
        renderCountdownManageList();
      }
    });
  });

  // 绑定删除事件
  container.querySelectorAll(".countdown-manage-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      if (typeof deleteCountdown === "function") {
        deleteCountdown(index);
        renderCountdownManageList();
      }
    });
  });
}

function formatManageDate(datetime) {
  if (!datetime) return "";
  const date = new Date(datetime);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
}

// ========== 工具函数 ==========
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
