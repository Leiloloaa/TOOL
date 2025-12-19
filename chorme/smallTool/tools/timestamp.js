// 时间戳转换工具模块

const TimestampTool = {
  currentTimestampEl: null,
  copyTimestampBtn: null,
  timestampInput: null,
  timestampResult: null,
  toDateBtn: null,
  dateInput: null,
  toTimestampBtn: null,
  intervalId: null,

  init() {
    this.currentTimestampEl = document.getElementById("current-timestamp");
    this.copyTimestampBtn = document.getElementById("copy-timestamp-btn");
    this.timestampInput = document.getElementById("timestamp-input");
    this.timestampResult = document.getElementById("timestamp-result");
    this.toDateBtn = document.getElementById("timestamp-to-date-btn");
    this.dateInput = document.getElementById("date-input");
    this.toTimestampBtn = document.getElementById("date-to-timestamp-btn");

    if (!this.currentTimestampEl) {
      console.error("时间戳工具元素未找到");
      return;
    }

    // 更新当前时间戳
    this.updateCurrentTimestamp();
    this.intervalId = setInterval(() => this.updateCurrentTimestamp(), 1000);

    // 绑定事件
    if (this.copyTimestampBtn) {
      this.copyTimestampBtn.addEventListener("click", () =>
        this.copyCurrentTimestamp()
      );
    }
    if (this.toDateBtn) {
      this.toDateBtn.addEventListener("click", () => this.timestampToDate());
    }
    if (this.toTimestampBtn) {
      this.toTimestampBtn.addEventListener("click", () =>
        this.dateToTimestamp()
      );
    }

    // 设置当前日期时间
    this.setCurrentDateTime();

    // 回车触发转换
    if (this.timestampInput) {
      this.timestampInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.timestampToDate();
        }
      });
    }
  },

  /**
   * 更新当前时间戳显示
   */
  updateCurrentTimestamp() {
    const now = Math.floor(Date.now() / 1000);
    this.currentTimestampEl.textContent = now;
  },

  /**
   * 复制当前时间戳
   */
  async copyCurrentTimestamp() {
    const timestamp = this.currentTimestampEl.textContent;
    try {
      await navigator.clipboard.writeText(timestamp);
      window.showStatusMessage("时间戳已复制！", "success");
    } catch (error) {
      window.showStatusMessage("复制失败", "error");
    }
  },

  /**
   * 设置当前日期时间到输入框
   */
  setCurrentDateTime() {
    if (this.dateInput) {
      const now = new Date();
      // 格式化为 datetime-local 需要的格式
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      this.dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
  },

  /**
   * 时间戳转日期
   */
  timestampToDate() {
    const input = this.timestampInput.value.trim();

    if (!input) {
      window.showStatusMessage("请输入时间戳", "error");
      return;
    }

    let timestamp = parseInt(input, 10);

    if (isNaN(timestamp)) {
      window.showStatusMessage("请输入有效的时间戳数字", "error");
      return;
    }

    // 判断是秒还是毫秒（13位以上为毫秒）
    if (timestamp.toString().length <= 10) {
      timestamp = timestamp * 1000;
    }

    try {
      const date = new Date(timestamp);

      if (isNaN(date.getTime())) {
        throw new Error("无效的时间戳");
      }

      const formatted = this.formatDate(date);
      this.timestampResult.value = formatted;

      // 复制到剪贴板
      navigator.clipboard.writeText(formatted).then(() => {
        window.showStatusMessage("转换成功并已复制！", "success");
      });
    } catch (error) {
      window.showStatusMessage(`转换失败: ${error.message}`, "error");
    }
  },

  /**
   * 日期转时间戳
   */
  dateToTimestamp() {
    const input = this.dateInput.value;

    if (!input) {
      window.showStatusMessage("请选择日期时间", "error");
      return;
    }

    try {
      const date = new Date(input);
      const timestamp = Math.floor(date.getTime() / 1000);

      this.timestampResult.value = `秒: ${timestamp} | 毫秒: ${date.getTime()}`;

      // 复制秒级时间戳
      navigator.clipboard.writeText(timestamp.toString()).then(() => {
        window.showStatusMessage("转换成功，秒级时间戳已复制！", "success");
      });
    } catch (error) {
      window.showStatusMessage(`转换失败: ${error.message}`, "error");
    }
  },

  /**
   * 格式化日期
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },
};

window.TimestampTool = TimestampTool;


