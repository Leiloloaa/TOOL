const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const https = require("https");

// tinify 官网生成 https://tinify.com/dashboard/overview
// 设置 API 密钥 list
const keyList = [
  "cvZhtSDljV35jCjlrJHdBlTDfvCkYk1w", // mico
  "mHwTGBqlZSgZjwRbLXVYVp0rdQcLsH7B", // 163
  "vYkCKdWvhqvlWyb675QZwn3Fshn1qvwx", // gmail
  "4CZ2f8tCWF1bPtXh1YCs0ZTfV7zTVrr9", // qq
  "kMKByTljdmfS3wzXxD18PZStYmJfpZFP",
  "MrBBNMHxpx4DpzWXcpblRfqDS04rkPjF",
];

// 获取随机 API key 的函数
function getRandomApiKey() {
  // 使用 crypto.randomInt 生成更安全的随机数
  const crypto = require("crypto");
  const randomIndex = crypto.randomInt(0, keyList.length);
  return keyList[randomIndex];
}

// ====== 优化的原生加载动画实现 ======
class Spinner {
  constructor(text = "Loading...") {
    this.text = text;
    this.spinnerChars = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    this.currentIndex = 0;
    this.interval = null;
    this.isRunning = false;
    this.startTime = null;
    this.lastUpdateTime = 0;
  }

  start() {
    if (this.isRunning) return this;
    this.isRunning = true;
    this.startTime = Date.now();
    this.lastUpdateTime = 0;
    this.render();
    this.interval = setInterval(() => {
      const now = Date.now();
      // 限制更新频率，避免闪烁
      if (now - this.lastUpdateTime >= 80) {
        this.currentIndex = (this.currentIndex + 1) % this.spinnerChars.length;
        this.render();
        this.lastUpdateTime = now;
      }
    }, 80);
    return this;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    process.stdout.write("\r\x1b[K"); // 清除当前行
  }

  render() {
    const spinner = this.spinnerChars[this.currentIndex];
    const elapsed = this.startTime
      ? Math.floor((Date.now() - this.startTime) / 1000)
      : 0;
    const timeStr = elapsed > 0 ? ` (${elapsed}s)` : "";
    process.stdout.write(`\r${spinner} ${this.text}${timeStr}`);
  }

  set text(newText) {
    this._text = newText;
    if (this.isRunning) {
      this.render();
    }
  }

  get text() {
    return this._text;
  }

  succeed(text) {
    this.stop();
    const elapsed = this.startTime
      ? Math.floor((Date.now() - this.startTime) / 1000)
      : 0;
    const timeStr = elapsed > 0 ? ` (${elapsed}s)` : "";
    console.log(`\r✅ ${text || this.text}${timeStr}`);
  }

  fail(text) {
    this.stop();
    const elapsed = this.startTime
      ? Math.floor((Date.now() - this.startTime) / 1000)
      : 0;
    const timeStr = elapsed > 0 ? ` (${elapsed}s)` : "";
    console.log(`\r❌ ${text || this.text}${timeStr}`);
  }

  warn(text) {
    this.stop();
    const elapsed = this.startTime
      ? Math.floor((Date.now() - this.startTime) / 1000)
      : 0;
    const timeStr = elapsed > 0 ? ` (${elapsed}s)` : "";
    console.log(`\r⚠️  ${text || this.text}${timeStr}`);
  }

  info(text) {
    this.stop();
    const elapsed = this.startTime
      ? Math.floor((Date.now() - this.startTime) / 1000)
      : 0;
    const timeStr = elapsed > 0 ? ` (${elapsed}s)` : "";
    console.log(`\rℹ️  ${text || this.text}${timeStr}`);
  }

  // 新增：进度显示功能
  updateProgress(current, total) {
    if (!this.isRunning) return;

    const percentage = Math.round((current / total) * 100);
    const progressBar = this.createProgressBar(percentage);
    const elapsed = this.startTime
      ? Math.floor((Date.now() - this.startTime) / 1000)
      : 0;
    const timeStr = elapsed > 0 ? ` (${elapsed}s)` : "";

    process.stdout.write(
      `\r${this.spinnerChars[this.currentIndex]} ${
        this.text
      } ${progressBar} ${percentage}%${timeStr}`
    );
  }

  // 创建进度条
  createProgressBar(percentage) {
    const width = 20;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;

    const filledChar = "█";
    const emptyChar = "░";

    return filledChar.repeat(filled) + emptyChar.repeat(empty);
  }
}

