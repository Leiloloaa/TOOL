/**
 * 倒计时组件 - 支持多个倒计时
 */

let countdownInterval = null;
let editingCountdownIndex = -1; // 当前编辑的倒计时索引，-1 表示新增模式

/**
 * 初始化倒计时
 */
function initCountdown() {
  // 清除之前的定时器
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  renderCountdown();
  // 每秒更新
  countdownInterval = setInterval(updateAllCountdowns, 1000);
}

/**
 * 渲染倒计时列表
 */
function renderCountdown() {
  const container = document.getElementById("countdown-content");
  if (!container) return;

  // 获取倒计时列表，兼容旧版单个倒计时数据
  let countdowns = settings.countdowns || [];

  // 兼容旧版数据结构
  if (countdowns.length === 0 && settings.countdown) {
    countdowns = [
      {
        id: "default",
        title: settings.countdown.title || "倒计时",
        datetime: settings.countdown.datetime,
      },
    ];
  }

  if (countdowns.length === 0) {
    container.innerHTML = `
      <div class="countdown-empty">
        <p>暂无倒计时</p>
        <p class="countdown-hint">在设置中添加倒计时</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="countdown-list">
      ${countdowns
        .map(
          (item, index) => `
        <div class="countdown-item-wrapper" data-id="${
          item.id || index
        }" data-index="${index}">
          <div class="countdown-header">
            <span class="countdown-title">${item.title || "倒计时"}</span>
            <div class="countdown-actions">
              <button class="countdown-edit" data-index="${index}" title="编辑">✎</button>
              <button class="countdown-delete" data-index="${index}" title="删除">×</button>
            </div>
          </div>
          <div class="countdown-timer">
            <div class="countdown-unit">
              <span class="countdown-value" data-field="days-${index}">00</span>
              <span class="countdown-label">天</span>
            </div>
            <span class="countdown-separator">:</span>
            <div class="countdown-unit">
              <span class="countdown-value" data-field="hours-${index}">00</span>
              <span class="countdown-label">时</span>
            </div>
            <span class="countdown-separator">:</span>
            <div class="countdown-unit">
              <span class="countdown-value" data-field="minutes-${index}">00</span>
              <span class="countdown-label">分</span>
            </div>
            <span class="countdown-separator">:</span>
            <div class="countdown-unit">
              <span class="countdown-value" data-field="seconds-${index}">00</span>
              <span class="countdown-label">秒</span>
            </div>
          </div>
          <div class="countdown-target" data-field="target-${index}"></div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  // 绑定编辑按钮事件
  container.querySelectorAll(".countdown-edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      startEditCountdown(index);
    });
  });

  // 绑定删除按钮事件
  container.querySelectorAll(".countdown-delete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      deleteCountdown(index);
    });
  });

  // 立即更新显示
  updateAllCountdowns();
}

/**
 * 更新所有倒计时显示
 */
function updateAllCountdowns() {
  let countdowns = settings.countdowns || [];

  // 兼容旧版数据结构
  if (countdowns.length === 0 && settings.countdown) {
    countdowns = [
      {
        id: "default",
        title: settings.countdown.title || "倒计时",
        datetime: settings.countdown.datetime,
      },
    ];
  }

  countdowns.forEach((item, index) => {
    updateSingleCountdown(item, index);
  });
}

/**
 * 更新单个倒计时
 */
function updateSingleCountdown(item, index) {
  const datetime = item.datetime;
  if (!datetime) return;

  const targetDate = new Date(datetime);
  const now = new Date();
  const diff = targetDate - now;

  const daysEl = document.querySelector(`[data-field="days-${index}"]`);
  const hoursEl = document.querySelector(`[data-field="hours-${index}"]`);
  const minutesEl = document.querySelector(`[data-field="minutes-${index}"]`);
  const secondsEl = document.querySelector(`[data-field="seconds-${index}"]`);
  const targetEl = document.querySelector(`[data-field="target-${index}"]`);

  if (!daysEl) return;

  // 格式化目标日期显示
  targetEl.textContent = formatCountdownDate(targetDate);

  const wrapper = daysEl.closest(".countdown-item-wrapper");

  if (diff <= 0) {
    // 倒计时结束
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minutesEl.textContent = "00";
    secondsEl.textContent = "00";

    // 添加完成样式
    if (wrapper) {
      wrapper.classList.add("completed");
    }
    return;
  }

  // 移除完成样式
  if (wrapper) {
    wrapper.classList.remove("completed");
  }

  // 计算时间差
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // 直接更新显示，无动画
  daysEl.textContent = String(days).padStart(2, "0");
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");
}

