const { app, BrowserWindow, ipcMain, dialog, clipboard } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");

let mainWindow;

function createWindow() {
  //当app准备好后，执行createWindow创建窗口
  mainWindow = new BrowserWindow({
    width: 900, //窗口宽度
    height: 700, //窗口高度
    autoHideMenuBar: true, //自动隐藏菜单档
    alwaysOnTop: false, //置顶
    webPreferences: {
      //在main.js中定义preload.js为桥梁
      preload: path.resolve(__dirname, "./preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWindow.loadFile("./pages/index/index.html");
}

// IPC 处理程序
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
    title: "选择要处理的文件夹",
  });

  return {
    canceled: result.canceled,
    filePath: result.canceled ? null : result.filePaths[0],
  };
});

// 文件选择处理程序
ipcMain.handle("select-file", async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    title: options.title || "选择文件",
    filters: options.filters || [{ name: "All Files", extensions: ["*"] }],
  });

  return {
    canceled: result.canceled,
    filePath: result.canceled ? null : result.filePaths[0],
  };
});

// 文件读取处理程序
ipcMain.handle("read-file", async (event, filePath) => {
  try {
    const fs = require("fs");
    const fileBuffer = fs.readFileSync(filePath);
    return Array.from(fileBuffer); // 转换为数组以便传输
  } catch (error) {
    throw new Error(`读取文件失败: ${error.message}`);
  }
});

// 全局变量来跟踪当前进程
let currentChildProcess = null;

// 导入创建活动功能
const createActivity = require("./scripts/createActivity");

// 导入文件夹监听功能
const { folderWatcher } = require("./scripts/watchFolder");

ipcMain.handle(
  "process-images",
  async (event, folderPath, namingMode, options = {}) => {
    try {
      // 发送开始处理的消息
      mainWindow.webContents.send("processing-log", {
        message: "开始处理图片...",
        type: "info",
      });

      // 直接在主进程中执行处理逻辑，不使用子进程
      const { processImages } = require("./scripts/handleImage.js");

      // 显示启动消息
      console.log("🚀 启动图片处理工具...");
      console.log("✅ 使用原生 Node.js 模块，无需额外依赖\n");

      // 执行处理
      await processImages(folderPath, namingMode, options);

      // 发送完成事件
      mainWindow.webContents.send("processing-complete", {
        message: "处理完成",
      });

      return { success: true };
    } catch (error) {
      mainWindow.webContents.send("processing-error", {
        message: error.message,
      });
      throw error;
    }
  }
);

