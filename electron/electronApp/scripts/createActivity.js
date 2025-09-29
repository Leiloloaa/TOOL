const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);
const stat = fs.stat;

// 获取当前Git分支
async function getCurrentGitBranch() {
  try {
    const { stdout } = await execPromise("git rev-parse --abbrev-ref HEAD");
    return stdout.trim();
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    return "main"; // 默认分支
  }
}

// 首字母小写
function capitalizeFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

// 智能路径查找函数
// 缓存项目根目录，避免重复查找
let cachedProjectRoot = null;

const findProjectRoot = () => {
  // 如果已经缓存了结果，直接返回
  if (cachedProjectRoot) {
    return cachedProjectRoot;
  }

  console.log("=== 开始查找项目根目录 ===");
  console.log("当前工作目录:", process.cwd());
  console.log("脚本目录:", __dirname);

  // 策略1: 从当前工作目录开始向上查找
  let currentPath = process.cwd();
  const maxDepth = 20;

  for (let i = 0; i < maxDepth; i++) {
    const eventPath = path.join(currentPath, "event");
    const activityVitePath = path.join(currentPath, "activity-vite");
    const extensionPath = path.join(currentPath, "extension");

    const hasEventDir = fs.existsSync(eventPath);
    const hasActivityViteDir = fs.existsSync(activityVitePath);
    const hasExtensionDir = fs.existsSync(extensionPath);

    console.log(`第${i + 1}层检查: ${currentPath}`);
    console.log(`  event: ${hasEventDir ? "✓" : "✗"} (${eventPath})`);
    console.log(
      `  activity-vite: ${hasActivityViteDir ? "✓" : "✗"} (${activityVitePath})`
    );
    console.log(
      `  extension: ${hasExtensionDir ? "✓" : "✗"} (${extensionPath})`
    );

    if (hasEventDir && (hasActivityViteDir || hasExtensionDir)) {
      console.log(`✓ 找到项目根目录: ${currentPath}`);
      console.log("=== 项目根目录查找完成 ===");
      cachedProjectRoot = currentPath;
      return currentPath;
    }

    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
      console.log("已到达根目录，停止查找");
      break;
    }
    currentPath = parentPath;
  }

  // 策略2: 从脚本目录开始向上查找
  console.log("策略1失败，尝试从脚本目录向上查找...");
  currentPath = __dirname;

  for (let i = 0; i < maxDepth; i++) {
    const eventPath = path.join(currentPath, "event");
    const activityVitePath = path.join(currentPath, "activity-vite");
    const extensionPath = path.join(currentPath, "extension");

    const hasEventDir = fs.existsSync(eventPath);
    const hasActivityViteDir = fs.existsSync(activityVitePath);
    const hasExtensionDir = fs.existsSync(extensionPath);

    console.log(`脚本目录第${i + 1}层检查: ${currentPath}`);
    console.log(`  event: ${hasEventDir ? "✓" : "✗"} (${eventPath})`);
    console.log(
      `  activity-vite: ${hasActivityViteDir ? "✓" : "✗"} (${activityVitePath})`
    );
    console.log(
      `  extension: ${hasExtensionDir ? "✓" : "✗"} (${extensionPath})`
    );

    if (hasEventDir && (hasActivityViteDir || hasExtensionDir)) {
      console.log(`✓ 找到项目根目录: ${currentPath}`);
      console.log("=== 项目根目录查找完成 ===");
      cachedProjectRoot = currentPath;
      return currentPath;
    }

    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
      console.log("已到达根目录，停止查找");
      break;
    }
    currentPath = parentPath;
  }

  // 策略3: 尝试一些常见的可能路径
  console.log("策略2失败，尝试预定义路径...");
  const possiblePaths = [
    "/Users/stone/Desktop/work/yoho-activity-h5", // 用户的项目路径
    path.resolve(__dirname, "../../../"),
    path.resolve(__dirname, "../../../../"),
    path.resolve(__dirname, "../../../../../"),
    path.resolve(process.cwd(), "../../../"),
    path.resolve(process.cwd(), "../../../../"),
    path.resolve(process.cwd(), "../../../../../"),
    // 针对打包后的环境，尝试更深层次的查找
    path.resolve(process.cwd(), "../../../../../../"),
    path.resolve(process.cwd(), "../../../../../../../"),
    path.resolve(process.cwd(), "../../../../../../../../"),
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      const eventPath = path.join(possiblePath, "event");
      const activityVitePath = path.join(possiblePath, "activity-vite");
      const extensionPath = path.join(possiblePath, "extension");

      const hasEventDir = fs.existsSync(eventPath);
      const hasActivityViteDir = fs.existsSync(activityVitePath);
      const hasExtensionDir = fs.existsSync(extensionPath);

      console.log(`预定义路径检查: ${possiblePath}`);
      console.log(`  event: ${hasEventDir ? "✓" : "✗"} (${eventPath})`);
      console.log(
        `  activity-vite: ${hasActivityViteDir ? "✓" : "✗"} (${activityVitePath})`
      );
      console.log(
        `  extension: ${hasExtensionDir ? "✓" : "✗"} (${extensionPath})`
      );

      if (hasEventDir && (hasActivityViteDir || hasExtensionDir)) {
        console.log(`✓ 找到项目根目录: ${possiblePath}`);
        console.log("=== 项目根目录查找完成 ===");
        cachedProjectRoot = possiblePath;
        return possiblePath;
      }
    }
  }

  console.log("✗ 所有策略均失败，未找到项目根目录");
  console.log("=== 项目根目录查找失败 ===");
  return null;
};