/**
 * 开始编辑倒计时
 */
function startEditCountdown(index) {
  const countdowns = settings.countdowns || [];
  if (index < 0 || index >= countdowns.length) return;

  const item = countdowns[index];
  editingCountdownIndex = index;

  // 打开设置面板
  const settingsPanel = document.getElementById("settings-panel");
  if (settingsPanel) {
    settingsPanel.classList.add("show");
  }

  // 填充表单
  const titleInput = document.getElementById("countdown-title");
  const datetimeInput = document.getElementById("countdown-datetime");
  const submitBtn = document.getElementById("add-countdown");
  const cancelBtn = document.getElementById("cancel-edit-countdown");
  const formLabel = document.getElementById("countdown-form-label");

  if (titleInput) titleInput.value = item.title || "";
  if (datetimeInput) datetimeInput.value = item.datetime || "";

  // 更新标签
  if (formLabel) {
    formLabel.textContent = "编辑倒计时";
  }

  // 切换按钮状态
  if (submitBtn) {
    submitBtn.textContent = "保存";
    submitBtn.classList.add("editing");
  }

  // 显示取消按钮
  if (cancelBtn) {
    cancelBtn.style.display = "inline-block";
  }

  // 更新设置面板中的管理列表高亮
  updateManageListHighlight(index);

  // 滚动到表单并聚焦
  setTimeout(() => {
    if (titleInput) {
      titleInput.scrollIntoView({ behavior: "smooth", block: "center" });
      titleInput.focus();
    }
  }, 100);
}

/**
 * 取消编辑
 */
function cancelEditCountdown() {
  editingCountdownIndex = -1;

  const titleInput = document.getElementById("countdown-title");
  const datetimeInput = document.getElementById("countdown-datetime");
  const submitBtn = document.getElementById("add-countdown");
  const cancelBtn = document.getElementById("cancel-edit-countdown");
  const formLabel = document.getElementById("countdown-form-label");

  // 清空表单
  if (titleInput) titleInput.value = "";
  if (datetimeInput) datetimeInput.value = "";

  // 恢复标签
  if (formLabel) {
    formLabel.textContent = "添加倒计时";
  }

  // 恢复按钮状态
  if (submitBtn) {
    submitBtn.textContent = "添加";
    submitBtn.classList.remove("editing");
  }

  // 隐藏取消按钮
  if (cancelBtn) {
    cancelBtn.style.display = "none";
  }

  // 移除高亮
  updateManageListHighlight(-1);
}

/**
 * 保存倒计时（新增或编辑）
 */
function saveCountdown(title, datetime) {
  if (!settings.countdowns) {
    settings.countdowns = [];
  }

  if (
    editingCountdownIndex >= 0 &&
    editingCountdownIndex < settings.countdowns.length
  ) {
    // 编辑模式
    settings.countdowns[editingCountdownIndex].title = title || "倒计时";
    settings.countdowns[editingCountdownIndex].datetime = datetime;
  } else {
    // 新增模式
    settings.countdowns.push({
      id: Date.now().toString(),
      title: title || "倒计时",
      datetime: datetime,
    });
  }

  saveSettings();
  renderCountdown();

  // 重置编辑状态
  cancelEditCountdown();
}

/**
 * 添加倒计时（兼容旧接口）
 */
function addCountdown(title, datetime) {
  editingCountdownIndex = -1;
  saveCountdown(title, datetime);
}

/**
 * 删除倒计时
 */
function deleteCountdown(index) {
  if (!settings.countdowns) return;

  // 如果正在编辑被删除的项，取消编辑
  if (editingCountdownIndex === index) {
    cancelEditCountdown();
  } else if (editingCountdownIndex > index) {
    // 如果删除的项在编辑项之前，调整索引
    editingCountdownIndex--;
  }

  settings.countdowns.splice(index, 1);
  saveSettings();
  renderCountdown();

  // 更新设置面板中的管理列表
  if (typeof renderCountdownManageList === "function") {
    renderCountdownManageList();
  }
}

/**
 * 更新管理列表高亮
 */
function updateManageListHighlight(index) {
  const manageList = document.getElementById("countdown-manage-list");
  if (!manageList) return;

  manageList.querySelectorAll(".countdown-manage-item").forEach((item, i) => {
    item.classList.toggle("editing", i === index);
  });
}

/**
 * 格式化日期
 */
function formatCountdownDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}