// ====== 原生 TinyPNG API 实现 ======
/**
 * 使用 TinyPNG API 压缩图片
 * @param {Buffer} imageBuffer - 图片数据
 * @returns {Promise<Buffer>} 压缩后的图片数据
 */
function compressImageWithTinyPNG(imageBuffer) {
  return new Promise((resolve, reject) => {
    // 每次压缩都随机使用一个 API key
    const currentApiKey = getRandomApiKey();
    const auth = Buffer.from(`api:${currentApiKey}`).toString("base64");

    // 可选：显示当前使用的 API key（调试用）
    // console.log(`使用 API key: ${currentApiKey.substring(0, 8)}...`);

    const options = {
      hostname: "api.tinify.com",
      port: 443,
      path: "/shrink",
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/octet-stream",
        "Content-Length": imageBuffer.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 201) {
          try {
            const result = JSON.parse(data);
            // 下载压缩后的图片
            downloadCompressedImage(result.output.url, resolve, reject);
          } catch (error) {
            reject(new Error(`Failed to parse API response: ${error.message}`));
          }
        } else {
          reject(
            new Error(
              `API request failed with status ${res.statusCode}: ${data}`
            )
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.write(imageBuffer);
    req.end();
  });
}

/**
 * 下载压缩后的图片
 * @param {string} url - 压缩后图片的URL
 * @param {Function} resolve - Promise resolve函数
 * @param {Function} reject - Promise reject函数
 */
function downloadCompressedImage(url, resolve, reject) {
  const options = {
    hostname: "api.tinify.com",
    port: 443,
    path: url.replace("https://api.tinify.com", ""),
    method: "GET",
  };

  const req = https.request(options, (res) => {
    const chunks = [];

    res.on("data", (chunk) => {
      chunks.push(chunk);
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      } else {
        reject(
          new Error(`Failed to download compressed image: ${res.statusCode}`)
        );
      }
    });
  });

  req.on("error", (error) => {
    reject(new Error(`Download failed: ${error.message}`));
  });

  req.end();
}

// 图片处理工具配置
const suffixList = [".png", ".jpg", ".jpeg"];
const skipFormats = [".webp", ".mp4"];

/**
 * 解压ZIP文件
 * @param {string} zipPath - ZIP文件路径
 * @param {string} outputDir - 输出目录
 * @returns {Promise<void>}
 */
async function unzipFile(zipPath, outputDir) {
  return new Promise((resolve, reject) => {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 检测操作系统并使用相应的解压命令
    const platform = process.platform;
    let command, args;

    if (platform === "win32") {
      // Windows 使用 PowerShell 的 Expand-Archive
      command = "powershell";
      args = [
        "-Command",
        `Expand-Archive -Path "${zipPath}" -DestinationPath "${outputDir}" -Force`,
      ];
    } else {
      // Unix/Linux/macOS 使用 unzip 命令
      command = "unzip";
      // 先尝试最简单的参数
      args = ["-o", zipPath, "-d", outputDir];
    }

    // 执行解压命令
    const child = child_process.spawn(command, args, {
      stdio: "pipe",
      shell: false, // 不使用 shell 模式，避免特殊字符问题
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        // 如果第一次失败，尝试使用不同的方法
        if (platform !== "win32") {
          console.log("尝试使用不同的解压方法...");

          // 尝试使用 ditto 命令（macOS 特有）
          const dittoCommand = "ditto";
          const dittoArgs = ["-xk", zipPath, outputDir];

          const dittoChild = child_process.spawn(dittoCommand, dittoArgs, {
            stdio: "pipe",
            shell: false, // 不使用 shell 模式，避免特殊字符问题
          });

          let dittoStdout = "";
          let dittoStderr = "";

          dittoChild.stdout.on("data", (data) => {
            dittoStdout += data.toString();
          });

          dittoChild.stderr.on("data", (data) => {
            dittoStderr += data.toString();
          });

          dittoChild.on("close", (dittoCode) => {
            if (dittoCode === 0) {
              resolve();
            } else {
              reject(
                new Error(
                  `Failed to extract ZIP file with all methods. Last exit code: ${dittoCode}. Error: ${dittoStderr}`
                )
              );
            }
          });

          dittoChild.on("error", (error) => {
            reject(
              new Error(`Failed to execute ditto command: ${error.message}`)
            );
          });
        } else {
          reject(
            new Error(
              `Failed to extract ZIP file. Exit code: ${code}. Error: ${stderr}`
            )
          );
        }
      }
    });

    child.on("error", (error) => {
      reject(new Error(`Failed to execute unzip command: ${error.message}`));
    });
  });
}

