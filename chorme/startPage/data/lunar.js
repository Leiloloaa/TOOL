/**
 * 农历计算模块
 */

// 农历数据 1900-2100年
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0,
  0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540,
  0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50,
  0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0,
  0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2,
  0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573,
  0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4,
  0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5,
  0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
  0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58,
  0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50,
  0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0,
  0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260,
  0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0,
  0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0,
  0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63, 0x09370,
  0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0,
  0x0a6d0, 0x055d4, 0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50,
  0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, 0x0b273, 0x06930, 0x07337, 0x06aa0,
  0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, 0x0e968, 0x0d520,
  0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,
  0x0d520,
];

// 天干
const TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
// 地支
const DI_ZHI = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];
// 生肖
const SHENG_XIAO = [
  "鼠",
  "牛",
  "虎",
  "兔",
  "龙",
  "蛇",
  "马",
  "羊",
  "猴",
  "鸡",
  "狗",
  "猪",
];
// 农历月份
const LUNAR_MONTH = [
  "正",
  "二",
  "三",
  "四",
  "五",
  "六",
  "七",
  "八",
  "九",
  "十",
  "冬",
  "腊",
];
// 农历日期
const LUNAR_DAY = [
  "初一",
  "初二",
  "初三",
  "初四",
  "初五",
  "初六",
  "初七",
  "初八",
  "初九",
  "初十",
  "十一",
  "十二",
  "十三",
  "十四",
  "十五",
  "十六",
  "十七",
  "十八",
  "十九",
  "二十",
  "廿一",
  "廿二",
  "廿三",
  "廿四",
  "廿五",
  "廿六",
  "廿七",
  "廿八",
  "廿九",
  "三十",
];

/**
 * 获取农历年份的总天数
 */
function getLunarYearDays(year) {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += LUNAR_INFO[year - 1900] & i ? 1 : 0;
  }
  return sum + getLeapDays(year);
}

/**
 * 获取农历年份闰月的天数
 */
function getLeapDays(year) {
  if (getLeapMonth(year)) {
    return LUNAR_INFO[year - 1900] & 0x10000 ? 30 : 29;
  }
  return 0;
}

/**
 * 获取农历年份的闰月月份，没有闰月返回0
 */
function getLeapMonth(year) {
  return LUNAR_INFO[year - 1900] & 0xf;
}

/**
 * 获取农历年份某月的天数
 */
function getLunarMonthDays(year, month) {
  return LUNAR_INFO[year - 1900] & (0x10000 >> month) ? 30 : 29;
}

/**
 * 公历转农历
 */
function solarToLunar(year, month, day) {
  if (year < 1900 || year > 2100) {
    return null;
  }

  let offset = Math.floor(
    (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000
  );

  let lunarYear = 1900;
  let temp = 0;

  for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
    temp = getLunarYearDays(lunarYear);
    offset -= temp;
  }

  if (offset < 0) {
    offset += temp;
    lunarYear--;
  }

  const leapMonth = getLeapMonth(lunarYear);
  let isLeap = false;
  let lunarMonth = 1;

  for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
    if (leapMonth > 0 && lunarMonth === leapMonth + 1 && !isLeap) {
      --lunarMonth;
      isLeap = true;
      temp = getLeapDays(lunarYear);
    } else {
      temp = getLunarMonthDays(lunarYear, lunarMonth);
    }

    if (isLeap && lunarMonth === leapMonth + 1) {
      isLeap = false;
    }

    offset -= temp;
  }

  if (offset === 0 && leapMonth > 0 && lunarMonth === leapMonth + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --lunarMonth;
    }
  }

  if (offset < 0) {
    offset += temp;
    --lunarMonth;
  }

  const lunarDay = offset + 1;

  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    isLeap: isLeap,
    yearCn: getYearCn(lunarYear),
    monthCn: (isLeap ? "闰" : "") + LUNAR_MONTH[lunarMonth - 1] + "月",
    dayCn: LUNAR_DAY[lunarDay - 1],
    animal: SHENG_XIAO[(lunarYear - 4) % 12],
  };
}

/**
 * 获取农历年份的干支纪年
 */
function getYearCn(year) {
  const gan = TIAN_GAN[(year - 4) % 10];
  const zhi = DI_ZHI[(year - 4) % 12];
  return gan + zhi + "年";
}

/**
 * 获取格式化的农历日期字符串
 */
function getLunarDateString(date) {
  const lunar = solarToLunar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  if (!lunar) return "";
  return `${lunar.yearCn} ${lunar.monthCn}${lunar.dayCn} 【${lunar.animal}年】`;
}

/**
 * 特殊农历日期（需要标注的日子）
 * 格式：{ month: 农历月份, day: 农历日期, name: 名称 }
 */
const SPECIAL_LUNAR_DATES = [
  { month: 2, day: 1, name: "二月初一" },
  { month: 4, day: 19, name: "四月十九" },
  { month: 11, day: 26, name: "十一月廿六" },
];

/**
 * 检查是否为特殊农历日期
 * @param {object} lunar - solarToLunar 返回的农历对象
 * @returns {object|null} - 特殊日期信息或 null
 */
function isSpecialLunarDate(lunar) {
  if (!lunar) return null;
  for (const special of SPECIAL_LUNAR_DATES) {
    if (
      lunar.month === special.month &&
      lunar.day === special.day &&
      !lunar.isLeap
    ) {
      return special;
    }
  }
  return null;
}

/**
 * 获取农历日期的简短显示（用于日历）
 * 初一显示月份，其他显示日期
 */
function getLunarDayText(lunar) {
  if (!lunar) return "";
  if (lunar.day === 1) {
    return lunar.monthCn;
  }
  return lunar.dayCn;
}

