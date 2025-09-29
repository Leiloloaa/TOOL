// search.js - 搜索功能实现

// 搜索功能类
class ActivitySearch {
  constructor() {
    this.searchInput = document.getElementById("search-input");
    this.searchBtn = document.getElementById("search-btn");
    this.clearSearchBtn = document.getElementById("clear-search-btn");
    this.searchResults = document.getElementById("search-results");
    this.searchResultsContent = document.getElementById(
      "search-results-content"
    );
    this.searchCount = document.getElementById("search-count");
    this.closeSearchResults = document.getElementById("close-search-results");

    this.allData = null;
    this.searchTimeout = null;

    this.init();
  }

  init() {
    // 绑定事件监听器
    this.searchInput.addEventListener(
      "input",
      this.handleSearchInput.bind(this)
    );
    this.searchInput.addEventListener(
      "keypress",
      this.handleKeyPress.bind(this)
    );
    this.searchBtn.addEventListener("click", this.performSearch.bind(this));
    this.clearSearchBtn.addEventListener("click", this.clearSearch.bind(this));
    this.closeSearchResults.addEventListener(
      "click",
      this.closeResults.bind(this)
    );

    // 监听数据加载完成
    this.waitForData();
  }

  // 等待数据加载完成
  waitForData() {
    const checkData = () => {
      if (window._allActivityData) {
        this.allData = window._allActivityData;
        console.log("搜索功能已初始化，数据已加载");
      } else {
        setTimeout(checkData, 100);
      }
    };
    checkData();
  }

  // 处理搜索输入
  handleSearchInput() {
    const query = this.searchInput.value.trim();

    // 显示/隐藏清除按钮
    this.clearSearchBtn.style.display = query ? "flex" : "none";

    // 防抖搜索
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (query.length >= 2) {
      this.searchTimeout = setTimeout(() => {
        this.performSearch();
      }, 300);
    } else if (query.length === 0) {
      this.closeResults();
    }
  }