/**
 * 处理所有ZIP文件
 * @param {string} dirPath - 目录路径
 * @returns {Promise<boolean>} - 是否有ZIP文件被处理
 */
async function processAllZips(dirPath) {
  const spinner = new Spinner("Checking for ZIP files...").start();
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    const zipFiles = files.filter(
      (file) => file.isFile() && file.name.endsWith(".zip")
    );

    if (zipFiles.length === 0) {
      spinner.info("No ZIP files found");
      return false;
    }

    spinner.text = `Found ${zipFiles.length} ZIP files, starting extraction...`;

    for (const [index, zipFile] of zipFiles.entries()) {
      const zipPath = path.join(dirPath, zipFile.name);
      const extractDir = path.join(
        dirPath,
        path.basename(zipFile.name, ".zip")
      );

      try {
        spinner.updateProgress(index + 1, zipFiles.length);
        spinner.text = `Extracting: ${zipFile.name}`;
        await unzipFile(zipPath, extractDir);
        spinner.succeed(`Successfully extracted: ${zipFile.name}`);
      } catch (error) {
        spinner.fail(`Failed to extract ${zipFile.name}: ${error.message}`);
        console.error(`Detailed error for ${zipFile.name}:`, error);
        // 解压失败时停止后续操作
        throw error;
      }
    }

    spinner.succeed(`Finished processing ${zipFiles.length} ZIP files`);
    return true;
  } catch (error) {
    spinner.fail("ZIP extraction process failed");
    console.error("Error during ZIP processing:", error);
    // ZIP 处理失败时停止整个流程
    throw error;
  }
}

/**
 * 扁平化目录结构
 * @param {string} dirPath - 当前处理的目录路径
 * @param {string} rootPath - 根目录路径（文件最终移动的目标目录）
 * @param {boolean} isRoot - 是否为根目录
 * @returns {Promise<void>}
 */
async function flatDir(dirPath, rootPath, isRoot = true) {
  if (!dirPath || !rootPath) {
    throw new Error("Directory path and root path must be provided");
  }

  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);

    // 忽略隐藏文件和目录
    if (file.name.startsWith(".")) {
      continue;
    }

    if (file.isDirectory()) {
      // 递归处理子目录
      await flatDir(fullPath, rootPath, false);
    } else if (!isRoot) {
      // 移动所有非根目录下的文件到根目录（包括非图片文件）
      const ext = path.extname(file.name).toLowerCase();

      // 移动文件到根目录
      const targetPath = path.join(rootPath, file.name);
      let finalPath = targetPath;
      let counter = 1;

      // 处理文件名冲突
      while (fs.existsSync(finalPath)) {
        const nameWithoutExt = path.basename(file.name, ext);
        finalPath = path.join(rootPath, `${nameWithoutExt}_${counter}${ext}`);
        counter++;
      }

      fs.renameSync(fullPath, finalPath);
      console.log(`Moved: ${fullPath} -> ${finalPath}`);
    }
  }
}

/**
 * 优化图片
 * @param {string} filePath - 图片文件路径
 * @returns {Promise<void>}
 */