// 加载导航组件处理程序
ipcMain.handle("load-navigation", async (event, currentPage) => {
  try {
    const fs = require("fs");
    const path = require("path");

    // 获取正确的文件路径（兼容开发和生产环境）
    let navHtmlPath, navCssPath;
    if (app.isPackaged) {
      // 打包后的路径 - 使用 asar 路径
      navHtmlPath = path.join(__dirname, "pages", "shared", "nav.html");
      navCssPath = path.join(__dirname, "pages", "shared", "nav.css");
    } else {
      // 开发环境路径
      navHtmlPath = path.join(__dirname, "pages", "shared", "nav.html");
      navCssPath = path.join(__dirname, "pages", "shared", "nav.css");
    }

    const navHtml = fs.readFileSync(navHtmlPath, "utf8");
    const navCss = fs.readFileSync(navCssPath, "utf8");

    // 根据当前页面调整链接路径和active状态
    let processedHtml = navHtml;

    if (currentPage === "handleImg") {
      // 在handleImg页面
      processedHtml = processedHtml.replace(
        'href="../handleImg/handleImg.html"',
        'href="./handleImg.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../handleReward/handleReward.html"',
        'href="../handleReward/handleReward.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../activityUrl/activityUrl.html"',
        'href="../activityUrl/activityUrl.html"'
      );
    } else if (currentPage === "handleReward") {
      // 在handleReward页面
      processedHtml = processedHtml.replace(
        'href="../handleImg/handleImg.html"',
        'href="../handleImg/handleImg.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../handleReward/handleReward.html"',
        'href="./handleReward.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../activityUrl/activityUrl.html"',
        'href="../activityUrl/activityUrl.html"'
      );
    } else if (currentPage === "activityUrl") {
      // 在activityUrl页面
      processedHtml = processedHtml.replace(
        'href="../handleImg/handleImg.html"',
        'href="../handleImg/handleImg.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../handleReward/handleReward.html"',
        'href="../handleReward/handleReward.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../activityUrl/activityUrl.html"',
        'href="./activityUrl.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../createActivity/createActivity.html"',
        'href="../createActivity/createActivity.html"'
      );
    } else if (currentPage === "createActivity") {
      // 在createActivity页面
      processedHtml = processedHtml.replace(
        'href="../handleImg/handleImg.html"',
        'href="../handleImg/handleImg.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../handleReward/handleReward.html"',
        'href="../handleReward/handleReward.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../activityUrl/activityUrl.html"',
        'href="../activityUrl/activityUrl.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../createActivity/createActivity.html"',
        'href="./createActivity.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../watchFolder/watchFolder.html"',
        'href="../watchFolder/watchFolder.html"'
      );
    } else if (currentPage === "watchFolder") {
      // 在watchFolder页面
      processedHtml = processedHtml.replace(
        'href="../handleImg/handleImg.html"',
        'href="../handleImg/handleImg.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../handleReward/handleReward.html"',
        'href="../handleReward/handleReward.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../activityUrl/activityUrl.html"',
        'href="../activityUrl/activityUrl.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../createActivity/createActivity.html"',
        'href="../createActivity/createActivity.html"'
      );
      processedHtml = processedHtml.replace(
        'href="../watchFolder/watchFolder.html"',
        'href="./watchFolder.html"'
      );
    }

    if (currentPage) {
      // 1) 清理已有 active
      processedHtml = processedHtml
        .replace(/class=\"nav-link active\"/g, 'class="nav-link"')
        .replace(/class=\'nav-link active\'/g, "class='nav-link'");

      // 2) 为含有对应 data-page 的链接追加 active（处理两种属性顺序）
      // 情况A：class 在前，data-page 在后
      const regexA = new RegExp(
        '(class=\"nav-link\")(\\s+[^>]*data-page=\"' + currentPage + '\"[^>]*)',
        "g"
      );
      processedHtml = processedHtml.replace(
        regexA,
        'class="nav-link active"$2'
      );

      // 情况B：data-page 在前，class 在后
      const regexB = new RegExp(
        '(data-page=\"' + currentPage + '\"[^>]*\\s+class=\")nav-link(\")',
        "g"
      );
      processedHtml = processedHtml.replace(regexB, "$1nav-link active$2");
    }

    return {
      success: true,
      html: processedHtml,
      css: navCss,
    };
  } catch (error) {
    console.error("Load navigation error:", error);
    throw error;
  }
});

// 生成配置处理程序
ipcMain.handle("generate-config", async (event, folderPath) => {
  try {
    // 获取正确的脚本路径（兼容开发和生产环境）
    let scriptPath;
    if (app.isPackaged) {
      // 打包后的环境，需要将脚本复制到临时目录
      const fs = require("fs");
      const os = require("os");
      const tempDir = path.join(os.tmpdir(), "electron-app-scripts");

      // 确保临时目录存在
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      // 复制脚本到临时目录
      const sourceScript = path.join(__dirname, "scripts", "handleReward.js");
      scriptPath = path.join(tempDir, "handleReward.js");

      if (!fs.existsSync(scriptPath)) {
        fs.copyFileSync(sourceScript, scriptPath);
      }
    } else {
      // 开发环境路径
      scriptPath = path.join(__dirname, "scripts", "handleReward.js");
    }

    // 检查脚本文件是否存在
    const fs = require("fs");
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`脚本文件不存在: ${scriptPath}`);
    }

    // 导入handleReward.js模块
    const { generateImageConfig } = require(scriptPath);

    // 生成配置
    const config = generateImageConfig(folderPath);

    // 保存到文件
    const configPath = path.join(folderPath, "imageConfig.json");
    require("fs").writeFileSync(configPath, JSON.stringify(config, null, 2));

    // 复制到剪贴板
    const configText = JSON.stringify(config, null, 2);
    clipboard.writeText(configText);

    return {
      success: true,
      config: config,
      configPath: configPath,
    };
  } catch (error) {
    console.error("Generate config error:", error);
    throw error;
  }
});

