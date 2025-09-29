const fs = require("fs");
const path = require("path");
const {
  processImages,
  flattenAllDirectories,
  optimizeSingleImage,
  deleteEmptyDirectories,
} = require("./handleImage.js");

class FolderWatcher {
  constructor() {
    this.watcher = null;
    this.isWatching = false;
    this.watchPath = null;
    this.namingMode = null;
    this.processedFiles = new Set(); // 防止重复处理
    this.processingQueue = []; // 处理队列
    this.isProcessing = false;
    this.flattenEnabled = false; // 扁平化目录开关
    this.isFlattening = false; // 扁平化进行中，防并发
  }

  /**
   * 开始监听文件夹
   * @param {string} folderPath - 要监听的文件夹路径
   * @param {string} namingMode - 命名模式
   * @param {Function} onFileChange - 文件变化回调
   * @param {Function} onImageProcessStart - 图片处理开始回调
   * @param {Function} onImageProcessComplete - 图片处理完成回调
   * @param {Function} onImageProcessError - 图片处理错误回调
   * @param {Function} onWatchError - 监听错误回调
   * @param {Function} onWatchStop - 监听停止回调
   */
  startWatching(folderPath, namingMode, callbacks = {}, options = {}) {
    if (this.isWatching) {
      throw new Error("Already watching a folder");
    }

    this.watchPath = folderPath;
    this.namingMode = namingMode;
    this.processedFiles.clear();
    this.processingQueue = [];
    this.isProcessing = false;
    this.flattenEnabled = !!options.flatten;

    // 验证文件夹是否存在
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder ${folderPath} does not exist`);
    }

    // 创建监听器
    this.watcher = fs.watch(
      folderPath,
      {
        recursive: true,
        persistent: true,
      },
      (eventType, fileName) => {
        if (!fileName) return;

        // 忽略隐藏文件
        if (fileName.startsWith(".")) return;

        const filePath = path.join(folderPath, fileName);

        // 检查文件是否存在（避免删除事件）
        if (eventType === "rename" && !fs.existsSync(filePath)) {
          return; // 文件被删除，忽略
        }

        if (eventType === "change" || eventType === "rename") {
          this.handleFileChange(filePath, eventType, callbacks);
        }
      }
    );

    // 监听错误
    this.watcher.on("error", (error) => {
      console.error("Watch error:", error);
      if (callbacks.onWatchError) {
        callbacks.onWatchError(error);
      }
    });

    this.isWatching = true;
    console.log(`Started watching folder: ${folderPath}`);
  }

  /**
   * 处理文件变化
   * @param {string} filePath - 文件路径
   * @param {string} eventType - 事件类型
   * @param {Object} callbacks - 回调函数
   */
  async handleFileChange(filePath, eventType, callbacks) {
    try {
      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return;
      }

      const fileName = path.basename(filePath);
      const fileExt = path.extname(filePath).toLowerCase();

      // 检查是否为图片文件
      const imageExtensions = [
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".bmp",
        ".webp",
      ];
      if (!imageExtensions.includes(fileExt)) {
        return; // 不是图片文件，忽略
      }

      // 子目录处理策略：若启用扁平化，则先对根目录进行一次扁平化；否则直接忽略子目录文件
      const fileDir = path.dirname(filePath);
      if (fileDir !== this.watchPath) {
        if (this.flattenEnabled) {
          if (!this.isFlattening) {
            this.isFlattening = true;
            try {
              await flattenAllDirectories(this.watchPath);
              // 扁平化后清理空目录
              await deleteEmptyDirectories(this.watchPath);
            } catch (e) {
              console.error("Flatten/cleanup directories failed:", e);
            } finally {
              this.isFlattening = false;
            }
          }
        }
        // 无论是否扁平化，子目录事件本次不入队，等待新的根目录事件
        return;
      }

      // 检查是否已经处理过
      if (this.processedFiles.has(filePath)) {
        return;
      }

      // 通知文件变化
      if (callbacks.onFileChange) {
        callbacks.onFileChange({
          fileName: fileName,
          filePath: filePath,
          eventType: eventType,
        });
      }

      // 添加到处理队列
      this.processingQueue.push({
        filePath: filePath,
        fileName: fileName,
        callbacks: callbacks,
      });

      // 开始处理队列
      if (!this.isProcessing) {
        this.processQueue();
      }
    } catch (error) {
      console.error("Error handling file change:", error);
      if (callbacks.onWatchError) {
        callbacks.onWatchError(error);
      }
    }
  }

  /**
   * 处理队列中的文件
   */
  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.processingQueue.length > 0) {
      const item = this.processingQueue.shift();
      await this.processImageFile(item);
    }

    this.isProcessing = false;
  }

  /**
   * 处理单个图片文件
   * @param {Object} item - 队列项
   */
  async processImageFile(item) {
    const { filePath, fileName, callbacks } = item;

    try {
      // 记录开始时间
      this.startTime = Date.now();

      // 标记为已处理
      this.processedFiles.add(filePath);

      // 记录原始文件大小（字节）
      let originalSizeBytes = 0;
      try {
        const originalStats = fs.statSync(filePath);
        originalSizeBytes = originalStats.size || 0;
      } catch (_) {}

      // 通知处理开始
      if (callbacks.onImageProcessStart) {
        callbacks.onImageProcessStart({
          fileName: fileName,
          filePath: filePath,
          originalSize: originalSizeBytes,
        });
      }

      // 等待文件写入完成
      await this.waitForFileStable(filePath);

      // 再次检查文件是否存在
      if (!fs.existsSync(filePath)) {
        throw new Error(
          `File ${fileName} no longer exists after waiting for stability`
        );
      }

      // 就地压缩并覆盖原文件，避免创建临时目录引发级联事件
      await optimizeSingleImage(filePath);

      // 记录压缩后的文件大小（字节）
      let optimizedSizeBytes = 0;
      try {
        const optimizedStats = fs.statSync(filePath);
        optimizedSizeBytes = optimizedStats.size || 0;
      } catch (_) {}

      // 通知处理完成（携带大小与压缩率）
      if (callbacks.onImageProcessComplete) {
        let saved = 0;
        let rate = 0;
        if (originalSizeBytes > 0 && optimizedSizeBytes > 0) {
          saved = Math.max(originalSizeBytes - optimizedSizeBytes, 0);
          rate = Number(((saved / originalSizeBytes) * 100).toFixed(2));
        }
        callbacks.onImageProcessComplete({
          fileName: fileName,
          filePath: filePath,
          originalSize: originalSizeBytes,
          optimizedSize: optimizedSizeBytes,
          savedBytes: saved,
          compressionRate: rate,
        });
      }
    } catch (error) {
      console.error(`Error processing image ${fileName}:`, error);

      // 清理临时目录（如果存在）
      try {
        const tempDir = path.join(path.dirname(filePath), `temp_${Date.now()}`);
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (cleanupError) {
        console.error("Error cleaning up temporary directory:", cleanupError);
      }

      // 通知处理错误
      if (callbacks.onImageProcessError) {
        callbacks.onImageProcessError({
          fileName: fileName,
          filePath: filePath,
          error: error.message,
        });
      }
    }
  }

  /**
   * 等待文件写入稳定
   * @param {string} filePath - 文件路径
   */
  async waitForFileStable(filePath) {
    return new Promise((resolve) => {
      let lastSize = -1;
      let stableCount = 0;
      const maxStableCount = 3; // 连续3次大小不变认为稳定
      const maxWaitTime = 15000; // 最大等待时间15秒
      const startTime = Date.now();

      const checkFile = () => {
        try {
          // 检查是否超时
          if (Date.now() - startTime > maxWaitTime) {
            console.warn(`File ${filePath} stability check timeout`);
            resolve();
            return;
          }

          if (!fs.existsSync(filePath)) {
            console.log(`File ${filePath} does not exist, waiting...`);
            setTimeout(checkFile, 1000); // 增加等待时间
            return;
          }

          const stats = fs.statSync(filePath);
          const currentSize = stats.size;

          // 检查文件是否可读
          try {
            fs.accessSync(filePath, fs.constants.R_OK);
          } catch (accessError) {
            console.log(`File ${filePath} not readable yet, waiting...`);
            setTimeout(checkFile, 1000);
            return;
          }

          if (currentSize === lastSize && currentSize > 0) {
            stableCount++;
            if (stableCount >= maxStableCount) {
              console.log(
                `File ${filePath} is stable (size: ${currentSize} bytes)`
              );
              resolve();
              return;
            }
          } else {
            stableCount = 0;
            lastSize = currentSize;
          }

          setTimeout(checkFile, 1000); // 增加检查间隔
        } catch (error) {
          console.log(`Error checking file ${filePath}:`, error.message);
          setTimeout(checkFile, 1000);
        }
      };

      checkFile();
    });
  }

  /**
   * 停止监听
   */
  stopWatching() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }

    this.isWatching = false;
    this.watchPath = null;
    this.namingMode = null;
    this.processedFiles.clear();
    this.processingQueue = [];
    this.isProcessing = false;

    console.log("Stopped watching folder");
  }

  /**
   * 获取监听状态
   */
  getStatus() {
    return {
      isWatching: this.isWatching,
      watchPath: this.watchPath,
      namingMode: this.namingMode,
      processedFilesCount: this.processedFiles.size,
      queueLength: this.processingQueue.length,
      isProcessing: this.isProcessing,
    };
  }

  /**
   * 格式化文件大小
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的大小
   */
  formatSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * 格式化时间
   * @param {number} milliseconds - 毫秒数
   * @returns {string} 格式化后的时间
   */
  formatTime(milliseconds) {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    const seconds = Math.floor(milliseconds / 1000);
    return `${seconds}s`;
  }
}

// 创建全局实例
const folderWatcher = new FolderWatcher();

module.exports = {
  FolderWatcher,
  folderWatcher,
};