async function optimizeImage(filePath) {
  const spinner = new Spinner(`Optimizing: ${path.basename(filePath)}`).start();

  try {
    // 检查文件是否存在且可读
    const stats = await fs.promises.stat(filePath);
    if (stats.size === 0) {
      spinner.warn(`Skipped: ${path.basename(filePath)} (empty file)`);
      return;
    }

    const originalBuffer = await fs.promises.readFile(filePath);
    const originalSize = originalBuffer.length;

    // 验证文件内容
    if (originalSize === 0) {
      spinner.warn(`Skipped: ${path.basename(filePath)} (empty file)`);
      return;
    }

    // 检查文件头部信息，验证是否为有效的图片文件
    const isValidImage = validateImageHeader(
      originalBuffer,
      path.extname(filePath).toLowerCase()
    );
    if (!isValidImage) {
      spinner.warn(
        `Skipped: ${path.basename(filePath)} (invalid image format)`
      );
      return;
    }

    // 使用tinify进行压缩
    const resultData = await compressImageWithTinyPNG(originalBuffer);
    const optimizedSize = resultData.length;
    const compressionRate = (
      ((originalSize - optimizedSize) / originalSize) *
      100
    ).toFixed(2);

    // 只有当压缩效果明显时才保存（节省超过5%）
    if (optimizedSize < originalSize * 0.95) {
      await fs.promises.writeFile(filePath, resultData);
      spinner.succeed(
        `Optimized: ${path.basename(filePath)} (${compressionRate}% smaller)`
      );

      // 详细的压缩信息
      console.log(`  Original size: ${formatSize(originalSize)}`);
      console.log(`  Optimized size: ${formatSize(optimizedSize)}`);
      console.log(`  Saved: ${formatSize(originalSize - optimizedSize)}`);
    } else {
      spinner.info(
        `Skipped: ${path.basename(filePath)} (minimal optimization potential)`
      );
    }
  } catch (error) {
    // 更详细的错误处理
    if (
      error.message.includes("Decode error") ||
      error.message.includes("400")
    ) {
      spinner.warn(
        `Skipped: ${path.basename(filePath)} (corrupted or unsupported format)`
      );
      console.error(`  Error details: ${error.message}`);
      console.error(
        `  This file may be corrupted or in an unsupported format.`
      );
      return; // 跳过这个文件，继续处理其他文件
    }

    spinner.fail(`Failed to optimize: ${path.basename(filePath)}`);
    console.error(`  Error details: ${error.message}`);

    // 如果是 tinify API 限制，给出特殊提示
    if (error.status === 429) {
      console.error(
        "  TinyPNG API limit reached. Please try again later or use a different API key."
      );
    }

    // 对于其他错误，也跳过文件而不是停止整个处理
    console.error(`  Skipping this file and continuing with others...`);
  }
}

/**
 * 就地优化单个图片文件（覆盖式写回）
 * @param {string} filePath - 图片文件路径
 * @returns {Promise<void>}
 */
async function optimizeSingleImage(filePath) {
  const spinner = new Spinner(
    `Optimizing(single): ${path.basename(filePath)}`
  ).start();

  try {
    const stats = await fs.promises.stat(filePath);
    if (stats.size === 0) {
      spinner.warn(`Skipped: ${path.basename(filePath)} (empty file)`);
      return;
    }

    const originalBuffer = await fs.promises.readFile(filePath);
    const originalSize = originalBuffer.length;

    if (originalSize === 0) {
      spinner.warn(`Skipped: ${path.basename(filePath)} (empty file)`);
      return;
    }

    const isValidImage = validateImageHeader(
      originalBuffer,
      path.extname(filePath).toLowerCase()
    );
    if (!isValidImage) {
      spinner.warn(
        `Skipped: ${path.basename(filePath)} (invalid image format)`
      );
      return;
    }

    // 压缩并直接覆盖原文件
    const resultData = await compressImageWithTinyPNG(originalBuffer);
    const optimizedSize = resultData.length;

    if (optimizedSize < originalSize * 0.95) {
      await fs.promises.writeFile(filePath, resultData);
      const compressionRate = (
        ((originalSize - optimizedSize) / originalSize) *
        100
      ).toFixed(2);
      spinner.succeed(
        `Optimized(single): ${path.basename(filePath)} (${compressionRate}% smaller)`
      );
    } else {
      spinner.info(
        `Skipped: ${path.basename(filePath)} (minimal optimization potential)`
      );
    }
  } catch (error) {
    if (
      error.message.includes("Decode error") ||
      error.message.includes("400")
    ) {
      spinner.warn(
        `Skipped: ${path.basename(filePath)} (corrupted or unsupported format)`
      );
      return;
    }
    spinner.fail(`Failed to optimize(single): ${path.basename(filePath)}`);
    console.error(`  Error details: ${error.message}`);
  }
}

/**
 * 验证图片文件头部信息
 * @param {Buffer} buffer - 文件数据
 * @param {string} extension - 文件扩展名
 * @returns {boolean}
 */