  // 处理键盘事件
  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.performSearch();
    } else if (event.key === "Escape") {
      this.clearSearch();
    }
  }

  // 执行搜索
  performSearch() {
    const query = this.searchInput.value.trim();

    if (!query || query.length < 2) {
      this.showMessage("请输入至少2个字符进行搜索");
      return;
    }

    if (!this.allData) {
      this.showMessage("数据正在加载中，请稍后再试");
      return;
    }

    const results = this.searchData(query);
    this.displayResults(results, query);
  }

  // 搜索数据
  searchData(query) {
    const results = [];
    const searchQuery = query.toLowerCase();

    // 搜索常规活动数据
    if (this.allData.data1) {
      Object.keys(this.allData.data1).forEach((key) => {
        const item = this.allData.data1[key];
        const matchScore = this.calculateMatchScore(item, searchQuery, key);

        if (matchScore > 0) {
          results.push({
            key,
            item,
            score: matchScore,
            type: "regular",
          });
        }
      });
    }

    // 搜索常驻活动数据
    if (this.allData.data2) {
      Object.keys(this.allData.data2).forEach((key) => {
        const item = this.allData.data2[key];
        const matchScore = this.calculateMatchScore(item, searchQuery, key);

        if (matchScore > 0) {
          results.push({
            key,
            item,
            score: matchScore,
            type: "general",
          });
        }
      });
    }

    // 按匹配度排序
    results.sort((a, b) => b.score - a.score);

    return results;
  }

  // 计算匹配度
  calculateMatchScore(item, searchQuery, key) {
    let score = 0;

    // 搜索字段权重配置
    const searchFields = [
      { field: "活动名称", weight: 10 },
      { field: "活动ID", weight: 8 },
      { field: "活动链接", weight: 6 },
      { field: "预热时间", weight: 4 },
    ];

    // 搜索key本身
    if (key.toLowerCase().includes(searchQuery)) {
      score += 12;
    }

    // 搜索各个字段
    searchFields.forEach(({ field, weight }) => {
      const value = item[field];
      if (value && typeof value === "string") {
        const lowerValue = value.toLowerCase();

        // 精确匹配
        if (lowerValue === searchQuery) {
          score += weight * 3;
        }
        // 包含匹配
        else if (lowerValue.includes(searchQuery)) {
          score += weight * 2;
        }
        // 部分匹配（按字符）
        else {
          const queryChars = searchQuery.split("");
          const matchCount = queryChars.filter((char) =>
            lowerValue.includes(char)
          ).length;
          if (matchCount > 0) {
            score += (matchCount / queryChars.length) * weight;
          }
        }
      }
    });

    return score;
  }

  // 显示搜索结果
  displayResults(results, query) {
    if (results.length === 0) {
      this.showMessage(`未找到包含"${query}"的活动`);
      return;
    }

    this.searchCount.textContent = `(${results.length})`;

    const resultsHtml = results
      .map((result) => {
        return this.generateResultHtml(result, query);
      })
      .join("");

    this.searchResultsContent.innerHTML = resultsHtml;
    this.searchResults.style.display = "block";

    // 为搜索结果中的按钮添加事件监听器
    this.addResultButtonListeners(results);
  }

  // 生成搜索结果HTML
  generateResultHtml(result, query) {
    const { key, item, type } = result;
    const highlightedKey = this.highlightText(key, query);
    const highlightedName = item["活动名称"]
      ? this.highlightText(item["活动名称"], query)
      : "";
    const highlightedId = item["活动ID"]
      ? this.highlightText(item["活动ID"], query)
      : "";
    const highlightedLink = item["活动链接"]
      ? this.highlightText(item["活动链接"], query)
      : "";

    return `
      <div class="search-result-item">
        <div class="search-result-title">
          ${highlightedKey}${highlightedName ? ` - ${highlightedName}` : ""}
          <span style="font-size: 0.8rem; color: #888; margin-left: 0.5rem;">
            (${type === "regular" ? "常规活动" : "常驻活动"})
          </span>
        </div>
        <div class="search-result-info">
          ${item["活动ID"] ? `活动ID: ${highlightedId} | ` : ""}
          ${item["预热时间"] ? `预热时间: ${item["预热时间"]} | ` : ""}
          活动链接: ${highlightedLink}
        </div>
        <div class="search-result-actions">
          <button class="sub-btn ${this.getGroupClass(
            key
          )}" data-action="eg" data-key="${key}">EG</button>
          ${
            !key.includes("SoulStar")
              ? `<button class="sub-btn ${this.getGroupClass(
                  key
                )}" data-action="tr" data-key="${key}">TR</button>`
              : ""
          }
          ${
            key.includes("Yoho")
              ? `
            <button class="sub-btn ${this.getGroupClass(
              key
            )}" data-action="tw" data-key="${key}">TW</button>
            <button class="sub-btn ${this.getGroupClass(
              key
            )}" data-action="in" data-key="${key}">IN</button>
            <button class="sub-btn ${this.getGroupClass(
              key
            )}" data-action="id" data-key="${key}">ID</button>
            <button class="sub-btn ${this.getGroupClass(
              key
            )}" data-action="vn" data-key="${key}">VN</button>
          `
              : ""
          }
          <button class="sub-btn ${this.getGroupClass(
            key
          )}" data-action="test" data-key="${key}">测试环境</button>
          <button class="sub-btn ${this.getGroupClass(
            key
          )}" data-action="doc" data-key="${key}">需求文档</button>
          <button class="sub-btn ${this.getGroupClass(
            key
          )}" data-action="text" data-key="${key}">文案链接</button>
          <button class="sub-btn ${this.getGroupClass(
            key
          )}" data-action="design" data-key="${key}">设计链接</button>
          ${
            !key.includes("SoulStar")
              ? `<button class="sub-btn ${this.getGroupClass(
                  key
                )}" data-action="oss" data-key="${key}">OSS链接</button>`
              : ""
          }
        </div>
      </div>
    `;
  }

  // 高亮匹配文本
  highlightText(text, query) {
    if (!text || !query) return text;

    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  // 获取分组样式类
  getGroupClass(key) {
    if (/yoho/i.test(key)) return "group-btn-yoho";
    if (/hiyoo/i.test(key)) return "group-btn-hiyoo";
    if (/soulstar/i.test(key)) return "group-btn-soulstar";
    return "group-btn-all";
  }

  // 为搜索结果按钮添加事件监听器
  addResultButtonListeners(results) {
    const buttons = this.searchResultsContent.querySelectorAll("[data-action]");

    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        const key = e.target.dataset.key;
        const result = results.find((r) => r.key === key);

        if (result) {
          this.handleResultAction(action, result);
        }
      });
    });
  }

  // 处理搜索结果按钮动作
  handleResultAction(action, result) {
    const { key, item } = result;
    const keys = window.keys;
    const hiyoo_keys = window.hiyoo_keys;
    const soulstar_keys = window.soulstar_keys;
    const OSS_URLS = window.OSS_URLS;
    const test_key = window.test_key;

    const openLink = (url) => {
      window.open(url?.replace("-test", ""), "_blank");
    };

    switch (action) {
      case "eg":
        openLink(
          `${item["活动链接"]}?lang=EG&key=${
            key.includes("Hiyoo")
              ? hiyoo_keys.EG
              : key.includes("SoulStar")
                ? soulstar_keys.EG
                : keys.EG
          }`
        );
        break;
      case "tr":
        if (!key.includes("SoulStar")) {
          openLink(
            `${item["活动链接"]}?lang=TR&key=${
              key.includes("Hiyoo") ? hiyoo_keys.TR : keys.TR
            }`
          );
        }
        break;
      case "tw":
        if (key.includes("Yoho")) {
          openLink(`${item["活动链接"]}?lang=TW&key=${keys.TW}`);
        }
        break;
      case "in":
        if (key.includes("Yoho")) {
          openLink(`${item["活动链接"]}?lang=IN&key=${keys.IN}`);
        }
        break;
      case "id":
        if (key.includes("Yoho")) {
          openLink(`${item["活动链接"]}?lang=ID&key=${keys.ID}`);
        }
        break;
      case "vn":
        if (key.includes("Yoho")) {
          openLink(`${item["活动链接"]}?lang=VN&key=${keys.VN}`);
        }
        break;
      case "test":
        window.open(
          `${item["活动链接"].replace("h5", "h5-test")}?lang=EG&key=${
            key.includes("Hiyoo") ? test_key.hiyoo : test_key.default
          }`,
          "_blank"
        );
        break;
      case "doc":
        openLink(`${item["需求文档"]}`);
        break;
      case "text":
        openLink(`${item["文案链接"]}`);
        break;
      case "design":
        openLink(`${item["设计链接"]}`);
        break;
      case "oss":
        if (!key.includes("SoulStar")) {
          const parts = key.split("_");
          let ossKey = key;
          if (parts.length >= 2) {
            ossKey = parts.slice(1).join("_");
          }
          const isSoulstar = /soulstar/i.test(key);
          const ossUrl =
            (isSoulstar ? OSS_URLS.soulstar : OSS_URLS.default) +
            `${ossKey}%2F`;
          window.open(ossUrl, "_blank");
        }
        break;
    }
  }

  // 显示消息
  showMessage(message) {
    this.searchCount.textContent = "(0)";
    this.searchResultsContent.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666; font-style: italic;">
        ${message}
      </div>
    `;
    this.searchResults.style.display = "block";
  }

  // 清除搜索
  clearSearch() {
    this.searchInput.value = "";
    this.clearSearchBtn.style.display = "none";
    this.closeResults();
  }

  // 关闭搜索结果
  closeResults() {
    this.searchResults.style.display = "none";
    this.searchInput.focus();
  }
}

// 页面加载完成后初始化搜索功能
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ActivitySearch();
  });
} else {
  new ActivitySearch();
}
