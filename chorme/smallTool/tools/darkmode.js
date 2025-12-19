// 暗黑模式切换工具
const DarkModeTool = {
  toggleBtn: null,
  brightnessSlider: null,
  contrastSlider: null,
  brightnessValue: null,
  contrastValue: null,
  isActive: false,

  init() {
    this.toggleBtn = document.getElementById("darkmode-toggle-btn");
    this.brightnessSlider = document.getElementById("darkmode-brightness");
    this.contrastSlider = document.getElementById("darkmode-contrast");
    this.brightnessValue = document.getElementById("brightness-value");
    this.contrastValue = document.getElementById("contrast-value");

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggleDarkMode());
    }

    // 亮度滑块
    if (this.brightnessSlider) {
      this.brightnessSlider.addEventListener("input", (e) => {
        this.brightnessValue.textContent = e.target.value;
        if (this.isActive) {
          this.applyDarkMode();
        }
      });
    }

    // 对比度滑块
    if (this.contrastSlider) {
      this.contrastSlider.addEventListener("input", (e) => {
        this.contrastValue.textContent = e.target.value;
        if (this.isActive) {
          this.applyDarkMode();
        }
      });
    }

    // 初始化时检查当前页面的暗黑模式状态
    this.checkCurrentStatus();
  },

  /**
   * 检查当前页面的暗黑模式状态
   */
  async checkCurrentStatus() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) return;

      // 检查是否为受限页面
      if (this.isRestrictedUrl(tab.url)) {
        this.updateUI(false);
        return;
      }

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const style = document.getElementById("__darkmode_extension_style__");
          return style !== null;
        },
      });

      if (results && results[0]) {
        this.isActive = results[0].result;
        this.updateUI(this.isActive);
      }
    } catch (error) {
      console.log("检查状态失败:", error);
    }
  },

  /**
   * 检查是否为受限 URL
   */
  isRestrictedUrl(url) {
    if (!url) return true;
    return (
      url.startsWith("chrome://") ||
      url.startsWith("chrome-extension://") ||
      url.startsWith("edge://") ||
      url.startsWith("about:") ||
      url.startsWith("file://")
    );
  },

  /**
   * 切换暗黑模式
   */
  async toggleDarkMode() {
    this.isActive = !this.isActive;

    if (this.isActive) {
      await this.applyDarkMode();
    } else {
      await this.removeDarkMode();
    }
  },

  /**
   * 应用暗黑模式到当前页面
   */
  async applyDarkMode() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        window.showStatusMessage("无法获取当前标签页", "error");
        return;
      }

      // 检查是否为受限页面
      if (this.isRestrictedUrl(tab.url)) {
        window.showStatusMessage("此页面不支持暗黑模式", "error");
        this.isActive = false;
        this.updateUI(false);
        return;
      }

      const brightness = this.brightnessSlider.value;
      const contrast = this.contrastSlider.value;

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (brightness, contrast) => {
          // 移除已有的样式
          const existingStyle = document.getElementById(
            "__darkmode_extension_style__"
          );
          if (existingStyle) {
            existingStyle.remove();
          }

          // 创建暗黑模式样式
          const style = document.createElement("style");
          style.id = "__darkmode_extension_style__";
          style.textContent = `
            html {
              filter: invert(1) hue-rotate(180deg) brightness(${
                brightness / 100
              }) contrast(${contrast / 100}) !important;
              background-color: #111 !important;
            }
            
            /* 还原图片、视频、Canvas、SVG 等媒体元素 */
            img,
            video,
            canvas,
            svg,
            picture,
            [style*="background-image"],
            iframe {
              filter: invert(1) hue-rotate(180deg) !important;
            }
            
            /* 还原 emoji */
            .emoji,
            [data-emoji] {
              filter: invert(1) hue-rotate(180deg) !important;
            }
            
            /* 确保背景图不被反转两次 */
            [style*="background-image"] img,
            [style*="background-image"] video {
              filter: none !important;
            }
          `;

          document.head.appendChild(style);
        },
        args: [brightness, contrast],
      });

      this.updateUI(true);
      window.showStatusMessage("暗黑模式已开启", "success");
    } catch (error) {
      console.error("应用暗黑模式失败:", error);
      window.showStatusMessage("应用失败: " + error.message, "error");
      this.isActive = false;
      this.updateUI(false);
    }
  },

  /**
   * 移除暗黑模式
   */
  async removeDarkMode() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab || !tab.id) {
        window.showStatusMessage("无法获取当前标签页", "error");
        return;
      }

      // 检查是否为受限页面
      if (this.isRestrictedUrl(tab.url)) {
        this.updateUI(false);
        return;
      }

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const style = document.getElementById("__darkmode_extension_style__");
          if (style) {
            style.remove();
          }
        },
      });

      this.updateUI(false);
      window.showStatusMessage("暗黑模式已关闭", "success");
    } catch (error) {
      console.error("移除暗黑模式失败:", error);
      window.showStatusMessage("操作失败: " + error.message, "error");
    }
  },

  /**
   * 更新 UI 状态
   */
  updateUI(isActive) {
    this.isActive = isActive;
    const icon = this.toggleBtn.querySelector(".darkmode-icon");
    const text = this.toggleBtn.querySelector(".darkmode-text");

    if (isActive) {
      this.toggleBtn.classList.add("active");
      icon.textContent = "☀️";
      text.textContent = "关闭暗黑模式";
    } else {
      this.toggleBtn.classList.remove("active");
      icon.textContent = "🌙";
      text.textContent = "开启暗黑模式";
    }
  },
};

// 导出工具
window.DarkModeTool = DarkModeTool;
