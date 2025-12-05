// 活动数据JSON数组
const activityData = [
  {
    activityType: 0,
    activityDesc: "【YoHo】10月-双城之战(XM/TR/FR/IN/PK/TW/ID/BD)-特朗",
    activityId: "10641",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202510_clashTwoCities/index.html",
  },
  {
    activityType: 0,
    activityDesc: "【YoHo】8月-土耳其胜利日活动(TR)-悦悦",
    activityId: "10621",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202508_victoryDayTR/index.html",
  },
  {
    activityType: 0,
    activityDesc: "8月-国王之战/Battle Of King",
    activityId: "10625",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202508_battleOfKing/index.html",
  },
  {
    activityType: 0,
    activityDesc: "游戏PK明星",
    activityId: "10620",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202508_gamePKStar/index.html",
  },
  {
    activityType: 0,
    activityDesc: "家族夺旗战争",
    activityId: "10619",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202508_familyFlagWars/index.html",
  },
  {
    activityType: 0,
    activityDesc: "跨越时空的爱（love across time）",
    activityId: "10615",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202507_loveAcrossTime/index.html",
  },
  {
    activityType: 0,
    activityDesc: "土耳其球队公会pk活动",
    activityId: "10614",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202507_footballPk/index.html",
  },
  {
    activityType: 0,
    activityDesc: "骑士与公主",
    activityId: "10613",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202507_knightPrincess/index.html",
  },
  {
    activityType: 0,
    activityDesc: "【YoHo】7月-乘风破浪的夏天(XM/TR/VN/IN/PK/TW/ID/BD)-特朗",
    activityId: "10606",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202506_summerCarnival/index.html",
  },
  {
    activityType: 0,
    activityDesc: "【YoHo】7月-新用户买量承接活动(XM/TR)-阿丸",
    activityId: "10611",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202507_luckyNewStar/index.html",
  },
  {
    activityType: 0,
    activityDesc: "6月-年中盛典2025-互动游戏_云端跳跃",
    activityId: "10595",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202506_midYear2025/index.html",
  },
  {
    activityType: 0,
    activityDesc: "【YoHo】6月-龙情粽意（TW/VN）-悦悦",
    activityId: "10588",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202505_dragonBoat/index.html?lang=EG&key=",
  },
  {
    activityType: 0,
    activityId: "10592",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202505_eid202505/index.html",
  },
  {
    activityType: 0,
    activityId: "10585",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202504_romanticLove/index.html",
  },
  {
    activityType: 0,
    activityId: "10582",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202504_jewelryMerchant/index.html",
  },
  {
    activityType: 0,
    activityId: "10577",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202504_dragonSlayer/index.html",
  },
  {
    activityType: 0,
    activityId: "10572",
    activityUrl:
      "https://activity-h5-test.yoho.media/act_v_202503_trNational25/index.html",
  },
  {
    activityType: 0,
    activityId: "10568",
    activityUrl:
      "https://activity-h5-test.yoho.media/act_v_202503_eidCelebration25/index.html",
  },
  {
    activityType: 0,
    activityId: "10559",
    activityUrl:
      "https://activity-h5-test.yoho.media/act_v_202503_skyscraperChallenge/index.html",
  },
  {
    activityType: 0,
    activityId: "10549",
    activityUrl:
      "https://activity-h5-test.yoho.media/act_v_202502_kingGame/index.html",
  },
  {
    activityType: 0,
    activityId: "10550",
    activityUrl:
      "https://activity-h5-test.yoho.media/act_v_202502_ramadan25/index.html",
  },
  {
    activityType: 0,
    activityId: "10545",
    activityUrl:
      "https://activity-h5-test.yoho.media/act_v_202501_ValentineDay/index.html",
  },
  {
    activityType: 0,
    activityId: "10541",
    activityUrl:
      "https://activity-h5-test.yoho.media/act_v_202501_action007/index.html",
  },
  {
    activityType: 0,
    activityId: "10547",
    activityUrl:
      "https://activity-h5-test.yoho.media/act_v_202501_masqueradeBall/index.html",
  },
  {
    activityType: 0,
    activityDesc: "【Yoho】9月-火箭PK竞速赛（多国）",
    activityId: "10643",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_202509_rocketRace/index.html",
  },
  {
    activityType: 1,
    activityDesc: "【YoHo】9月-沙特国庆节-25年国庆系列-Brian",
    activityId: "10632",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_nationalDay2025/index.html",
  },
  {
    activityType: 1,
    activityDesc: "中东常规月榜",
    activityId: "10123",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_monthList25/index.html",
  },
  {
    activityType: 1,
    activityDesc: "新秒榜",
    activityId: "10425",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_newGiftsRanking/index.html",
  },
  {
    activityType: 1,
    activityDesc: "游戏秒榜",
    activityId: "10425",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_gameRanking/index.html",
  },
  {
    activityType: 1,
    activityDesc: "主播活跃榜",
    activityId: "10602",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_anchorActiveList/index.html",
  },
  {
    activityType: 1,
    activityDesc: "【YoHo】每周CP",
    activityId: "10350",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_weeklyCP/index.html",
  },
  {
    activityType: 1,
    activityDesc: "【YoHo】天天打卡",
    activityId: "10206",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_checkCard/index.html",
  },
  {
    activityType: 1,
    activityDesc: "【YoHo】2025年封神榜",
    activityId: "10599",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_hallOfHonor2025/index.html",
  },
  {
    activityType: 1,
    activityDesc: "【YoHo】新周星",
    activityId: "10639",
    activityUrl:
      "https://activity-h5.yoho.media/act_v_general_weeklyStar25/index.html",
  },
];

// 导出数据
module.exports = activityData;

// 或者使用ES6导出
// export default activityData;
