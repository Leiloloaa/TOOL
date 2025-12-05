// 二维码生成工具模块

const QRCodeTool = {
  urlInputEl: null,
  qrcodeCanvasEl: null,
  getCurrentUrlBtn: null,
  generateBtn: null,
  clearBtn: null,
  downloadBtn: null,
  qrcodeInstance: null,
  isManualInput: false, // 标记是否为手动输入

  /**
   * 初始化二维码生成工具
   */
  async init() {
    this.urlInputEl = document.getElementById("qrcode-url-input");
    this.qrcodeCanvasEl = document.getElementById("qrcode-canvas");
    this.getCurrentUrlBtn = document.getElementById("qrcode-get-current-btn");
    this.generateBtn = document.getElementById("qrcode-generate-btn");
    this.clearBtn = document.getElementById("qrcode-clear-btn");
    this.downloadBtn = document.getElementById("qrcode-download-btn");

    if (!this.urlInputEl || !this.qrcodeCanvasEl || !this.generateBtn) {
      console.error("二维码工具元素未找到");
      return;
    }

    // Manifest V3 的 CSP 限制，直接使用在线 API 生成二维码
    console.log("使用在线 API 生成二维码");

    // 绑定事件
    if (this.getCurrentUrlBtn) {
      this.getCurrentUrlBtn.addEventListener("click", () => {
        this.isManualInput = false; // 重置手动输入标记
        this.getCurrentUrl();
      });
    }
    this.generateBtn.addEventListener("click", () => this.generate());
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => this.clear());
    }
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.download());
    }

    // 支持回车快捷键
    this.urlInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.generate();
      } else if (e.key === "Enter") {
        // 普通回车键也触发生成
        e.preventDefault();
        this.generate();
      }
    });

    // 监听输入框变化，当用户手动输入时，不自动获取当前页面
    this.urlInputEl.addEventListener("input", () => {
      // 用户正在输入，标记为手动输入模式
      this.isManualInput = true;
    });

    // 监听工具面板激活事件，自动获取当前页面
    this.observePanelActivation();

    // 不再在初始化时自动获取，只在切换到该 tab 时获取
  },

  /**
   * 等待 QRCode 库加载（由于 CSP 限制，直接使用在线 API）
   * @returns {Promise<boolean>} 是否加载成功
   */
  async waitForQRCodeLibrary() {
    // Manifest V3 的 CSP 不允许从 CDN 加载脚本
    // 直接返回 false，使用在线 API
    return false;
  },

  /**
   * 监听工具面板激活，自动获取当前页面
   * 注意：这个监听器作为备用，主要依赖 popup.js 中的 tab 切换事件
   */
  observePanelActivation() {
    // 使用 MutationObserver 监听面板激活
    const panel = document.getElementById("qrcode-tool");
    if (!panel) return;

    let wasActive = panel.classList.contains("active");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const isActive = panel.classList.contains("active");
          // 只有在从非激活状态切换到激活状态时才获取
          if (isActive && !wasActive && !this.urlInputEl.value.trim()) {
            // 面板激活且输入框为空时，自动获取当前页面
            this.isManualInput = false;
            this.getCurrentUrl();
          }
          wasActive = isActive;
        }
      });
    });

    observer.observe(panel, {
      attributes: true,
      attributeFilter: ["class"],
    });
  },

  /**
   * 获取当前标签页的 URL（实时获取）
   */
  async getCurrentUrl() {
    try {
      // 如果用户正在手动输入，不自动获取
      if (this.isManualInput && this.urlInputEl.value.trim()) {
        return;
      }

      // 显示加载状态
      window.showStatusMessage("正在获取当前页面...", "loading", 0);

      // 检查 chrome.tabs API 是否可用
      if (!chrome || !chrome.tabs || !chrome.tabs.query) {
        console.error("chrome.tabs API 不可用");
        window.showStatusMessage("无法访问标签页 API，请检查扩展权限", "error");
        return;
      }

      // 实时获取当前标签页
      let url = null;

      try {
        // 使用 Chrome API 实时查询当前标签页
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        console.log("查询到的标签页数量:", tabs?.length);
        console.log("查询到的标签页:", tabs);

        if (tabs && tabs.length > 0) {
          const tab = tabs[0];
          console.log("当前标签页详情:", {
            id: tab.id,
            url: tab.url,
            pendingUrl: tab.pendingUrl,
            title: tab.title,
            status: tab.status,
            allKeys: Object.keys(tab),
          });

          // 尝试多种方式获取 URL
          url = tab.url || tab.pendingUrl;

          // 如果还是没有 URL，尝试通过 tab.id 获取详细信息
          if (!url && tab.id !== undefined) {
            try {
              console.log("尝试通过 tab.id 获取详细信息, tab.id:", tab.id);
              const detailedTab = await chrome.tabs.get(tab.id);
              console.log("详细标签页信息完整对象:", detailedTab);
              console.log("详细标签页 URL:", detailedTab.url);
              console.log("详细标签页 pendingUrl:", detailedTab.pendingUrl);
              console.log("详细标签页所有属性:", Object.keys(detailedTab));

              // 尝试多种方式获取 URL
              url = detailedTab.url || detailedTab.pendingUrl;

              // 如果还是没有，检查是否是特殊页面
              if (!url) {
                console.warn("无法获取 URL，可能是权限问题或特殊页面");
                // 检查标签页状态
                if (detailedTab.status === "loading") {
                  console.log("标签页正在加载中...");
                }
                // 检查是否是 Chrome 内部页面
                if (
                  detailedTab.title &&
                  (detailedTab.title.includes("Chrome") ||
                    detailedTab.title.includes("Extension") ||
                    detailedTab.title.includes("New Tab"))
                ) {
                  console.log("可能是 Chrome 内部页面");
                }
              }
            } catch (getError) {
              console.error("通过 get 获取 URL 失败:", getError);
              console.error("错误详情:", getError.message, getError.stack);
            }
          }
        } else {
          console.error("未找到活动标签页");
        }
      } catch (queryError) {
        console.error("查询标签页失败:", queryError);
        window.showStatusMessage(
          `查询标签页失败: ${queryError.message}`,
          "error"
        );
        return;
      }

      // 如果还是没有获取到 URL
      if (!url) {
        console.error("无法获取 URL，请检查控制台中的详细标签页信息");
        console.error('请展开控制台中的 "详细标签页信息完整对象" 查看所有属性');

        // 尝试使用 window.location 作为备用方案（如果 popup 在同一个上下文中）
        try {
          // 注意：popup 页面无法直接访问当前标签页的 window.location
          // 但我们可以提示用户手动输入
          window.showStatusMessage(
            "无法自动获取当前页面 URL，请手动输入链接",
            "error"
          );
          this.urlInputEl.placeholder =
            '请手动输入链接地址，或点击"获取当前页面"按钮重试';
          this.urlInputEl.focus();
        } catch (e) {
          window.showStatusMessage(
            "无法获取当前页面 URL，请手动输入链接",
            "error"
          );
        }
        return;
      }

      // 过滤掉 Chrome 内部页面
      if (
        url.startsWith("chrome://") ||
        url.startsWith("chrome-extension://") ||
        url.startsWith("edge://") ||
        url.startsWith("about:") ||
        url.startsWith("moz-extension://") ||
        url.startsWith("brave://") ||
        url.startsWith("opera://")
      ) {
        this.urlInputEl.value = "";
        this.urlInputEl.placeholder =
          "当前页面不支持生成二维码，请手动输入链接";
        window.showStatusMessage("当前页面不支持生成二维码", "error");
        return;
      }

      // 设置 URL 并生成二维码
      this.urlInputEl.value = url;
      await this.generate();
    } catch (error) {
      console.error("获取当前 URL 失败:", error);
      const errorMsg = error.message || "未知错误";
      window.showStatusMessage(`获取当前页面 URL 失败: ${errorMsg}`, "error");
    }
  },

  /**
   * 生成二维码
   */
  async generate() {
    const url = this.urlInputEl.value.trim();

    if (!url) {
      window.showStatusMessage("请输入或获取要生成二维码的链接", "error");
      return;
    }

    // 验证并格式化 URL
    const formattedUrl = this.formatUrl(url);
    if (!formattedUrl) {
      window.showStatusMessage("请输入有效的 URL 链接", "error");
      return;
    }

    // 更新输入框为格式化后的 URL
    if (formattedUrl !== url) {
      this.urlInputEl.value = formattedUrl;
    }

    try {
      // 清空之前的二维码
      this.qrcodeCanvasEl.innerHTML = "";

      // 由于 Manifest V3 的 CSP 限制，直接使用在线 API
      await this.generateQRCodeWithAPI(formattedUrl);

      // 显示下载按钮
      if (this.downloadBtn) {
        this.downloadBtn.style.display = "inline-block";
      }

      window.showStatusMessage("二维码生成成功！", "success");
    } catch (error) {
      console.error("生成二维码失败:", error);
      window.showStatusMessage(`生成二维码失败: ${error.message}`, "error");
    }
  },

  /**
   * 使用在线 API 生成二维码（备用方案）
   * @param {string} url - 要生成二维码的 URL
   */
  async generateQRCodeWithAPI(url) {
    // 使用 qr-server.com API
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
      url
    )}`;

    const img = document.createElement("img");
    img.src = apiUrl;
    img.alt = "QR Code";
    img.style.maxWidth = "100%";
    img.style.height = "auto";

    return new Promise((resolve, reject) => {
      img.onload = () => {
        this.qrcodeCanvasEl.innerHTML = "";
        this.qrcodeCanvasEl.appendChild(img);
        resolve();
      };
      img.onerror = () => {
        reject(new Error("在线 API 生成失败"));
      };
    });
  },

  /**
   * 格式化 URL
   * @param {string} url - 原始 URL
   * @returns {string|null} 格式化后的 URL，无效则返回 null
   */
  formatUrl(url) {
    try {
      // 尝试创建 URL 对象
      new URL(url);
      return url;
    } catch {
      // 如果不是完整 URL，尝试添加 https:// 前缀
      try {
        const formatted = "https://" + url;
        new URL(formatted);
        return formatted;
      } catch {
        return null;
      }
    }
  },

  /**
   * 下载二维码
   */
  download() {
    const canvas = this.qrcodeCanvasEl.querySelector("canvas");
    const img = this.qrcodeCanvasEl.querySelector("img");

    if (!canvas && !img) {
      window.showStatusMessage("没有可下载的二维码", "error");
      return;
    }

    try {
      let url;
      if (canvas) {
        // 从 canvas 获取图片数据
        url = canvas.toDataURL("image/png");
      } else if (img) {
        // 从 img 获取图片数据（需要创建 canvas 转换）
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.naturalWidth || 256;
        tempCanvas.height = img.naturalHeight || 256;
        const ctx = tempCanvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        url = tempCanvas.toDataURL("image/png");
      }

      // 创建下载链接
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = url;
      link.click();

      window.showStatusMessage("二维码已下载！", "success");
    } catch (error) {
      console.error("下载失败:", error);
      window.showStatusMessage("下载失败", "error");
    }
  },

  /**
   * 清空输入和二维码
   */
  clear() {
    this.urlInputEl.value = "";
    this.urlInputEl.placeholder = "输入链接或点击下方按钮获取当前页面链接...";
    this.qrcodeCanvasEl.innerHTML =
      '<p class="qrcode-placeholder">二维码将显示在这里</p>';
    if (this.downloadBtn) {
      this.downloadBtn.style.display = "none";
    }
    this.isManualInput = false;
    // 清空后自动获取当前页面
    this.getCurrentUrl();
    window.hideStatusMessage();
  },
};