// 复制到剪贴板处理程序
ipcMain.handle("copy-to-clipboard", async (event, text) => {
  try {
    clipboard.writeText(text);
    return { success: true };
  } catch (error) {
    console.error("Copy to clipboard error:", error);
    throw error;
  }
});

// 获取活动信息处理程序
ipcMain.handle("get-activity-info", async (event) => {
  try {
    const branch = await createActivity.getCurrentGitBranch();
    return {
      data: {
        code: 200,
        branch: branch,
      },
    };
  } catch (error) {
    console.error("Get activity info error:", error);
    throw error;
  }
});

// 提交活动处理程序
ipcMain.handle("submit-activity", async (event, data) => {
  try {
    // 执行活动时间脚本
    const timeResult = await createActivity.executeActivityTimeScript(data);
    if (!timeResult.success) {
      return { data: { code: 0, message: timeResult.error } };
    }

    // 创建活动文件
    const fileResult = await createActivity.createFileComplete({
      ...data,
      time: timeResult.time,
      activityDesc: timeResult.activityDesc,
    });

    if (!fileResult.success) {
      return { data: { code: 0, message: fileResult.message } };
    }

    return { data: { code: 1, message: "活动创建成功" } };
  } catch (error) {
    console.error("Submit activity error:", error);
    return { data: { code: 0, message: error.message } };
  }
});

// 上传活动文案处理程序
ipcMain.handle("upload-activity-text", async (event, data) => {
  try {
    const result = await createActivity.executeAddActivityScript(data);
    if (result.success) {
      return {
        data: { code: 1, message: "文案上传成功", result: result.result },
      };
    } else {
      return { data: { code: 0, message: result.error } };
    }
  } catch (error) {
    console.error("Upload activity text error:", error);
    return { data: { code: 0, message: error.message } };
  }
});

// 更新活动基础信息处理程序
ipcMain.handle("update-activity-base", async (event, data) => {
  try {
    const result = await createActivity.modifyPackPath(data);
    return { data: { code: result.success ? 1 : 0, message: result.message } };
  } catch (error) {
    console.error("Update activity base error:", error);
    return { data: { code: 0, message: error.message } };
  }
});

// 发送活动文案处理程序
ipcMain.handle("send-activity-text", async (event, data) => {
  try {
    console.log("发送文案数据:", data);
    const result = await createActivity.sendText(data, data.projectName);
    console.log("发送文案结果:", result);
    return {
      data: {
        code: result.code,
        message: result.success ? "发送成功" : result.error,
      },
    };
  } catch (error) {
    console.error("Send activity text error:", error);
    return { data: { code: 0, message: error.message } };
  }
});

// 开始监听文件夹处理程序
ipcMain.handle(
  "start-watch-folder",
  async (event, folderPath, namingMode, options = {}) => {
    try {
      // 设置回调函数
      const callbacks = {
        onFileChange: (data) => {
          mainWindow.webContents.send("file-change", data);
        },
        onImageProcessStart: (data) => {
          mainWindow.webContents.send("image-process-start", data);
        },
        onImageProcessComplete: (data) => {
          mainWindow.webContents.send("image-process-complete", data);
        },
        onImageProcessError: (data) => {
          mainWindow.webContents.send("image-process-error", data);
        },
        onWatchError: (error) => {
          mainWindow.webContents.send("watch-error", { error: error.message });
        },
        onWatchStop: () => {
          mainWindow.webContents.send("watch-stop", {});
        },
      };

      // 开始监听
      // 将扁平化开关透传到 watcher 内部处理流程
      // 这里通过设置命名模式字符串扩展不合适，直接把 options 交给 watcher 在处理图片时使用
      folderWatcher.startWatching(folderPath, namingMode, callbacks, options);

      return { success: true };
    } catch (error) {
      console.error("Start watch folder error:", error);
      throw error;
    }
  }
);

// 停止监听文件夹处理程序
ipcMain.handle("stop-watch-folder", async (event) => {
  try {
    folderWatcher.stopWatching();
    return { success: true };
  } catch (error) {
    console.error("Stop watch folder error:", error);
    throw error;
  }
});

app.on("ready", () => {
  createWindow();

  //兼容核心代码 1
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 应用退出时清理进程
app.on("before-quit", () => {
  if (currentChildProcess && !currentChildProcess.killed) {
    currentChildProcess.kill("SIGTERM");
  }
});

//兼容核心代码 2
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
