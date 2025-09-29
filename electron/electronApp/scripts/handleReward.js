const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
function copyToClipboard(text) {
  const platform = process.platform;

  if (platform === "darwin") {
    // macOS
    const child = exec("pbcopy");
    child.stdin.write(text);
    child.stdin.end();
  } else if (platform === "win32") {
    // Windows
    const child = exec("clip");
    child.stdin.write(text);
    child.stdin.end();
  } else {
    // Linux
    const child = exec("xclip -selection clipboard");
    child.stdin.write(text);
    child.stdin.end();
  }
}

/**
 * 解析文件名中的数字范围
 * @param {string} filename - 文件名
 * @returns {number[]} 数字数组
 */
function parseNumbersFromFilename(filename) {
  // 去掉扩展名
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, "");
  // 只提取末尾的数字
  const match = nameWithoutExt.match(/(\d+)$/);
  return match ? [parseInt(match[1])] : [];
}

/**
 * 检查是否存在对应的MP4文件
 * @param {string} imagePath - 图片文件路径
 * @param {string} folderPath - 文件夹路径
 * @returns {boolean} 是否存在对应的MP4文件
 */
function hasCorrespondingMp4(imagePath, folderPath) {
  const filename = path.basename(imagePath, path.extname(imagePath));
  const mp4Path = path.join(folderPath, `${filename}.mp4`);
  return fs.existsSync(mp4Path);
}

/**
 * 生成数字范围字符串
 * @param {number[]} numbers - 数字数组
 * @returns {string} 范围字符串
 */
function generateRangeString(numbers) {
  if (numbers.length === 0) return "";

  const sortedNumbers = [...new Set(numbers)].sort((a, b) => a - b);

  if (sortedNumbers.length === 1) {
    return sortedNumbers[0].toString();
  }

  const ranges = [];
  let start = sortedNumbers[0];
  let end = sortedNumbers[0];

  for (let i = 1; i < sortedNumbers.length; i++) {
    if (sortedNumbers[i] === end + 1) {
      // 连续的数字，继续扩展范围
      end = sortedNumbers[i];
    } else {
      // 不连续的数字，保存当前范围并开始新范围
      if (start === end) {
        ranges.push(start.toString());
      } else {
        ranges.push(`${start}-${end}`);
      }
      start = end = sortedNumbers[i];
    }
  }

  // 处理最后一个范围
  if (start === end) {
    ranges.push(start.toString());
  } else {
    ranges.push(`${start}-${end}`);
  }

  return ranges.join(",");
}

/**
 * 提取文件名前缀（去掉数字部分）
 * @param {string} filename - 文件名
 * @returns {string} 前缀
 */
function extractPrefix(filename) {
  // 去掉扩展名
  const nameWithoutExt = filename.replace(/\.(png|jpg|jpeg|webp|gif)$/i, "");
  // 去掉末尾的数字，但保留前缀中的数字
  return nameWithoutExt.replace(/\d+$/, "");
}

/**
 * 从range字符串中提取最小数字用于排序
 * @param {string} range - 范围字符串，如 "1-3", "4", "5-7"
 * @returns {number} 最小数字
 */
function getMinNumberFromRange(range) {
  const numbers = range.match(/\d+/g);
  if (numbers && numbers.length > 0) {
    return Math.min(...numbers.map(Number));
  }
  return 0;
}

/**
 * 对配置数组进行排序
 * @param {Array} config - 配置数组
 * @returns {Array} 排序后的配置数组
 */
function sortConfig(config) {
  return config.sort((a, b) => {
    const aMin = getMinNumberFromRange(a.range[0]);
    const bMin = getMinNumberFromRange(b.range[0]);
    return aMin - bMin;
  });
}

/**
 * 主函数：遍历文件夹并生成配置对象数组
 * @param {string} folderPath - 文件夹路径
 * @returns {Array} 配置对象数组
 */
function generateImageConfig(folderPath) {
  if (!fs.existsSync(folderPath)) {
    console.error("文件夹不存在:", folderPath);
    return [];
  }

  const files = fs.readdirSync(folderPath);
  const imageExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

  // 按后缀分组
  const groupedByExtension = {};

  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    if (imageExtensions.includes(ext)) {
      if (!groupedByExtension[ext]) {
        groupedByExtension[ext] = [];
      }
      groupedByExtension[ext].push(file);
    }
  });

  const config = [];

  // 处理每个后缀组
  Object.keys(groupedByExtension).forEach((ext) => {
    const files = groupedByExtension[ext];

    // 按前缀分组
    const groupedByPrefix = {};

    files.forEach((file) => {
      const prefix = extractPrefix(file);
      if (!groupedByPrefix[prefix]) {
        groupedByPrefix[prefix] = [];
      }
      groupedByPrefix[prefix].push(file);
    });

    // 处理每个前缀组
    Object.keys(groupedByPrefix).forEach((prefix) => {
      const prefixFiles = groupedByPrefix[prefix];

      // 分别处理有MP4和没有MP4的文件
      const filesWithMp4 = [];
      const filesWithoutMp4 = [];

      prefixFiles.forEach((file) => {
        if (hasCorrespondingMp4(path.join(folderPath, file), folderPath)) {
          filesWithMp4.push(file);
        } else {
          filesWithoutMp4.push(file);
        }
      });

      // 处理没有MP4的文件（按连续范围分别生成配置）
      if (filesWithoutMp4.length > 0) {
        const allNumbers = [];
        filesWithoutMp4.forEach((file) => {
          const numbers = parseNumbersFromFilename(file);
          allNumbers.push(...numbers);
        });

        if (allNumbers.length > 0) {
          const ranges = generateRangeString(allNumbers).split(",");
          ranges.forEach((range) => {
            config.push({
              range: [range.trim()],
              prefix: prefix,
              playIcon: false,
              suffix: ext.substring(1), // 去掉点号
            });
          });
        }
      }

      // 处理有MP4的文件（按连续范围分别生成配置）
      if (filesWithMp4.length > 0) {
        const allNumbers = [];
        filesWithMp4.forEach((file) => {
          const numbers = parseNumbersFromFilename(file);
          allNumbers.push(...numbers);
        });

        if (allNumbers.length > 0) {
          const ranges = generateRangeString(allNumbers).split(",");
          ranges.forEach((range) => {
            config.push({
              range: [range.trim()],
              prefix: prefix,
              playIcon: true,
              suffix: ext.substring(1), // 去掉点号
            });
          });
        }
      }
    });
  });

  // 对配置数组进行排序
  return sortConfig(config);
}

/**
 * 命令行接口
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("使用方法: node handleReward.js <文件夹路径>");
    console.log("示例: node handleReward.js ./images");
    return;
  }

  const folderPath = args[0];
  console.log("正在处理文件夹:", folderPath);

  const config = generateImageConfig(folderPath);

  // 保存到文件
  const outputPath = path.join(folderPath, "imageConfig.json");
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
  console.log(`配置已保存到: ${outputPath}`);

  // 复制到剪贴板
  const configText = JSON.stringify(config, null, 2);
  copyToClipboard(configText);
  // console.log("✅ 配置已复制到剪贴板，可以直接粘贴使用！");
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = {
  generateImageConfig,
  parseNumbersFromFilename,
  hasCorrespondingMp4,
  generateRangeString,
  extractPrefix,
  copyToClipboard,
  getMinNumberFromRange,
  sortConfig,
};
