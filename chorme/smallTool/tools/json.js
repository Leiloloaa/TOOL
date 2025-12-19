// JSON 美化工具模块

const JSONTool = {
  inputEl: null,
  formatBtn: null,
  minifyBtn: null,
  clearBtn: null,

  init() {
    this.inputEl = document.getElementById("json-input");
    this.formatBtn = document.getElementById("json-format-btn");
    this.minifyBtn = document.getElementById("json-minify-btn");
    this.clearBtn = document.getElementById("json-clear-btn");

    if (!this.inputEl || !this.formatBtn) {
      console.error("JSON 工具元素未找到");
      return;
    }

    this.formatBtn.addEventListener("click", () => this.formatAndOpen());
    if (this.minifyBtn) {
      this.minifyBtn.addEventListener("click", () => this.minify());
    }
    if (this.clearBtn) {
      this.clearBtn.addEventListener("click", () => this.clear());
    }

    // 支持回车快捷键
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.formatAndOpen();
      }
    });
  },

  /**
   * 格式化 JSON 并在新标签页打开
   */
  formatAndOpen() {
    const input = this.inputEl.value.trim();

    if (!input) {
      window.showStatusMessage("请输入 JSON 字符串", "error");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);

      // 创建 HTML 内容
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JSON 格式化结果</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 20px;
      line-height: 1.5;
    }
    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #2d2d2d;
      padding: 10px 20px;
      display: flex;
      gap: 10px;
      z-index: 100;
      border-bottom: 1px solid #404040;
    }
    .toolbar button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      background: #0e639c;
      color: white;
    }
    .toolbar button:hover {
      background: #1177bb;
    }
    pre {
      margin-top: 60px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .string { color: #ce9178; }
    .number { color: #b5cea8; }
    .boolean { color: #569cd6; }
    .null { color: #569cd6; }
    .key { color: #9cdcfe; }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="copyJSON()">复制 JSON</button>
    <button onclick="downloadJSON()">下载 JSON</button>
  </div>
  <pre id="json-content">${this.syntaxHighlight(formatted)}</pre>
  <script>
    const jsonData = ${JSON.stringify(formatted)};
    function copyJSON() {
      navigator.clipboard.writeText(jsonData).then(() => {
        alert('已复制到剪贴板！');
      });
    }
    function downloadJSON() {
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  </script>
</body>
</html>`;

      // 创建 Blob 并在新标签页打开
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      chrome.tabs.create({ url });

      window.showStatusMessage(
        "JSON 格式化成功，已在新标签页打开！",
        "success"
      );
    } catch (error) {
      window.showStatusMessage(`JSON 解析失败: ${error.message}`, "error");
    }
  },

  /**
   * 语法高亮
   */
  syntaxHighlight(json) {
    return json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        (match) => {
          let cls = "number";
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = "key";
            } else {
              cls = "string";
            }
          } else if (/true|false/.test(match)) {
            cls = "boolean";
          } else if (/null/.test(match)) {
            cls = "null";
          }
          return `<span class="${cls}">${match}</span>`;
        }
      );
  },

  /**
   * 压缩 JSON
   */
  minify() {
    const input = this.inputEl.value.trim();

    if (!input) {
      window.showStatusMessage("请输入 JSON 字符串", "error");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      this.inputEl.value = minified;

      // 复制到剪贴板
      navigator.clipboard.writeText(minified).then(() => {
        window.showStatusMessage("JSON 已压缩并复制到剪贴板！", "success");
      });
    } catch (error) {
      window.showStatusMessage(`JSON 解析失败: ${error.message}`, "error");
    }
  },

  /**
   * 清空
   */
  clear() {
    this.inputEl.value = "";
    window.hideStatusMessage();
  },
};

window.JSONTool = JSONTool;