function validateImageHeader(buffer, extension) {
  if (buffer.length < 8) return false;

  const header = buffer.slice(0, 8);

  switch (extension) {
    case ".png":
      // PNG 文件头: 89 50 4E 47 0D 0A 1A 0A
      return (
        header[0] === 0x89 &&
        header[1] === 0x50 &&
        header[2] === 0x4e &&
        header[3] === 0x47 &&
        header[4] === 0x0d &&
        header[5] === 0x0a &&
        header[6] === 0x1a &&
        header[7] === 0x0a
      );

    case ".jpg":
    case ".jpeg":
      // JPEG 文件头: FF D8 FF
      return header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;

    default:
      return true; // 对于其他格式，暂时信任文件扩展名
  }
}

/**
 * 删除空目录和只包含隐藏文件的目录
 * @param {string} dirPath - 目录路径
 * @returns {Promise<void>}
 */
async function deleteEmptyDirectories(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    // 忽略隐藏目录
    if (file.name.startsWith(".")) {
      continue;
    }

    if (file.isDirectory()) {
      const fullPath = path.join(dirPath, file.name);

      // 递归处理子目录
      await deleteEmptyDirectories(fullPath);

      // 检查目录是否只包含隐藏文件或为空
      const remainingFiles = fs.readdirSync(fullPath);
      const nonHiddenFiles = remainingFiles.filter((fileName) => {
        // 过滤掉所有隐藏文件
        return !fileName.startsWith(".");
      });

      if (nonHiddenFiles.length === 0) {
        try {
          // 删除所有隐藏文件
          remainingFiles.forEach((fileName) => {
            const filePath = path.join(fullPath, fileName);
            try {
              fs.unlinkSync(filePath);
            } catch (error) {
              // 忽略删除失败的文件
            }
          });

          // 删除空目录
          fs.rmdirSync(fullPath);
          console.log(`Removed directory with only hidden files: ${fullPath}`);
        } catch (error) {
          console.error(
            `Failed to remove directory ${fullPath}: ${error.message}`
          );
        }
      }
    }
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string}
 */
function formatSize(bytes) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * 扁平化所有目录
 * @param {string} dirPath - 目录路径
 */
async function flattenAllDirectories(dirPath) {
  const spinner = new Spinner("Checking for directories...").start();
  try {
    const hasDirectories = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .some((item) => item.isDirectory() && !item.name.startsWith("."));

    if (!hasDirectories) {
      spinner.info("No directories to flatten");
      return;
    }

    spinner.text = "Flattening directory structure...";
    // 传递相同的 dirPath 作为 rootPath，因为这是最终文件要移动到的目标目录
    await flatDir(dirPath, dirPath);
    spinner.succeed("Successfully flattened all directories");
  } catch (error) {
    spinner.fail("Directory flattening failed");
    console.error("Error during directory flattening:", error);
    throw error;
  }
}

/**
 * 检查文件是否为支持的图片格式
 * @param {string} filename - 文件名
 * @returns {boolean}
 */
function isSupportedImage(filename) {
  if (!filename) return false;

  // 忽略隐藏文件
  if (filename.startsWith(".")) return false;

  // 获取文件扩展名并转换为小写
  const ext = path.extname(filename).toLowerCase();

  // 跳过 webp 和 mp4 格式
  if (skipFormats.includes(ext)) {
    return false;
  }

  // 检查是否在支持的文件类型列表中
  return suffixList.includes(ext);
}

/**
 * 统计跳过的文件格式
 * @param {string} dirPath - 目录路径
 */
function countSkippedFormats(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  const skippedStats = {};

  files.forEach((file) => {
    if (file.isFile() && !file.name.startsWith(".")) {
      const ext = path.extname(file.name).toLowerCase();
      if (skipFormats.includes(ext)) {
        skippedStats[ext] = (skippedStats[ext] || 0) + 1;
      }
    }
  });

  return skippedStats;
}

/**
 * 处理所有图片（压缩和重命名）
 * @param {string} dirPath - 目录路径
 * @param {string} namingMode - 命名模式
 * @param {string} customPrefix - 自定义前缀
 */
