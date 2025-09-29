/**
 * 控制台错误收集器 - 独立可配置的错误收集模块
 * @param {Object} config 配置选项
 * @param {Array} config.targets 监听的对象 ['console.error', 'console.warn', 'javascript', 'promise', 'vue']
 * @param {boolean} config.autoStart 是否自动开始监听
 * @param {number} config.interval 自动检查间隔（毫秒）
 * @param {number} config.maxErrors 最大收集错误数量
 * @param {Function} config.onError 错误回调函数
 * @param {boolean} config.autoSave 是否自动保存到localStorage
 * @param {string} config.storageKey localStorage存储键名
 */
class ConsoleErrorCollector {
  constructor(config = {}) {
    // 默认配置
    this.config = {
      targets: ["console.error", "console.warn", "javascript", "promise"],
      autoStart: false,
      interval: 5 * 60 * 1000, // 5分钟
      maxErrors: 100,
      onError: null,
      activityId: null, // 活动 ID
      useSessionStorage: true, // 使用 sessionStorage 存储
      storageKey: "console_error_collector", // 存储键名
      sendMode: "immediate", // 发送模式: "immediate" | "batch"
      batchInterval: 2 * 60 * 1000, // 批量发送间隔（2分钟）
      ...config,
    };

    // 状态
    this.errors = [];
    this.isCollecting = false;
    this.autoCheckTimer = null;

    // 服务器相关
    this.serverUrl = null; // 服务器接口URL

    // 批量发送相关
    this.pendingErrors = new Map(); // 待发送的错误（按类型和内容分组）
    this.batchTimer = null; // 批量发送定时器

    // 原始方法备份
    this.originalMethods = {};

    // 初始化
    this.init();
  }

  /**
   * 初始化收集器
   */
  init() {
    // 打印初始化信息
    console.log("🚀 ConsoleErrorCollector 初始化中...");
    console.log(`📋 收集类型: ${this.config.targets.join(", ")}`);
    console.log(`📤 发送模式: ${this.config.sendMode}`);

    if (this.config.sendMode === "batch") {
      console.log(`⏰ 批量发送间隔: ${this.config.batchInterval / 1000} 秒`);
    }

    if (this.config.activityId) {
      console.log(`🆔 活动ID: ${this.config.activityId}`);
    }

    if (this.config.autoStart) {
      console.log("🔄 自动启动已启用");
    }

    this.setupConsoleOverrides();
    this.setupGlobalHandlers();

    // 从 sessionStorage 加载错误数据
    if (this.config.useSessionStorage) {
      this.loadFromSessionStorage();
    }

    if (this.config.autoStart) {
      this.start();
    }
  }

  /**
   * 设置控制台方法重写
   */
  setupConsoleOverrides() {
    if (this.config.targets.includes("console.error")) {
      this.originalMethods.consoleError = console.error;
      console.error = (...args) => {
        this.originalMethods.consoleError.apply(console, args);
        this.addError("console.error", args);
      };
    }

    if (this.config.targets.includes("console.warn")) {
      this.originalMethods.consoleWarn = console.warn;
      console.warn = (...args) => {
        this.originalMethods.consoleWarn.apply(console, args);
        this.addError("console.warn", args);
      };
    }
  }

  /**
   * 设置全局错误处理器
   */
  setupGlobalHandlers() {
    if (this.config.targets.includes("javascript")) {
      window.addEventListener("error", (event) => {
        this.addError("JavaScript Error", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        });
      });
    }

