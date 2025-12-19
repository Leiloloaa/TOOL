/**
 * 日历组件
 */

// 当前显示的年月
let currentYear, currentMonth;

/**
 * 获取日期字符串格式
 */
function formatDateKey(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

/**
 * 检查是否为自定义休息日
 */
function isCustomRestDay(year, month, day) {
  if (!settings || !settings.customRestDays) return false;
  const dateKey = formatDateKey(year, month, day);
  return settings.customRestDays.includes(dateKey);
}

/**
 * 切换自定义休息日状态
 */
function toggleCustomRestDay(year, month, day) {
  if (!settings.customRestDays) {
    settings.customRestDays = [];
  }
  const dateKey = formatDateKey(year, month, day);
  const index = settings.customRestDays.indexOf(dateKey);
  if (index === -1) {
    settings.customRestDays.push(dateKey);
  } else {
    settings.customRestDays.splice(index, 1);
  }
  saveSettings();
  renderCalendar();
}

/**
 * 初始化日历
 */
function initCalendar() {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();
  renderCalendar();
}

/**
 * 渲染日历
 */
function renderCalendar() {
  const container = document.getElementById("calendar-content");
  if (!container) return;

  const now = new Date();
  const today = now.getDate();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  // 获取本月第一天是星期几
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  // 获取本月有多少天
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // 获取上个月有多少天
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const monthNames = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];

  let html = `
    <div class="calendar">
      <div class="calendar-header">
        <button class="calendar-nav" id="prev-month">‹</button>
        <span class="calendar-title">${currentYear}年 ${monthNames[currentMonth]}</span>
        <button class="calendar-nav" id="next-month">›</button>
      </div>
      <div class="calendar-weekdays">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
      </div>
      <div class="calendar-days">
  `;

  // 上个月的日期
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const lunar =
      typeof solarToLunar === "function"
        ? solarToLunar(prevYear, prevMonth + 1, day)
        : null;
    const lunarText =
      typeof getLunarDayText === "function" ? getLunarDayText(lunar) : "";
    html += `<span class="calendar-day other-month">
      <span class="day-num">${day}</span>
      <span class="lunar-text">${lunarText}</span>
    </span>`;
  }

  // 本月的日期
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today && currentMonth === todayMonth && currentYear === todayYear;
    const dayOfWeek = (firstDay + day - 1) % 7;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // 获取农历信息
    const lunar =
      typeof solarToLunar === "function"
        ? solarToLunar(currentYear, currentMonth + 1, day)
        : null;
    const lunarText =
      typeof getLunarDayText === "function" ? getLunarDayText(lunar) : "";
    const specialLunar =
      typeof isSpecialLunarDate === "function"
        ? isSpecialLunarDate(lunar)
        : null;

    // 获取节假日信息
    const holidayInfo =
      typeof getHolidayInfo === "function"
        ? getHolidayInfo(currentYear, currentMonth + 1, day)
        : null;

    // 检查自定义休息日
    const isCustomRest = isCustomRestDay(currentYear, currentMonth + 1, day);

    let classes = "calendar-day clickable";
    if (isToday) classes += " today";
    if (specialLunar) classes += " special-lunar";
    if (isCustomRest) {
      classes += " custom-rest";
    } else if (holidayInfo?.type === "holiday") {
      classes += " holiday";
    } else if (holidayInfo?.type === "workday") {
      classes += " workday";
    } else if (isWeekend) {
      classes += " weekend";
    }

    // 生成节假日/调休标记
    let badge = "";
    if (isCustomRest) {
      badge = `<span class="day-badge custom-rest-badge">休</span>`;
    } else if (holidayInfo?.type === "holiday") {
      badge = `<span class="day-badge holiday-badge">休</span>`;
    } else if (holidayInfo?.type === "workday") {
      badge = `<span class="day-badge workday-badge">班</span>`;
    }

    // 构建 title 提示
    let titleText = "";
    if (isCustomRest) {
      titleText = "自定义休息日（点击取消）";
    } else if (specialLunar) {
      titleText = specialLunar.name;
    } else if (holidayInfo) {
      titleText = holidayInfo.name;
    } else {
      titleText = "点击设为休息日";
    }

    html += `<span class="${classes}" data-date="${formatDateKey(
      currentYear,
      currentMonth + 1,
      day
    )}" title="${titleText}">
      <span class="day-num">${day}</span>
      <span class="lunar-text ${
        specialLunar ? "special" : ""
      }">${lunarText}</span>
      ${badge}
    </span>`;
  }

  // 下个月的日期（填充剩余格子）
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const totalCells = firstDay + daysInMonth;
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let day = 1; day <= remainingCells; day++) {
    const lunar =
      typeof solarToLunar === "function"
        ? solarToLunar(nextYear, nextMonth + 1, day)
        : null;
    const lunarText =
      typeof getLunarDayText === "function" ? getLunarDayText(lunar) : "";
    html += `<span class="calendar-day other-month">
      <span class="day-num">${day}</span>
      <span class="lunar-text">${lunarText}</span>
    </span>`;
  }

  html += `
      </div>
    </div>
  `;

  container.innerHTML = html;

  // 绑定导航事件
  document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // 绑定日期点击事件（设置自定义休息日）
  container.querySelectorAll(".calendar-day.clickable").forEach((dayEl) => {
    dayEl.addEventListener("click", (e) => {
      e.stopPropagation();
      const dateStr = dayEl.dataset.date;
      if (dateStr) {
        const [year, month, day] = dateStr.split("-").map(Number);
        toggleCustomRestDay(year, month, day);
      }
    });
  });
}