async function processAllImages(dirPath, namingMode, customPrefix = null) {
  const spinner = new Spinner("Processing images...").start();
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    const imageFiles = files.filter(
      (file) => file.isFile() && isSupportedImage(file.name)
    );

    if (imageFiles.length === 0) {
      spinner.info("No images found to process");
      return;
    }

    spinner.text = `Found ${imageFiles.length} images, starting processing...`;
    let processedCount = 0;
    let skippedCount = 0;

    for (const [index, file] of imageFiles.entries()) {
      const filePath = path.join(dirPath, file.name);

      // 更新进度显示
      spinner.updateProgress(index + 1, imageFiles.length);
      spinner.text = `Processing: ${file.name}`;

      try {
        // 压缩图片
        await optimizeImage(filePath);

        // 重命名处理
        if (namingMode !== "a") {
          let newName;
          if (namingMode.startsWith("custom:") && customPrefix) {
            // 使用自定义前缀
            newName = `${customPrefix}${index + 1}${path.extname(file.name)}`;
          } else {
            // 使用默认的 image_ 前缀
            newName = `image_${index + 1}${path.extname(file.name)}`;
          }
          const newPath = path.join(dirPath, newName);
          fs.renameSync(filePath, newPath);
        }

        processedCount++;
      } catch (error) {
        // 单个文件处理失败，记录但继续处理其他文件
        console.error(`Failed to process ${file.name}: ${error.message}`);
        skippedCount++;
      }
    }

    if (processedCount > 0) {
      spinner.succeed(
        `Successfully processed ${processedCount} images${
          skippedCount > 0 ? `, skipped ${skippedCount}` : ""
        }`
      );
    } else {
      spinner.warn(
        `No images were successfully processed${
          skippedCount > 0 ? `, ${skippedCount} files were skipped` : ""
        }`
      );
    }
  } catch (error) {
    spinner.fail("Image processing failed");
    console.error("Error during image processing:", error);
    throw error;
  }
}

/**
 * 清理目录（删除ZIP和空目录）
 * @param {string} dirPath - 目录路径
 * @param {boolean} removeExtractedDirs - 是否删除解压后的目录，默认为true
 */
async function cleanupDirectory(dirPath, removeExtractedDirs = true) {
  const spinner = new Spinner("Starting cleanup...").start();
  try {
    // 删除ZIP文件
    const zipFiles = fs
      .readdirSync(dirPath)
      .filter((file) => file.endsWith(".zip"));

    if (zipFiles.length > 0) {
      spinner.text = "Removing ZIP files...";
      zipFiles.forEach((zip) => {
        fs.unlinkSync(path.join(dirPath, zip));
      });
      spinner.succeed(`Removed ${zipFiles.length} ZIP files`);
    }

    // 删除解压后产生的目录
    if (removeExtractedDirs) {
      spinner.text = "Removing extracted directories...";
      await removeExtractedDirectories(dirPath);
    } else {
      spinner.info("Skip removing extracted directories");
    }

    // 删除空目录
    spinner.text = "Removing empty directories...";
    await deleteEmptyDirectories(dirPath);
    spinner.succeed("Cleanup completed successfully");
  } catch (error) {
    spinner.fail("Cleanup failed");
    console.error("Error during cleanup:", error);
    throw error;
  }
}

/**
 * 删除解压后产生的目录，保留所有文件
 * @param {string} dirPath - 目录路径
 * @returns {Promise<void>}
 */
async function removeExtractedDirectories(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  let removedCount = 0;

  for (const file of files) {
    // 忽略隐藏目录
    if (file.name.startsWith(".")) {
      continue;
    }

    if (file.isDirectory()) {
      const fullPath = path.join(dirPath, file.name);

      // 检查这个目录是否是解压ZIP产生的目录
      // 解压ZIP产生的目录通常是以ZIP文件名命名的（去掉.zip扩展名）
      const isExtractedDir = await isExtractedZipDirectory(fullPath, dirPath);

      if (isExtractedDir) {
        // 将目录中的所有文件移动到根目录
        await moveAllFilesToRoot(fullPath, dirPath);

        // 删除目录（无论是否为空）
        try {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`Removed extracted directory: ${fullPath}`);
          removedCount++;
        } catch (error) {
          console.error(
            `Failed to remove directory ${fullPath}: ${error.message}`
          );
        }
      } else {
        console.log(`Skipped non-extracted directory: ${fullPath}`);
      }
    }
  }

  if (removedCount === 0) {
    console.log("No extracted directories found to remove");
  }
}

/**
 * 检查目录是否是解压ZIP产生的目录
 * @param {string} dirPath - 目录路径
 * @param {string} rootPath - 根目录路径
 * @returns {Promise<boolean>}
 */