    if (this.config.targets.includes("promise")) {
      window.addEventListener("unhandledrejection", (event) => {
        this.addError("Promise Rejection", {
          reason: event.reason,
          promise: event.promise,
        });
      });
    }
  }

  /**
   * 添加错误到收集列表
   */
  addError(type, data) {
    if (!this.isCollecting) return;

    // 限制错误数量
    if (this.errors.length >= this.config.maxErrors) {
      this.errors.shift();
    }

    const errorInfo = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type: type,
      data: this.formatErrorData(data),
      url: window.location.href,
      userAgent: navigator.userAgent,
      activityId: this.config.activityId, // 添加活动 ID
      isSent: false, // 是否已发送
    };

    this.errors.push(errorInfo);

    // 打印错误信息
    this.printError(errorInfo);

    // 触发回调
    if (this.config.onError) {
      this.config.onError(errorInfo);
    }

    // 保存到 sessionStorage
    if (this.config.useSessionStorage) {
      this.saveToSessionStorage();
    }

    // 根据发送模式处理错误
    if (this.config.sendMode === "immediate") {
      // 立即发送模式
      this.sendErrorImmediately(errorInfo);
    } else if (this.config.sendMode === "batch") {
      // 批量发送模式
      this.addToBatch(errorInfo);
    }
  }

  /**
   * 格式化错误数据
   */
  formatErrorData(data) {
    if (Array.isArray(data)) {
      return data
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            try {
              return JSON.stringify(item, null, 2);
            } catch (e) {
              return String(item);
            }
          }
          return String(item);
        })
        .join(" ");
    }

    if (typeof data === "object" && item !== null) {
      try {
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return String(data);
      }
    }

    return String(data);
  }

  /**
   * 打印错误信息
   */
  printError(errorInfo) {
    // 格式化时间
    const time = new Date(errorInfo.timestamp).toLocaleString("zh-CN");

    // 截取错误信息（最多100个字符）
    const shortData =
      errorInfo.data.length > 100
        ? errorInfo.data.substring(0, 100) + "..."
        : errorInfo.data;

    // 精炼的打印格式
    console.log(
      `🚨 [${errorInfo.type}] ${shortData} | ${time} | ${errorInfo.url}`
    );
  }

  /**
   * 开始收集
   */
  start() {
    this.isCollecting = true;

    // 打印收集类型和配置信息
    console.log("🔍 错误收集器已启动");
    console.log(`📋 收集类型: ${this.config.targets.join(", ")}`);
    console.log(`📤 发送模式: ${this.config.sendMode}`);

    if (this.config.sendMode === "batch") {
      console.log(`⏰ 批量发送间隔: ${this.config.batchInterval / 1000} 秒`);
    }

    if (this.config.activityId) {
      console.log(`🆔 活动ID: ${this.config.activityId}`);
    }

    // 启动自动检查
    if (this.config.interval > 0) {
      this.startAutoCheck();
    }
  }

  /**
   * 停止收集
   */
  stop() {
    this.isCollecting = false;
    this.stopAutoCheck();
    console.log("⏹️ 错误收集器已停止");
  }

  /**
   * 开始自动检查
   */
  startAutoCheck() {
    this.stopAutoCheck();
    this.autoCheckTimer = setInterval(() => {
      this.manualCheck();
    }, this.config.interval);
    console.log(`⏰ 自动检查已启动，间隔 ${this.config.interval / 1000} 秒`);
  }

  /**
   * 停止自动检查
   */
  stopAutoCheck() {
    if (this.autoCheckTimer) {
      clearInterval(this.autoCheckTimer);
      this.autoCheckTimer = null;
    }
  }

  /**
   * 手动检查
   */
  manualCheck() {
    console.log(`🔍 手动检查完成，当前错误总数: ${this.errors.length}`);
  }

  /**
   * 获取所有错误（只返回未发送的错误）
   */
  getErrors() {
    return this.errors.filter((error) => !error.isSent);
  }

  /**
   * 获取所有错误（包括已发送的）
   */
  getAllErrors() {
    return [...this.errors];
  }

  /**
   * 获取错误统计（只统计未发送的错误）
   */
  getStats() {
    const unsentErrors = this.errors.filter((error) => !error.isSent);
    const stats = {
      total: unsentErrors.length,
      byType: {},
      recent: unsentErrors.slice(-10),
    };

    unsentErrors.forEach((error) => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
    });

    return stats;
  }

  /**
   * 清空错误
   */
  clearErrors() {
    this.errors = [];
    if (this.config.useSessionStorage) {
      this.saveToSessionStorage();
    }
    console.log("🗑️ 错误列表已清空");
  }

  /**
   * 保存到 sessionStorage
   */
  saveToSessionStorage() {
    try {
      sessionStorage.setItem(
        this.config.storageKey,
        JSON.stringify(this.errors)
      );
    } catch (e) {
      console.warn("无法保存错误到 sessionStorage:", e);
    }
  }

  /**
   * 从 sessionStorage 加载
   */
  loadFromSessionStorage() {
    try {
      const stored = sessionStorage.getItem(this.config.storageKey);
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("无法从 sessionStorage 加载错误:", e);
    }
  }

  /**
   * 立即发送错误
   */
  sendErrorImmediately(errorInfo) {
    if (this.serverUrl) {
      this.sendErrorToServer(errorInfo).catch((error) => {
        console.error(`❌ 发送错误到服务器失败:`, error);
        console.log("⚠️ 发送失败，但会继续尝试发送后续错误");
      });
    } else {
      console.log("⚠️ 未设置服务器URL，跳过错误上报");
    }
  }

  /**
   * 添加到批量发送队列
   */
  addToBatch(errorInfo) {
    console.log(
      `🔍 添加到批量队列: ${errorInfo.type} - ${errorInfo.data.substring(
        0,
        50
      )}...`
    );

    // 只处理未发送的错误
    if (errorInfo.isSent) {
      console.log(`⚠️ 错误已发送，跳过批量队列: ${errorInfo.id}`);
      return;
    }

    // 创建错误的唯一标识（类型+数据内容）
    const errorKey = `${errorInfo.type}:${errorInfo.data}`;

    if (this.pendingErrors.has(errorKey)) {
      // 如果错误已存在，增加计数
      const existing = this.pendingErrors.get(errorKey);
      existing.count++;
      existing.lastOccurred = errorInfo.timestamp;
      console.log(`📊 错误已存在，计数增加到: ${existing.count}`);
    } else {
      // 新错误，添加到队列
      this.pendingErrors.set(errorKey, {
        ...errorInfo,
        count: 1,
        firstOccurred: errorInfo.timestamp,
        lastOccurred: errorInfo.timestamp,
      });
      console.log(
        `📝 新错误已添加到队列，当前队列大小: ${this.pendingErrors.size}`
      );
    }

    // 启动批量发送定时器（如果还没启动）
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        console.log(
          `⏰ 批量发送定时器触发，准备发送 ${this.pendingErrors.size} 个错误`
        );
        this.sendBatchErrors();
      }, this.config.batchInterval);

      console.log(
        `📦 批量发送定时器已启动，${this.config.batchInterval / 1000}秒后发送`
      );
    } else {
      console.log(
        `⏰ 批量发送定时器已存在，等待 ${this.config.batchInterval / 1000} 秒`
      );
    }
  }

  /**
   * 发送批量错误
   */
  async sendBatchErrors() {
    console.log(
      `🔍 sendBatchErrors 被调用，当前队列大小: ${this.pendingErrors.size}`
    );

    if (this.pendingErrors.size === 0) {
      console.log("📝 队列为空，无需发送");
      this.batchTimer = null;
      return;
    }

    console.log(
      `📦 开始发送批量错误，共 ${this.pendingErrors.size} 个不同的错误`
    );

    // 将待发送的错误转换为数组
    const errorsToSend = Array.from(this.pendingErrors.values());
    console.log(
      `📋 准备发送的错误:`,
      errorsToSend.map((e) => `${e.type} (${e.count}次)`)
    );

    // 清空待发送队列
    this.pendingErrors.clear();
    this.batchTimer = null;

    console.log(`🌐 服务器URL: ${this.serverUrl}`);

    // 发送每个错误
    for (const errorInfo of errorsToSend) {
      if (this.serverUrl) {
        console.log(
          `📤 正在发送错误: ${errorInfo.type} (${errorInfo.count}次)`
        );
        try {
          await this.sendErrorToServer(errorInfo);
          console.log(
            `✅ 批量错误已发送: ${errorInfo.type} (${errorInfo.count}次)`
          );
        } catch (error) {
          console.error(`❌ 发送批量错误失败:`, error);
          console.log("⚠️ 发送失败，但会继续尝试发送后续错误");
        }
      } else {
        console.log("⚠️ 未设置服务器URL，跳过批量错误上报");
        break;
      }
    }
  }

  /**
   * 设置服务器接口URL
   */
  setServerUrl(url) {
    this.serverUrl = url;
    console.log(`🌐 服务器接口已设置为: ${url}`);
  }

  /**
   * 发送错误到服务器
   */
  async sendErrorToServer(errorInfo) {
    console.log(`🚀 开始发送错误到服务器: ${this.serverUrl}`);
    console.log(`📋 错误信息:`, {
      type: errorInfo.type,
      count: errorInfo.count,
      data: errorInfo.data.substring(0, 100),
    });

    if (!this.serverUrl) {
      throw new Error("未设置服务器接口URL");
    }

    // 构建请求体，包含统计信息
    const requestBody = {
      errorId: errorInfo.id,
      timestamp: errorInfo.timestamp,
      type: errorInfo.type,
      data: errorInfo.data,
      url: errorInfo.url,
      userAgent: errorInfo.userAgent,
      activityId: errorInfo.activityId,
    };

    // 如果是批量发送的错误，包含统计信息
    if (errorInfo.count !== undefined) {
      requestBody.count = errorInfo.count;
      requestBody.firstOccurred = errorInfo.firstOccurred;
      requestBody.lastOccurred = errorInfo.lastOccurred;
    }

    console.log(`📤 发送请求体:`, requestBody);

    const response = await fetch(this.serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`📡 服务器响应状态: ${response.status}`);

    if (!response.ok) {
      throw new Error(`服务器返回错误状态: ${response.status}`);
    }

    // 发送成功后，标记所有相关的错误为已发送
    this.markBatchErrorAsSent(errorInfo);

    const result = await response.json();
    console.log(`✅ 服务器响应:`, result);
    return result;
  }

  /**
   * 标记错误为已发送
   */
  markErrorAsSent(errorId) {
    const error = this.errors.find((error) => error.id === errorId);
    if (error) {
      error.isSent = true;

      // 更新 sessionStorage
      if (this.config.useSessionStorage) {
        this.saveToSessionStorage();
      }

      console.log(`✅ 错误已标记为已发送: ${errorId}`);
    }
  }

  /**
   * 标记批量错误为已发送
   * 对于合并的错误，需要标记所有相关的原始错误
   */
  markBatchErrorAsSent(batchErrorInfo) {
    // 如果是批量发送的错误，需要根据类型和数据内容找到所有相关的原始错误
    if (batchErrorInfo.count !== undefined) {
      // 找到所有相同类型和数据的未发送错误
      const relatedErrors = this.errors.filter(
        (error) =>
          !error.isSent &&
          error.type === batchErrorInfo.type &&
          error.data === batchErrorInfo.data
      );

      console.log(
        `🔍 找到 ${relatedErrors.length} 个相关的原始错误需要标记为已发送`
      );

      // 标记所有相关错误为已发送
      relatedErrors.forEach((error) => {
        error.isSent = true;
        console.log(`✅ 批量错误已标记为已发送: ${error.id} (${error.type})`);
      });

      if (this.config.useSessionStorage) {
        this.saveToSessionStorage();
      }

      console.log(
        `✅ 批量发送完成，共标记 ${relatedErrors.length} 个错误为已发送`
      );

      // 批量发送结束后，自动打印所有收集到的错误
      this.printAllErrorsAfterBatch();
    } else {
      // 单个错误，使用原来的方法
      this.markErrorAsSent(batchErrorInfo.id);
    }
  }

  /**
   * 批量发送结束后自动打印所有错误
   */
  printAllErrorsAfterBatch() {
    const allErrors = this.getAllErrors();
    const unsentErrors = this.getErrors();

    console.log(
      `\n📊 批量发送完成 - 所有收集到的错误 (共 ${allErrors.length} 个，未发送 ${unsentErrors.length} 个):`
    );

    if (allErrors.length === 0) {
      console.log("📝 当前没有收集到任何错误");
      return;
    }

    allErrors.forEach((error, index) => {
      const time = new Date(error.timestamp).toLocaleString("zh-CN");
      const shortData =
        error.data.length > 80
          ? error.data.substring(0, 80) + "..."
          : error.data;
      const sentStatus = error.isSent ? "✅已发送" : "⏳未发送";
      console.log(
        `${index + 1}. [${error.type}] ${shortData} | ${time} | ${
          error.url
        } | ${sentStatus}`
      );
    });

    console.log(`✅ 已打印 ${allErrors.length} 个错误到控制台\n`);
  }

  /**
   * 从本地错误列表中移除已发送的错误
   */
  removeErrorFromList(errorId) {
    const index = this.errors.findIndex((error) => error.id === errorId);
    if (index !== -1) {
      this.errors.splice(index, 1);

      // 更新 sessionStorage
      if (this.config.useSessionStorage) {
        this.saveToSessionStorage();
      }

      console.log(`🗑️ 已从本地移除已发送的错误: ${errorId}`);
    }
  }

  /**
   * 获取状态
   */
  getStatus() {
    const unsentErrors = this.errors.filter((error) => !error.isSent);
    return {
      serverUrl: this.serverUrl,
      isCollecting: this.isCollecting,
      errorCount: unsentErrors.length, // 只显示未发送的错误数量
      totalErrorCount: this.errors.length, // 总错误数量
      sentErrorCount: this.errors.length - unsentErrors.length, // 已发送错误数量
      sendMode: this.config.sendMode,
      pendingErrorsCount: this.pendingErrors.size,
      batchTimerActive: this.batchTimer !== null,
    };
  }

  /**
   * 手动发送批量错误
   */
  sendBatchNow() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    this.sendBatchErrors();
  }

  /**
   * 设置发送模式
   */
  setSendMode(mode) {
    if (mode === "immediate" || mode === "batch") {
      this.config.sendMode = mode;
      console.log(`📤 发送模式已设置为: ${mode}`);

      // 如果切换到立即模式，发送所有待发送的错误
      if (mode === "immediate" && this.pendingErrors.size > 0) {
        this.sendBatchNow();
      }
    } else {
      console.error("❌ 无效的发送模式，支持的模式: immediate, batch");
    }
  }

  /**
   * 销毁收集器
   */
  destroy() {
    this.stop();

    // 清理批量发送定时器
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    // 发送剩余的批量错误
    if (this.pendingErrors.size > 0) {
      this.sendBatchNow();
    }

    // 恢复原始方法
    if (this.originalMethods.consoleError) {
      console.error = this.originalMethods.consoleError;
    }
    if (this.originalMethods.consoleWarn) {
      console.warn = this.originalMethods.consoleWarn;
    }

    console.log("🗑️ 错误收集器已销毁");
  }
}

export default ConsoleErrorCollector;
