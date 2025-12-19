// 二维码工具模块（生成 + 解码）

const QRCodeTool = {
  // 生成模式元素
  urlInputEl: null,
  qrcodeCanvasEl: null,
  getCurrentUrlBtn: null,
  generateBtn: null,
  clearBtn: null,
  downloadBtn: null,

  // 解码模式元素
  uploadEl: null,
  decodePreviewSection: null,
  decodePreviewImg: null,
  decodeResultEl: null,
  decodeCopyBtn: null,
  decodeOpenBtn: null,

  // 模式切换
  modeTabs: null,
  generateModePanel: null,
  decodeModePanel: null,

  qrcodeInstance: null,
  isManualInput: false,

  /**
   * 初始化二维码工具
   */
  async init() {
    // 生成模式元素
    this.urlInputEl = document.getElementById("qrcode-url-input");
    this.qrcodeCanvasEl = document.getElementById("qrcode-canvas");
    this.getCurrentUrlBtn = document.getElementById("qrcode-get-current-btn");
    this.generateBtn = document.getElementById("qrcode-generate-btn");
    this.clearBtn = document.getElementById("qrcode-clear-btn");
    this.downloadBtn = document.getElementById("qrcode-download-btn");

    // 解码模式元素
    this.uploadEl = document.getElementById("qrcode-upload");
    this.decodePreviewSection = document.getElementById(
      "decode-preview-section"
    );
    this.decodePreviewImg = document.getElementById("decode-preview");
    this.decodeResultEl = document.getElementById("qrcode-decode-result");
    this.decodeCopyBtn = document.getElementById("qrcode-decode-copy-btn");
    this.decodeOpenBtn = document.getElementById("qrcode-decode-open-btn");

    // 模式切换
    this.modeTabs = document.querySelectorAll(".qrcode-mode-tab");
    this.generateModePanel = document.getElementById("qrcode-generate-mode");
    this.decodeModePanel = document.getElementById("qrcode-decode-mode");

    if (!this.urlInputEl || !this.qrcodeCanvasEl) {
      console.error("二维码工具元素未找到");
      return;
    }

    // 初始化模式切换
    this.initModeTabs();

    // 绑定生成模式事件
    if (this.getCurrentUrlBtn) {
      this.getCurrentUrlBtn.addEventListener("click", () => {
        this.isManualInput = false;
        this.getCurrentUrl();
      });
    }
    if (this.generateBtn) {
      this.generateBtn.addEventListener("click", () => this.generate());
    }
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => this.clear());
    }
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener("click", () => this.download());
    }

    // 绑定解码模式事件
    if (this.uploadEl) {
      this.uploadEl.addEventListener("change", (e) =>
        this.handleDecodeUpload(e)
      );
    }
    if (this.decodeCopyBtn) {
      this.decodeCopyBtn.addEventListener("click", () =>
        this.copyDecodeResult()
      );
    }
    if (this.decodeOpenBtn) {
      this.decodeOpenBtn.addEventListener("click", () =>
        this.openDecodeResult()
      );
    }

    // 支持回车快捷键
    this.urlInputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.generate();
      }
    });

    // 监听输入框变化
    this.urlInputEl.addEventListener("input", () => {
      this.isManualInput = true;
    });

    // 监听工具面板激活事件
    this.observePanelActivation();
  },

  /**
   * 初始化模式标签切换
   */
  initModeTabs() {
    if (!this.modeTabs) return;

    this.modeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const mode = tab.getAttribute("data-mode");

        // 更新标签状态
        this.modeTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // 切换面板
        if (mode === "generate") {
          this.generateModePanel?.classList.add("active");
          this.decodeModePanel?.classList.remove("active");
        } else {
          this.generateModePanel?.classList.remove("active");
          this.decodeModePanel?.classList.add("active");
        }
      });
    });
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

  // ==================== 解码功能 ====================

  /**
   * 处理解码上传
   */
  handleDecodeUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.showStatusMessage("请选择图片文件", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target.result;

      // 显示预览
      if (this.decodePreviewSection && this.decodePreviewImg) {
        this.decodePreviewImg.src = dataUrl;
        this.decodePreviewSection.style.display = "block";
      }

      // 解码二维码
      this.decodeQRCode(dataUrl);
    };

    reader.onerror = () => {
      window.showStatusMessage("读取文件失败", "error");
    };

    reader.readAsDataURL(file);
  },

  /**
   * 解码二维码（使用在线 API）
   */
  async decodeQRCode(dataUrl) {
    window.showStatusMessage("正在解码...", "loading", 0);

    try {
      // 使用 qrserver.com 的解码 API
      // 需要将图片上传到服务器
      const blob = await this.dataUrlToBlob(dataUrl);
      const formData = new FormData();
      formData.append("file", blob, "qrcode.png");

      const response = await fetch(
        "https://api.qrserver.com/v1/read-qr-code/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("解码服务请求失败");
      }

      const data = await response.json();

      if (data && data[0] && data[0].symbol && data[0].symbol[0]) {
        const result = data[0].symbol[0];

        if (result.error) {
          throw new Error(result.error);
        }

        const decodedData = result.data;
        this.decodeResultEl.value = decodedData;
        window.showStatusMessage("解码成功！", "success");
      } else {
        throw new Error("无法解析二维码");
      }
    } catch (error) {
      console.error("解码失败:", error);
      window.showStatusMessage(`解码失败: ${error.message}`, "error");
      this.decodeResultEl.value = "";
    }
  },

  /**
   * 将 DataURL 转换为 Blob
   */
  async dataUrlToBlob(dataUrl) {
    const response = await fetch(dataUrl);
    return await response.blob();
  },

  /**
   * 复制解码结果
   */
  async copyDecodeResult() {
    const result = this.decodeResultEl.value;

    if (!result) {
      window.showStatusMessage("没有可复制的内容", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      window.showStatusMessage("已复制到剪贴板！", "success");
    } catch (error) {
      window.showStatusMessage("复制失败", "error");
    }
  },

  /**
   * 打开解码结果（如果是链接）
   */
  openDecodeResult() {
    const result = this.decodeResultEl.value;

    if (!result) {
      window.showStatusMessage("没有可打开的内容", "error");
      return;
    }

    // 检查是否是有效的 URL
    try {
      new URL(result);
      chrome.tabs.create({ url: result });
    } catch {
      // 尝试添加 https://
      try {
        const url = "https://" + result;
        new URL(url);
        chrome.tabs.create({ url });
      } catch {
        window.showStatusMessage("解码结果不是有效的链接", "error");
      }
    }
  },
};