async function isExtractedZipDirectory(dirPath, rootPath) {
  const dirName = path.basename(dirPath);

  // 检查根目录下是否有对应的ZIP文件（去掉.zip扩展名后应该匹配目录名）
  const possibleZipNames = [
    `${dirName}.zip`,
    `${dirName}.ZIP`,
    `${dirName}.Zip`,
  ];

  for (const zipName of possibleZipNames) {
    const zipPath = path.join(rootPath, zipName);
    if (fs.existsSync(zipPath)) {
      return true;
    }
  }

  // 如果目录名包含常见的解压目录特征，也认为是解压目录
  const extractedDirPatterns = [
    /^zip_\d+_\d+$/, // 匹配重命名后的ZIP文件解压目录
    /^[a-zA-Z0-9_-]+$/, // 匹配常见的ZIP文件名模式
  ];

  return extractedDirPatterns.some((pattern) => pattern.test(dirName));
}

/**
 * 检查目录中是否有图片文件
 * @param {string} dirPath - 目录路径
 * @returns {Promise<boolean>}
 */
async function checkDirectoryForImages(dirPath) {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const file of files) {
    // 忽略隐藏文件和目录
    if (file.name.startsWith(".")) {
      continue;
    }

    if (file.isDirectory()) {
      const hasImages = await checkDirectoryForImages(
        path.join(dirPath, file.name)
      );
      if (hasImages) return true;
    } else if (isSupportedImage(file.name)) {
      return true;
    }
  }
  return false;
}

/**
 * 将目录中的所有文件移动到根目录
 * @param {string} sourceDir - 源目录
 * @param {string} targetDir - 目标目录（根目录）
 * @returns {Promise<void>}
 */
async function moveAllFilesToRoot(sourceDir, targetDir) {
  const files = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const file of files) {
    // 忽略隐藏文件和目录
    if (file.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(sourceDir, file.name);

    if (file.isDirectory()) {
      // 递归处理子目录
      await moveAllFilesToRoot(fullPath, targetDir);
    } else {
      // 移动所有文件到根目录
      const targetPath = path.join(targetDir, file.name);
      let finalPath = targetPath;
      let counter = 1;

      // 处理文件名冲突
      while (fs.existsSync(finalPath)) {
        const nameWithoutExt = path.basename(
          file.name,
          path.extname(file.name)
        );
        finalPath = path.join(
          targetDir,
          `${nameWithoutExt}_${counter}${path.extname(file.name)}`
        );
        counter++;
      }

      fs.renameSync(fullPath, finalPath);
      console.log(`Moved file: ${fullPath} -> ${finalPath}`);
    }
  }
}

/**
 * 将目录中的图片文件移动到根目录（保留原函数以兼容）
 * @param {string} sourceDir - 源目录
 * @param {string} targetDir - 目标目录（根目录）
 * @returns {Promise<void>}
 */
async function moveImagesToRoot(sourceDir, targetDir) {
  const files = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const file of files) {
    // 忽略隐藏文件和目录
    if (file.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(sourceDir, file.name);

    if (file.isDirectory()) {
      // 递归处理子目录
      await moveImagesToRoot(fullPath, targetDir);
    } else if (isSupportedImage(file.name)) {
      // 移动图片文件到根目录
      const targetPath = path.join(targetDir, file.name);
      let finalPath = targetPath;
      let counter = 1;

      // 处理文件名冲突
      while (fs.existsSync(finalPath)) {
        const nameWithoutExt = path.basename(
          file.name,
          path.extname(file.name)
        );
        finalPath = path.join(
          targetDir,
          `${nameWithoutExt}_${counter}${path.extname(file.name)}`
        );
        counter++;
      }

      fs.renameSync(fullPath, finalPath);
      console.log(`Moved image: ${fullPath} -> ${finalPath}`);
    }
  }
}

// 重命名压缩包，去掉特殊字符
async function renameZipFiles(dirPath) {
  const spinner = new Spinner("正在重命名压缩包...");
  spinner.start();

  try {
    const files = fs.readdirSync(dirPath);
    let renamedCount = 0;

    for (const file of files) {
      // 跳过隐藏文件
      if (file.startsWith(".")) continue;

      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile() && isZipFile(file)) {
        // 生成新的文件名（随机数+时间戳）
        const newName = generateSafeFileName(file);
        const newPath = path.join(dirPath, newName);

        // 重命名文件
        fs.renameSync(filePath, newPath);
        console.log(`  📦 重命名: ${file} → ${newName}`);
        renamedCount++;
      }
    }

    if (renamedCount > 0) {
      spinner.succeed(`重命名完成，共处理 ${renamedCount} 个压缩包`);
    } else {
      spinner.info("没有需要重命名的压缩包");
    }
  } catch (error) {
    spinner.fail(`重命名失败: ${error.message}`);
    throw error;
  }
}