// 获取项目根目录
const getProjectRoot = () => {
  const projectRoot = findProjectRoot();
  if (!projectRoot) {
    console.error("=== 项目根目录查找失败详细信息 ===");
    console.error("当前工作目录:", process.cwd());
    console.error("脚本目录:", __dirname);
    console.error("请确保项目包含以下目录结构之一:");
    console.error("  - event/ + activity-vite/");
    console.error("  - event/ + extension/");
    console.error("=== 项目根目录查找失败详细信息结束 ===");
    throw new Error("无法找到项目根目录，请确保在正确的项目环境中运行");
  }
  return projectRoot;
};

// URL映射 - 使用绝对路径
const getUrlMap = () => {
  const projectRoot = getProjectRoot();
  return {
    Yoho: path.join(projectRoot, "activity-vite"),
    Hiyoo: path.join(projectRoot, "activity-h5/activity-vite"),
    SoulStar: path.join(projectRoot, "maidocha-activity-h5"),
  };
};

// 模板地址 - 使用绝对路径
const getTemplateUrl = () => {
  const projectRoot = getProjectRoot();
  return path.join(projectRoot, "activity-vite/server/create_page/template");
};

// 写入活动URL配置
const prependToJsonFileConfig = async (config) => {
  const content = {
    [config.projectName +
    "_" +
    config.catalog +
    "_" +
    capitalizeFirstLetter(config.name)]: {
      活动名称: config.activityDesc,
      预热时间: config.time,
      活动ID: config.id,
      活动链接: config.activityUrl.replace("?lang=&key=", ""),
      需求文档: config.url,
      文案链接: config.textUrl,
      设计链接: config.figma,
    },
  };

  const urlMap = getUrlMap();
  const filePath = path.resolve(
    __dirname,
    config.catalog == "general"
      ? `${urlMap[config.projectName == "Hiyoo" ? "Hiyoo" : "Yoho"]}/server/general_activity.json`
      : `${urlMap[config.projectName == "Hiyoo" ? "Hiyoo" : "Yoho"]}/server/activity.json`
  );

  // 实现prependToJsonFile功能
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("读取文件时出错:", err);
        reject(err);
        return;
      }

      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        console.error("解析JSON时出错:", parseErr);
        reject(parseErr);
        return;
      }

      const updatedData = {
        ...content,
        ...jsonData,
      };

      fs.writeFile(
        filePath,
        JSON.stringify(updatedData, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error("写入文件时出错:", writeErr);
            reject(writeErr);
          } else {
            console.log("活动配置写入成功:", filePath);
            resolve(true);
          }
        }
      );
    });
  });
};

