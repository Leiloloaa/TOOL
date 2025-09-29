// activityUrl.js - 活动链接管理功能

// 配置信息
window.test_key = {
  hiyoo: "0b7d195fd0481822dbe7f6f45d38979503bf8323440f125e1f2813e3bb49e3cb",
  default: "9eacd5b467fccca9605e8269da1e0fa677ea62d37900857bccaa3742368f1fe2",
};

window.keys = {
  EG: "29782af4e18d059995ec1b43cb8f6d423c981b3782abb61f7d53718e697ab309",
  TW: "21689e971b1d799899ffc7c7fa49f2bd5a83f2465448150c5bd020b7994d48ff",
  ID: "0e96a3e2431f3a0c28d5bc698aef8ba8ed1af56356b1b18f4f26900a6e8e51a2",
  IN: "1cf2eb0c9e5694c24c1147453058805b64471555c5a779ae763fda3c96ab0a8c",
  TR: "87e9da083bd0412579ba505d982e66e7b5af5d74fb8225d779ab06e0e5d24c99",
  VN: "aed15ceae4b4874b73199994334cd418b0bcfda56634355d462a18b98f81a265",
};

window.hiyoo_keys = {
  EG: "95fb84323d2ca102ebebeb59d9ee253d6d5ac660710a480c6863350d7aff9e09",
  TR: "a0525e8ab11388f9da97bb05d4a2e34b67cab92258389ea17b70f8888b4485ed",
};

window.soulstar_keys = {
  EG: "a760f05666beffdebf51d35495ddff5ad90c06b9d0264a47170e168ff4effbe826010ad82ca4a196d833ac233a89c6fb",
};

window.OSS_URLS = {
  soulstar:
    "https://oss.console.aliyun.com/bucket/oss-ap-southeast-1/maidocha-client-file-test/object/upload?path=activity%2F",
  default:
    "https://oss.console.aliyun.com/bucket/oss-ap-southeast-1/yoho-activity-www/object/upload?path=activity%2F",
};

const buttonConfigs = [
  {
    label: "test jenkins",
    href: "https://jenkins-web.micoplatform.com/job/yoho/job/TestEnv/job/web-activity/job/activity-vite/build?delay=0sec",
    gradient: "linear-gradient(to right, #4facfe, #00f2fe)",
    group: "yoho",
  },
  {
    label: "master jenkins",
    href: "https://jenkins-web.micoplatform.com/job/yoho/job/ProdEnv/job/web-activity/job/activity-vite/build?delay=0sec",
    gradient: "linear-gradient(to right, #4facfe, #00f2fe)",
    group: "yoho",
  },
  {
    label: "hiyoo test jenkins",
    href: "https://jenkins-web.micoplatform.com/job/hiyoo/job/TestEnv/job/web-activity/job/activity-vite/build?delay=0sec",
    gradient: "linear-gradient(to right, #fa709a, #fee140)",
    group: "hiyoo",
  },
  {
    label: "hiyoo master jenkins",
    href: "https://jenkins-web.micoplatform.com/job/hiyoo/job/ProdEnv/job/web-activity/job/activity-vite/build?delay=0sec",
    gradient: "linear-gradient(to right, #fa709a, #fee140)",
    group: "hiyoo",
  },
  {
    label: "soulstar test jenkins",
    href: "https://jenkins-web.micoplatform.com/job/soulstar/job/TestEnv/job/web-activity/job/activity-vite/build?delay=0sec",
    gradient: "linear-gradient(to right, #a8edea, #fed6e3)",
    group: "soulstar",
  },
  {
    label: "soulstar master jenkins",
    href: "https://jenkins-web.micoplatform.com/job/soulstar/job/ProdEnv/job/web-activity/job/activity-vite/build?delay=0sec",
    gradient: "linear-gradient(to right, #a8edea, #fed6e3)",
    group: "soulstar",
  },
];