// 生成安全的文件名（使用随机数+时间戳）
function generateSafeFileName(filename) {
  // 获取文件扩展名
  const ext = path.extname(filename);

  // 生成随机数（4位）
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  // 生成时间戳
  const timestamp = Date.now();

  // 组合新文件名：随机数_时间戳.zip
  return `zip_${randomNum}_${timestamp}${ext}`;
}

// 检查是否为 ZIP 文件
function isZipFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ext === ".zip";
}

/**
 * 检查目录中是否存在ZIP文件
 * @param {string} dirPath - 目录路径
 * @returns {boolean} - 是否存在ZIP文件
 */
function hasZipFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    return files.some((file) => {
      // 跳过隐藏文件
      if (file.startsWith(".")) return false;

      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      return stat.isFile() && isZipFile(file);
    });
  } catch (error) {
    console.error(`检查ZIP文件时出错: ${error.message}`);
    return false;
  }
}

/**
 * 主流程控制函数
 */
async function processImages(dirPath, namingMode, options = {}) {
  const { flatten = false, removeExtractedDirs = true } = options;

  // 验证目录路径
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory ${dirPath} does not exist`);
  }

  console.log("\n=== Starting Image Processing ===\n");
  console.log(`Directory: ${dirPath}`);

  // 处理自定义前缀
  let namingModeDisplay = "Keep original names";
  let customPrefix = null;

  if (namingMode === "a") {
    namingModeDisplay = "Keep original names";
  } else if (namingMode.startsWith("custom:")) {
    customPrefix = namingMode.substring(7); // 移除 "custom:" 前缀
    namingModeDisplay = `Use custom prefix: ${customPrefix}`;
  } else {
    namingModeDisplay = "Use image_ prefix";
  }

  console.log(`Naming Mode: ${namingModeDisplay}\n`);

  try {
    // 检查是否存在ZIP文件
    const hasZips = hasZipFiles(dirPath);

    if (hasZips) {
      console.log("📦 检测到ZIP文件，开始处理压缩包...\n");

      // Step 1: 重命名压缩包，去掉特殊字符
      console.log("Step 1: Renaming ZIP Files");
      await renameZipFiles(dirPath);

      // Step 2: 解压所有ZIP文件
      console.log("\nStep 2: Extracting ZIP Files");
      await processAllZips(dirPath);
    } else {
      console.log("📁 未检测到ZIP文件，跳过压缩包处理步骤\n");
    }

    // Step 3: 扁平化所有目录
    console.log(
      `\nStep 3: Flattening Directories ${flatten ? "[enabled]" : "[disabled]"}`
    );
    if (flatten) {
      await flattenAllDirectories(dirPath);
    }

    // Step 4: 处理所有图片（压缩和重命名）
    console.log("\nStep 4: Processing Images");

    // 统计跳过的格式
    const skippedStats = countSkippedFormats(dirPath);
    if (Object.keys(skippedStats).length > 0) {
      console.log("📋 Skipped formats:");
      Object.entries(skippedStats).forEach(([format, count]) => {
        console.log(`   ${format}: ${count} files`);
      });
      console.log("");
    }

    await processAllImages(dirPath, namingMode, customPrefix);

    // Step 5: 清理目录（删除ZIP文件、解压后的目录和空目录）
    console.log("\nStep 5: Cleaning Up");
    await cleanupDirectory(dirPath, removeExtractedDirs);

    console.log("\n=== Processing Completed Successfully ===\n");
  } catch (error) {
    console.error("\n=== Processing Failed ===");
    console.error("Error details:", error.message);
    console.error("\nStack trace:", error.stack);
    throw error;
  }
}

// 辅助函数
function hasPrefix(fileName, prefix) {
  return fileName.toLowerCase().startsWith(prefix.toLowerCase());
}

// 导出函数
module.exports = {
  processImages,
  optimizeSingleImage,
  renameZipFiles,
  processAllZips,
  flattenAllDirectories,
  processAllImages,
  cleanupDirectory,
  countSkippedFormats,
  deleteEmptyDirectories,
  removeExtractedDirectories,
  isExtractedZipDirectory,
  hasZipFiles,
};