// 写入预加载配置
const writePreloadConfig = async (config, filePath) => {
  const imgListKey = [
    "head-EG.png",
    "tab.png",
    "tab-act.png",
    "a.png",
    "a1.png",
    "a2.png",
    "a3.png",
    "card.png",
  ];
  const prefix = "https://image.hoko.media/activity/";
  const imgListWithPrefix = imgListKey.map(
    (key) =>
      `${prefix}${config.catalog}_${capitalizeFirstLetter(config.name)}/${key}`
  );
  const imgListStr = JSON.stringify(imgListWithPrefix).replace(/"/g, '\\"');

  return new Promise((resolve, reject) => {
    fs.writeFile(
      filePath,
      `{
  "${config.catalog}_${capitalizeFirstLetter(config.name)}": {
    "imgList": "${imgListStr}",
    "jsList": "[]"
  }
}
`,
      "utf8",
      function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      }
    );
  });
};

// 写入配置文件
const writeConfig = async (config, filePath) => {
  const configObj = `export const config = {
}`;
  const info = `export const info = \`
${config.info || ""}
\``;
  const ossLink = `export const ossLink = \`
${config.url || ""}
\``;
  const jenkinsLink = `export const jenkinsLink = \`
${config.textUrl || ""}
\``;

  const content = `${configObj}
${info}
${ossLink}
${jenkinsLink}
`;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, "utf8", function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

// 创建活动文件
const createFile = async (config) => {
  try {
    console.log("开始创建活动文件:", config);

    // 创建目录结构
    const baseDir = path.resolve(__dirname, "../../../activity-vite/src/page");
    const catalogDir = path.join(baseDir, config.catalog);
    const activityDir = path.join(
      catalogDir,
      capitalizeFirstLetter(config.name)
    );

    // 确保目录存在
    if (!fs.existsSync(catalogDir)) {
      fs.mkdirSync(catalogDir, { recursive: true });
    }
    if (!fs.existsSync(activityDir)) {
      fs.mkdirSync(activityDir, { recursive: true });
    }

    // 写入配置文件
    const configPath = path.join(activityDir, "config.js");
    await writeConfig(config, configPath);

    // 写入预加载配置
    const preloadPath = path.join(activityDir, "preload.js");
    await writePreloadConfig(config, preloadPath);

    // 写入活动URL配置
    await prependToJsonFileConfig(config);

    console.log("活动文件创建成功");
    return { success: true, message: "活动文件创建成功" };
  } catch (error) {
    console.error("创建活动文件失败:", error);
    return { success: false, message: error.message };
  }
};

// 复制目录中的所有文件包括子目录
async function copy(src, dst) {
  return new Promise((resolve, reject) => {
    fs.readdir(src, function (err, paths) {
      if (err) {
        reject(err);
        return;
      }

      let completed = 0;
      const total = paths.length;

      if (total === 0) {
        resolve();
        return;
      }

      paths.forEach(function (path) {
        const _src = src + "/" + path;
        const _dst = dst + "/" + path;

        if (path == "public_mixin.scss") {
          // 跳过，会在writeScss中处理
          completed++;
          if (completed === total) resolve();
        } else if (path == "config.ts") {
          // 跳过，会在writeProjectConfig中处理
          completed++;
          if (completed === total) resolve();
        } else if (path == "preload.json") {
          // 跳过，会在writeJSON中处理
          completed++;
          if (completed === total) resolve();
        } else {
          stat(_src, function (err, st) {
            if (err) {
              reject(err);
              return;
            }

            if (st.isFile()) {
              const readable = fs.createReadStream(_src);
              const writable = fs.createWriteStream(_dst);
              readable.pipe(writable);
              writable.on("finish", () => {
                completed++;
                if (completed === total) resolve();
              });
              writable.on("error", reject);
            } else if (st.isDirectory()) {
              createDir(_src, _dst)
                .then(() => {
                  completed++;
                  if (completed === total) resolve();
                })
                .catch(reject);
            }
          });
        }
      });
    });
  });
}

// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
function exist(src, dst) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dst)) {
      fs.rm(dst, { recursive: true }, function (err) {
        if (err) {
          reject(err);
          return;
        }
        createDir(src, dst).then(resolve).catch(reject);
      });
    } else {
      createDir(src, dst).then(resolve).catch(reject);
    }
  });
}