const groupButtonConfigs = [
  {
    label: "Yoho",
    value: "yoho",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    label: "Hiyoo",
    value: "hiyoo",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    label: "SoulStar",
    value: "soulstar",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
];

// 全局变量
let _preloadData1 = null;
let _preloadData2 = null;
let _currentGroup = "all";
let _allActivityData = { data1: {}, data2: {} };

// 获取当前日期和星期几
document.addEventListener("DOMContentLoaded", function () {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const dateObj = new Date();
  const date = dateObj.toLocaleDateString("zh-CN", options).replace(/\//g, "-");

  const weekArr = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const weekStr = weekArr[dateObj.getDay()];

  document.getElementById("current-date").textContent = date + " " + weekStr;
});

// 添加按钮事件监听器
function addButtonListeners(key, item) {
  // 处理按钮点击
  function openLink(url) {
    window.open(url?.replace("-test", ""), "_blank");
  }

  document
    .getElementById(`btn${key}EG`)
    .addEventListener("click", () =>
      openLink(
        `${item["活动链接"]}?lang=EG&key=${
          key.includes("Hiyoo")
            ? window.hiyoo_keys.EG
            : key.includes("SoulStar")
              ? window.soulstar_keys.EG
              : window.keys.EG
        }`
      )
    );

  document
    .getElementById(`btn${key}TEST`)
    .addEventListener("click", () =>
      window.open(
        `${item["活动链接"].replace("h5", "h5-test")}?lang=EG&key=${
          key.includes("Hiyoo")
            ? window.test_key.hiyoo
            : window.test_key.default
        }`,
        "_blank"
      )
    );

  if (!key.includes("SoulStar")) {
    document
      .getElementById(`btn${key}TR`)
      .addEventListener("click", () =>
        openLink(
          `${item["活动链接"]}?lang=TR&key=${
            key.includes("Hiyoo") ? window.hiyoo_keys.TR : window.keys.TR
          }`
        )
      );
  }

  if (key.includes("Yoho")) {
    document
      .getElementById(`btn${key}IN`)
      .addEventListener("click", () =>
        openLink(`${item["活动链接"]}?lang=IN&key=${window.keys.IN}`)
      );
    document
      .getElementById(`btn${key}ID`)
      .addEventListener("click", () =>
        openLink(`${item["活动链接"]}?lang=ID&key=${window.keys.ID}`)
      );
    document
      .getElementById(`btn${key}TW`)
      .addEventListener("click", () =>
        openLink(`${item["活动链接"]}?lang=TW&key=${window.keys.TW}`)
      );
    document
      .getElementById(`btn${key}VN`)
      .addEventListener("click", () =>
        openLink(`${item["活动链接"]}?lang=VN&key=${window.keys.VN}`)
      );
  }

  // 需求文档和设计链接的事件监听器
  document
    .getElementById(`btn${key}toDoc`)
    .addEventListener("click", () => openLink(`${item["需求文档"]}`));
  document
    .getElementById(`btn${key}toText`)
    .addEventListener("click", () => openLink(`${item["文案链接"]}`));
  document
    .getElementById(`btn${key}toDesign`)
    .addEventListener("click", () => openLink(`${item["设计链接"]}`));

  // OSS 链接按钮
  const ossBtn = document.getElementById(`btn${key}Oss`);
  if (ossBtn) {
    ossBtn.addEventListener("click", () => {
      const parts = key.split("_");
      let ossKey = key;
      if (parts.length >= 2) {
        ossKey = parts.slice(1).join("_");
      }
      const isSoulstar = /soulstar/i.test(key);
      const ossUrl =
        (isSoulstar ? window.OSS_URLS.soulstar : window.OSS_URLS.default) +
        `${ossKey}%2F`;
      window.open(ossUrl, "_blank");
    });
  }
}

// 渲染 Jenkins 按钮
function renderJenkinsButtons(filterGroup = "yoho") {
  const btnContainer = document.getElementById("jenkins-buttons");
  if (!btnContainer) {
    console.error("未找到 jenkins-buttons 容器，按钮无法渲染。");
    return;
  }
  btnContainer.innerHTML = "";
  buttonConfigs.forEach((cfg) => {
    if (filterGroup === "all" || cfg.group === filterGroup) {
      const a = document.createElement("a");
      a.href = cfg.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "jenkins-btn";
      a.style.background = cfg.gradient;
      a.style.color = "#fff";
      a.style.height = "3.5rem";
      a.style.fontSize = "1.1rem";
      a.style.display = "flex";
      a.style.alignItems = "center";
      a.style.justifyContent = "center";
      a.style.borderRadius = "5px";
      a.style.border = "none";
      a.style.textDecoration = "none";
      a.style.marginRight = "0.2rem";
      a.style.textAlign = "center";
      a.textContent = cfg.label;
      btnContainer.appendChild(a);
    }
  });
}

// 渲染分组按钮
function renderGroupButtons() {
  const groupFilter = document.getElementById("group-filter");
  if (!groupFilter) return;

  let defaultIdx = groupButtonConfigs.findIndex((cfg) => cfg.value === "yoho");
  if (defaultIdx === -1) defaultIdx = 0;

  groupFilter.innerHTML = groupButtonConfigs
    .map(
      (cfg, idx) =>
        `<button class="group-btn${idx === defaultIdx ? " active" : ""}" data-group="${cfg.value}" style="background:${cfg.gradient};">${cfg.label}</button>`
    )
    .join("");
}

// 渲染分组按钮事件
function renderGroupFilter() {
  renderGroupButtons();
  const groupFilter = document.getElementById("group-filter");
  if (!groupFilter) return;

  groupFilter.addEventListener("click", function (e) {
    if (e.target.tagName === "BUTTON") {
      Array.from(groupFilter.querySelectorAll(".group-btn")).forEach((btn) =>
        btn.classList.remove("active")
      );
      e.target.classList.add("active");
      const group = e.target.getAttribute("data-group");
      renderJenkinsButtons(group);
      filterAndRender(group);
    }
  });
}

// 根据 key 返回分组 class
function getGroupClass(key) {
  if (/yoho/i.test(key)) return "group-btn-yoho";
  if (/hiyoo/i.test(key)) return "group-btn-hiyoo";
  if (/soulstar/i.test(key)) return "group-btn-soulstar";
  return "group-btn-all";
}

// 生成 HTML 内容
function generateHtmlContent(key, item, preheatTimeStyle, containerId) {
  const isActive = preheatTimeStyle.includes("color:#f40");
  const statusClass = isActive ? "status-active" : "status-inactive";

  return `
    <div class="activity-item">
      <h3 style="${preheatTimeStyle}">
        <span class="status-indicator ${statusClass}"></span>
        ${key}${item["活动名称"] ? `，${item["活动名称"]}` : ""}
      </h3>
      ${
        containerId !== "activity-links-general"
          ? `<div class="activity-time">
        <div class="time-info">
          <span class="time-label">时间：</span>
          <span>${item["预热时间"]} ${
            item["活动ID"] ? `，活动ID：${item["活动ID"]}` : ""
          }</span>
        </div>
      </div>`
          : ""
      }
      <div class="activity-links">
        <div class="link-info">
          <span class="link-text">链接：</span>
          <span>${item["活动链接"]
            ?.replace("-test", "")
            ?.replace("?lang=EG&key=", "")}</span>
        </div>
        <div class="link-buttons">
          <button class="sub-btn ${getGroupClass(key)}" id="btn${key}EG">EG</button>
          ${
            !key.includes("SoulStar")
              ? `<button class="sub-btn ${getGroupClass(key)}" id="btn${key}TR">TR</button>`
              : ""
          }
          ${
            key.includes("Yoho")
              ? `
            <button class="sub-btn ${getGroupClass(key)}" id="btn${key}TW">TW</button>
            <button class="sub-btn ${getGroupClass(key)}" id="btn${key}IN">IN</button>
            <button class="sub-btn ${getGroupClass(key)}" id="btn${key}ID">ID</button>
            <button class="sub-btn ${getGroupClass(key)}" id="btn${key}VN">VN</button>`
              : ""
          }
          <button class="sub-btn ${getGroupClass(key)}" id="btn${key}TEST">测试环境</button>
        </div>
      </div>
      <div class="activity-actions">
        <span class="action-label">需求文档:</span>
        <button class="sub-btn ${getGroupClass(key)}" id="btn${key}toDoc">文档</button>
        <span class="action-label">文案链接:</span>
        <button class="sub-btn ${getGroupClass(key)}" id="btn${key}toText">文案</button>
        <span class="action-label">设计链接:</span>
        <button class="sub-btn ${getGroupClass(key)}" id="btn${key}toDesign">设计</button>
        <span class="action-label">阿里云 OSS:</span>
        <button class="sub-btn ${getGroupClass(key)}" id="btn${key}Oss">OSS</button>
      </div>
    </div>
  `;
}

// 更新活动计数
function updateActivityCounts(data1Count = 0, data2Count = 0) {
  const countSpan1 = document.getElementById("activity-links-count");
  const countSpan2 = document.getElementById("activity-links-general-count");

  if (countSpan1) countSpan1.textContent = `(${data1Count})`;
  if (countSpan2) countSpan2.textContent = `(${data2Count})`;
}

// 分组筛选并渲染
function filterAndRender(group) {
  document.getElementById("activity-links").innerHTML = "";
  document.getElementById("activity-links-general").innerHTML = "";

  const data1 = _allActivityData?.data1 || {};
  const data2 = _allActivityData?.data2 || {};

  const filterFn = (key) => {
    if (group === "all") return true;
    return key.toLowerCase().includes(group);
  };

  let validCount = 0;
  let data1DisplayCount = 0;
  const data1Keys = Object.keys(data1);

  // 排序
  data1Keys.sort((a, b) => {
    const aTime = data1[a]["预热时间"];
    const aMatch = aTime && aTime.match(/\d{4}-\d{2}-\d{2}/g);
    const aMinDate = aMatch ? new Date(aMatch[0]) : new Date(0);

    const bTime = data1[b]["预热时间"];
    const bMatch = bTime && bTime.match(/\d{4}-\d{2}-\d{2}/g);
    const bMinDate = bMatch ? new Date(bMatch[0]) : new Date(0);

    return bMinDate - aMinDate;
  });

  for (const key of data1Keys) {
    if (filterFn(key)) {
      data1DisplayCount++;
      const item = data1[key];
      const currentTime = new Date();
      let formattedMaxDate;
      const dates = item["预热时间"].match(/\d{4}-\d{2}-\d{2}/g);
      if (Array.isArray(dates)) {
        const dateObjects = dates.map((date) => new Date(date));
        const maxDate = new Date(Math.max(...dateObjects));
        formattedMaxDate = maxDate;
      } else {
        formattedMaxDate = new Date(item["预热时间"]);
      }

      function toYMD(date) {
        return (
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          date.getDate().toString().padStart(2, "0")
        );
      }

      const currentYMD = toYMD(currentTime);
      const maxDateYMD = toYMD(formattedMaxDate);

      if (currentYMD <= maxDateYMD) validCount++;

      const preheatTimeStyle = currentYMD <= maxDateYMD ? "color:#f40" : "";
      const htmlContent = generateHtmlContent(
        key,
        item,
        preheatTimeStyle,
        "activity-links"
      );
      document
        .getElementById("activity-links")
        .insertAdjacentHTML("beforeend", htmlContent);
      addButtonListeners(key, item);
    }
  }

  // data2 同理
  let data2DisplayCount = 0;
  const data2Keys = Object.keys(data2);
  for (const key of data2Keys) {
    if (filterFn(key)) {
      data2DisplayCount++;
      const item = data2[key];
      const htmlContent = generateHtmlContent(
        key,
        item,
        "",
        "activity-links-general"
      );
      document
        .getElementById("activity-links-general")
        .insertAdjacentHTML("beforeend", htmlContent);
      addButtonListeners(key, item);
    }
  }

  updateActivityCounts(data1DisplayCount, data2DisplayCount);

  const validCountSpan = document.getElementById("activity-links-count-valid");
  if (validCountSpan) {
    validCountSpan.textContent = `在线活动数量：${validCount}个`;
  }
}

// 从 URL 获取数据
async function fetchDataFromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("网络响应错误");
  return response.json();
}

// 获取数据
async function fetchData() {
  try {
    const urls = [
      "https://activity-h5-test.yoho.media/act_v_general_preloadPage/activity.json",
      "https://activity-h5-test.yoho.media/act_v_general_preloadPage/general_activity.json",
      "https://activity-h5-test.chatchill.media/activity-vite/act_v_general_preloadPage/activity.json",
      "https://activity-h5-test.chatchill.media/activity-vite/act_v_general_preloadPage/general_activity.json",
    ];

    const [data1, data2, data3, data4] = await Promise.all(
      urls.map((url) => fetchDataFromUrl(url))
    );

    // 合并 data1 和 data3，data2 和 data4
    const mergedData1 = { ...data1, ...data3 };
    const mergedData2 = { ...data2, ...data4 };

    // 保存原始数据
    _allActivityData = { data1: mergedData1, data2: mergedData2 };

    // 默认渲染 yoho 分组
    filterAndRender("yoho");
  } catch (error) {
    document.getElementById("activity-links").textContent =
      "加载数据失败：" + error.message;
  }
}

// 初始化应用
function initializeApp() {
  renderGroupFilter();
  renderJenkinsButtons("yoho");
  fetchData();
}

// 页面加载后初始化
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
