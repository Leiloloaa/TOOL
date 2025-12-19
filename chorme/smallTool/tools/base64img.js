// 图片转 Base64 工具模块

const Base64ImgTool = {
  uploadEl: null,
  previewSection: null,
  previewImg: null,
  outputEl: null,
  copyBtn: null,
  clearBtn: null,

  init() {
    this.uploadEl = document.getElementById("image-upload");
    this.previewSection = document.getElementById("image-preview-section");
    this.previewImg = document.getElementById("image-preview");
    this.outputEl = document.getElementById("base64-output");
    this.copyBtn = document.getElementById("base64-copy-btn");
    this.clearBtn = document.getElementById("base64-clear-btn");

    if (!this.uploadEl) {
      console.error("图片转 Base64 工具元素未找到");
      return;
    }

    // 绑定事件
    this.uploadEl.addEventListener("change", (e) => this.handleFileSelect(e));
    if (this.copyBtn) {
      this.copyBtn.addEventListener("click", () => this.copy());
    }
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => this.clear());
    }

    // 拖拽上传
    const uploadLabel = this.uploadEl
      .closest(".upload-section")
      ?.querySelector(".upload-label");
    if (uploadLabel) {
      uploadLabel.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadLabel.classList.add("dragover");
      });
      uploadLabel.addEventListener("dragleave", () => {
        uploadLabel.classList.remove("dragover");
      });
      uploadLabel.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadLabel.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          this.processFile(files[0]);
        }
      });
    }
  },

  /**
   * 处理文件选择
   */
  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  },

  /**
   * 处理文件
   */
  processFile(file) {
    if (!file.type.startsWith("image/")) {
      window.showStatusMessage("请选择图片文件", "error");
      return;
    }

    // 检查文件大小（限制 5MB）
    if (file.size > 5 * 1024 * 1024) {
      window.showStatusMessage("图片大小不能超过 5MB", "error");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target.result;

      // 显示预览
      if (this.previewSection && this.previewImg) {
        this.previewImg.src = base64;
        this.previewSection.style.display = "block";
      }

      // 显示 Base64
      this.outputEl.value = base64;

      // 显示信息
      const sizeKB = (file.size / 1024).toFixed(2);
      const base64SizeKB = (base64.length / 1024).toFixed(2);
      window.showStatusMessage(
        `转换成功！原始: ${sizeKB}KB, Base64: ${base64SizeKB}KB`,
        "success"
      );
    };

    reader.onerror = () => {
      window.showStatusMessage("读取文件失败", "error");
    };

    reader.readAsDataURL(file);
  },

  /**
   * 复制 Base64
   */
  async copy() {
    const base64 = this.outputEl.value;

    if (!base64) {
      window.showStatusMessage("没有可复制的内容", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(base64);
      window.showStatusMessage("Base64 已复制到剪贴板！", "success");
    } catch (error) {
      window.showStatusMessage("复制失败", "error");
    }
  },

  /**
   * 清空
   */
  clear() {
    this.uploadEl.value = "";
    this.outputEl.value = "";
    if (this.previewSection) {
      this.previewSection.style.display = "none";
    }
    if (this.previewImg) {
      this.previewImg.src = "";
    }
    window.hideStatusMessage();
  },
};

window.Base64ImgTool = Base64ImgTool;