function createDir(src, dst) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dst, function (err) {
      if (err) {
        reject(err);
        return;
      }
      copy(src, dst).then(resolve).catch(reject);
    });
  });
}

// 写入JSON配置
const writeJSON = (config) => {
  const urlMap = getUrlMap();

  return writePreloadConfig(
    config,
    path.resolve(
      __dirname,
      `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
        config.name
      )}/preload.json`
    )
  );
};

// 写入项目配置
const writeProjectConfig = (config) => {
  const urlMap = getUrlMap();

  writeConfig(
    config,
    path.resolve(
      __dirname,
      `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
        config.name
      )}/config.ts`
    )
  );

  // 写入op配置
  if (config.op == "1") {
    for (let i = 1; i <= config.opNum; i++) {
      writeConfig(
        config,
        path.resolve(
          __dirname,
          `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
            config.name
          )}_op${config.opNum == 1 ? "" : i}/config.ts`
        )
      );
    }
  }

  // 写入hot配置
  if (config.hot == "1") {
    writeConfig(
      config,
      path.resolve(
        __dirname,
        `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
          config.name
        )}_op_hot/config.ts`
      )
    );
  }
};

// 写入SCSS样式
const writeScss = (config) => {
  const urlMap = getUrlMap();

  writeMixinScss(
    config,
    path.resolve(
      __dirname,
      `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
        config.name
      )}/scss/public_mixin.scss`
    )
  );

  // 写入op配置
  if (config.op == "1") {
    for (let i = 1; i <= config.opNum; i++) {
      writeMixinScss(
        config,
        path.resolve(
          __dirname,
          `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
            config.name
          )}_op${config.opNum == 1 ? "" : i}/scss/public_mixin.scss`
        )
      );
    }
  }

  // 写入hot配置
  if (config.hot == "1") {
    writeMixinScss(
      config,
      path.resolve(
        __dirname,
        `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
          config.name
        )}_op_hot/scss/public_mixin.scss`
      )
    );
  }
};

// 写入Mixin SCSS
const writeMixinScss = (config, filePath) => {
  const YohoOrHiyooPath = "//image.hoko.media/activity";
  const SoulStarPath = "//static-test.maidocha.com/activity";

  const content = `$projectName: '${config.catalog}_${capitalizeFirstLetter(config.name)}';
@mixin bg($imgName, $isImport: false, $w: 100%, $h: 100%, $x:0, $y:0, $repeat: no-repeat) {
  background-image: url('${
    config.projectName == "SoulStar" ? SoulStarPath : YohoOrHiyooPath
  }/#{$projectName}/#{$imgName}.png') if($isImport,
  !important,
  null);
  background-size: $w $h;
  background-repeat: $repeat;
  background-position: $x $y;
}`;

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, "utf8", function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

// 修改打包路径
const modifyPackPath = async (config) => {
  try {
    const urlMap = getUrlMap();
    const basePath = path.resolve(
      __dirname,
      `${urlMap[config.projectName]}/config/base.js`
    );
    const data = await fsp.readFile(basePath, "utf8");
    const modifiedContent = data.replace(
      /includeProject: \[.*?\]/,
      `includeProject: [/${config.catalog}\\/${config.name}/]`
    );
    await fsp.writeFile(basePath, modifiedContent, "utf8");
    return { success: true, message: "包路径修改成功" };
  } catch (err) {
    console.error("修改包路径失败:", err);
    return { success: false, message: err.message };
  }
};

// 完整的创建文件功能
const createFileComplete = async (config) => {
  let configs = config;

  try {
    const urlMap = getUrlMap();
    const templateUrl = getTemplateUrl();

    // 确保目录存在
    const catalogPath = path.resolve(
      __dirname,
      `${urlMap[config.projectName]}/src/page/${config.catalog}`
    );
    if (!fs.existsSync(catalogPath)) {
      fs.mkdirSync(catalogPath, { recursive: true });
    }

    // 复制活动模板
    await exist(
      path.resolve(__dirname, templateUrl, "activity"),
      path.resolve(
        __dirname,
        `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
          config.name
        )}`
      )
    );

    // 复制op模板
    if (config.op == "1") {
      for (let i = 1; i <= config.opNum; i++) {
        await exist(
          path.resolve(__dirname, templateUrl, "activity_op"),
          path.resolve(
            __dirname,
            `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
              config.name
            )}_op${config.opNum == 1 ? "" : i}`
          )
        );
      }
    }

    // 复制hot模板
    if (config.hot == "1") {
      await exist(
        path.resolve(__dirname, templateUrl, "activity_op_hot"),
        path.resolve(
          __dirname,
          `${urlMap[config.projectName]}/src/page/${config.catalog}/${capitalizeFirstLetter(
            config.name
          )}_op_hot`
        )
      );
    }

    // 写入配置文件 - 在所有模板复制完成后写入
    writeProjectConfig(config);
    writeScss(config);
    writeJSON(config);

    // 修改打包路径
    if (config.projectName == "Yoho") {
      await modifyPackPath(config);
    }

    console.info(`${config.projectName} 活动创建成功！`);

    // 写入活动链接
    await prependToJsonFileConfig(config);

    return { success: true, message: `${config.projectName} 活动创建成功！` };
  } catch (error) {
    console.error("创建活动文件失败:", error);
    console.error("错误堆栈:", error.stack);
    console.error("错误类型:", error.constructor.name);
    console.error("错误消息:", error.message);
    return { success: false, message: error.message };
  }
};

// 发送文案到服务器
const sendText = async (data, projectName) => {
  try {
    const url =
      projectName == "Hiyoo"
        ? "https://dashboard-test.chatchill.media/activity-platform/api/activity/developer/platform/activity/data/configActivityCopyWriting"
        : "https://dashboard-test.waka.media/activity-platform/api/activity/developer/platform/activity/data/configActivityCopyWriting";

    const axios = require("axios");
    const response = await axios.post(url, data);
    const result = response.data.data?.status;

    return { success: result === 1, code: result };
  } catch (error) {
    console.error("发送文案失败:", error);
    return { success: false, code: 0, error: error.message };
  }
};

// 执行Python脚本获取活动时间
const executeActivityTimeScript = async (config) => {
  try {
    // 尝试多种路径解析方式
    let scriptPath, venvPath, projectRoot;

    // 智能路径查找：基于项目根目录特征
    const findProjectRoot = () => {
      let currentPath = process.cwd();
      const maxDepth = 15; // 增加查找深度

      console.log(`开始查找项目根目录，当前路径: ${currentPath}`);

      for (let i = 0; i < maxDepth; i++) {
        console.log(`第${i + 1}层查找: ${currentPath}`);

        // 检查当前路径是否包含项目特征文件
        const hasEventDir = fs.existsSync(path.join(currentPath, "event"));
        const hasActivityViteDir = fs.existsSync(
          path.join(currentPath, "activity-vite")
        );
        const hasExtensionDir = fs.existsSync(
          path.join(currentPath, "extension")
        );

        console.log(`  - event目录: ${hasEventDir ? "存在" : "不存在"}`);
        console.log(
          `  - activity-vite目录: ${hasActivityViteDir ? "存在" : "不存在"}`
        );
        console.log(
          `  - extension目录: ${hasExtensionDir ? "存在" : "不存在"}`
        );

        // 放宽条件：只要有event目录就认为是项目根目录
        if (hasEventDir) {
          console.log(`找到项目根目录: ${currentPath}`);
          return currentPath;
        }

        const parentPath = path.dirname(currentPath);
        if (parentPath === currentPath) {
          console.log(`已到达根目录，停止查找`);
          break; // 已经到达根目录
        }
        currentPath = parentPath;
      }

      console.log(`未找到项目根目录`);
      return null;
    };

    let foundProjectRoot = findProjectRoot();
    let foundEventPath = null;

    if (foundProjectRoot) {
      foundEventPath = path.join(foundProjectRoot, "event");
      console.log(`使用智能查找结果: ${foundEventPath}`);
    } else {
      console.log(`智能查找失败，使用备用路径查找`);
    }

    // 备用路径查找（如果智能查找失败）
    const possiblePaths = [
      foundEventPath,
      path.resolve(__dirname, "../../../event"),
      path.resolve(__dirname, "../../../../event"),
      path.resolve(__dirname, "../../../../../event"),
      path.resolve(__dirname, "../../../../../../event"),
      path.resolve(__dirname, "../../../../../../../event"),
      path.resolve(__dirname, "../../../../../../../../event"),
      path.resolve(__dirname, "../../../../../../../../../event"),
      path.resolve(process.cwd(), "event"),
      path.resolve(process.cwd(), "../event"),
      path.resolve(process.cwd(), "../../event"),
      path.resolve(process.cwd(), "../../../event"),
      path.resolve(process.cwd(), "../../../../event"),
      path.resolve(process.cwd(), "../../../../../event"),
      path.resolve(process.cwd(), "../../../../../../event"),
      // 针对打包后的环境，从应用目录向上查找
      path.resolve(process.cwd(), "../../../../../../../event"),
      path.resolve(process.cwd(), "../../../../../../../../event"),
      path.resolve(process.cwd(), "../../../../../../../../../event"),
      path.resolve(process.cwd(), "../../../../../../../../../../event"),
      path.resolve(process.cwd(), "../../../../../../../../../../../event"),
      // 添加绝对路径查找（基于已知的项目路径）
      "/Users/stone/Desktop/work/yoho-activity-h5/event",
      "/Users/stone/Desktop/work/yoho-activity-h5/extension/event",
      "/Users/stone/Desktop/work/yoho-activity-h5/activity-vite/event",
    ];

    console.log(`当前工作目录: ${process.cwd()}`);
    console.log(`脚本目录: ${__dirname}`);

    let eventPath = null;
    for (let i = 0; i < possiblePaths.length; i++) {
      const possiblePath = possiblePaths[i];
      console.log(
        `尝试路径 ${i + 1}: ${possiblePath} - ${fs.existsSync(possiblePath) ? "EXISTS" : "NOT FOUND"}`
      );
      if (fs.existsSync(possiblePath)) {
        eventPath = possiblePath;
        console.log(`找到event目录: ${eventPath}`);
        break;
      }
    }

    if (!eventPath) {
      console.error(`=== 路径查找失败详细信息 ===`);
      console.error(`当前工作目录: ${process.cwd()}`);
      console.error(`脚本目录: ${__dirname}`);
      console.error(`智能查找结果: ${foundProjectRoot || "失败"}`);
      console.error(`尝试的路径数量: ${possiblePaths.length}`);
      console.error(`所有尝试的路径:`);
      possiblePaths.forEach((p, i) => {
        console.error(
          `  ${i + 1}: ${p} - ${fs.existsSync(p) ? "EXISTS" : "NOT FOUND"}`
        );
      });
      console.error(`=== 路径查找失败详细信息结束 ===`);
      throw new Error(
        `无法找到event目录，请确保event目录存在于项目根目录中。当前工作目录: ${process.cwd()}`
      );
    }

    scriptPath = path.resolve(
      eventPath,
      config.projectName == "Yoho"
        ? "getActivityTime.py"
        : "getActivityTimeChatchill.py"
    );

    venvPath = path.resolve(eventPath, "myenv");
    projectRoot = path.dirname(eventPath);

    console.log(`项目根目录: ${projectRoot}`);
    console.log(`Python脚本路径: ${scriptPath}`);
    console.log(`虚拟环境路径: ${venvPath}`);

    // 检查路径是否存在
    if (!fs.existsSync(scriptPath)) {
      console.error(`Python脚本不存在: ${scriptPath}`);
      console.error(`event目录路径: ${eventPath}`);
      throw new Error(
        `Python脚本不存在: ${path.basename(scriptPath)}，请确保脚本文件存在于event目录中`
      );
    }

    if (!fs.existsSync(venvPath)) {
      console.error(`虚拟环境不存在: ${venvPath}`);
      throw new Error(`Python虚拟环境不存在，请确保myenv目录存在于event目录中`);
    }

    const isWindows = process.platform === "win32";
    let command;

    if (isWindows) {
      command = `cd "${projectRoot}" && "${venvPath}\\Scripts\\activate.bat" && python "${scriptPath}" ${config.id}`;
    } else {
      const pythonPath = path.join(venvPath, "bin", "python3");
      command = `cd "${projectRoot}" && "${pythonPath}" "${scriptPath}" ${config.id}`;
    }

    console.log(`执行命令: ${command}`);

    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024,
    });

    console.log("Python脚本执行完成");

    let jsonString = "";
    let result = "";
    let activityDesc = "";

    try {
      const lines = stdout.split("\n");
      if (lines.length > 1 && lines[1].trim().startsWith("[")) {
        jsonString = lines[1];
      } else if (lines[0].trim().startsWith("[")) {
        jsonString = lines[0];
      } else {
        jsonString = stdout.trim();
      }

      const array = JSON.parse(jsonString);
      result =
        array
          .map((item) => `${item.area}: ${item.startTime}至${item.endTime}`)
          .join("，") +
        `，后端: ${array[0].operator.replace("@micous.com", "")}`;
      activityDesc = array[0]?.activityDesc || "";
    } catch (e) {
      console.error("解析Python输出失败:", e);
      result = "";
    }

    console.info({
      需求名称: activityDesc,
      活动名称: config.name,
      "活动 id": config.id,
      各地区活动时间: result,
    });

    return { success: true, time: result, activityDesc };
  } catch (error) {
    console.error("执行活动时间脚本失败:", error);
    return { success: false, error: error.message };
  }
};

// 执行Python脚本添加活动文案
const executeAddActivityScript = async (data) => {
  try {
    const scriptPath = path.resolve(
      __dirname,
      "../../../event/add_activity.py"
    );
    const venvPath = path.resolve(__dirname, "../../../event/myenv");
    const projectRoot = path.resolve(__dirname, "../../../");

    console.log(`项目根目录: ${projectRoot}`);
    console.log(`Python脚本路径: ${scriptPath}`);
    console.log(`虚拟环境路径: ${venvPath}`);

    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Python脚本不存在: ${scriptPath}`);
    }

    if (!fs.existsSync(venvPath)) {
      throw new Error(`虚拟环境不存在: ${venvPath}`);
    }

    const isWindows = process.platform === "win32";
    let command;

    if (isWindows) {
      command = `cd "${projectRoot}" && "${venvPath}\\Scripts\\activate.bat" && python "${scriptPath}" ${data.id} "${data.name}" "${data.textUrl}"`;
    } else {
      const pythonPath = path.join(venvPath, "bin", "python3");
      command = `cd "${projectRoot}" && "${pythonPath}" "${scriptPath}" ${data.id} "${data.name}" "${data.textUrl}"`;
    }

    console.log(`执行命令: ${command}`);

    const { stdout, stderr } = await execPromise(command, {
      maxBuffer: 1024 * 1024,
    });

    console.log("Python脚本执行完成");
    console.log("标准输出:", stdout);

    if (stderr && !stderr.includes("WARNING:")) {
      console.error("标准错误:", stderr);
      return { success: false, error: stderr };
    }

    const success =
      stdout.includes("成功添加活动") && stdout.includes("文案上传完成");

    return { success, result: stdout };
  } catch (error) {
    console.error("执行添加活动脚本失败:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  getCurrentGitBranch,
  createFile,
  createFileComplete,
  modifyPackPath,
  sendText,
  executeActivityTimeScript,
  executeAddActivityScript,
  writeProjectConfig,
  writeScss,
  writeJSON,
};
