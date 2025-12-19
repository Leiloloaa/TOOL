/**
 * 壁纸数据库
 * 包含动态视频壁纸和静态图片壁纸
 */
const WALLPAPERS = {
  // 动态视频壁纸 - 使用 Pexels CDN 视频源
  video: [
    {
      id: "v1",
      name: "海浪沙滩",
      thumbnail:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=120&fit=crop",
      url: "https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4",
    },
    {
      id: "v2",
      name: "云层天空",
      thumbnail:
        "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=200&h=120&fit=crop",
      url: "https://videos.pexels.com/video-files/857195/857195-hd_1920_1080_25fps.mp4",
    },
    {
      id: "v3",
      name: "日落余晖",
      thumbnail:
        "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=200&h=120&fit=crop",
      url: "https://videos.pexels.com/video-files/1409899/1409899-hd_1920_1080_25fps.mp4",
    },
    {
      id: "v4",
      name: "星空银河",
      thumbnail:
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&h=120&fit=crop",
      url: "https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_30fps.mp4",
    },
    {
      id: "v5",
      name: "森林阳光",
      thumbnail:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=120&fit=crop",
      url: "https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4",
    },
    {
      id: "v6",
      name: "水面涟漪",
      thumbnail:
        "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=200&h=120&fit=crop",
      url: "https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_24fps.mp4",
    },
  ],

  // 静态图片壁纸 - 使用 Unsplash 高清图片
  image: [
    {
      id: "i1",
      name: "山峰日出",
      thumbnail:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop",
    },
    {
      id: "i2",
      name: "星空银河",
      thumbnail:
        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop",
    },
    {
      id: "i3",
      name: "海边落日",
      thumbnail:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop",
    },
    {
      id: "i4",
      name: "森林小径",
      thumbnail:
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=1080&fit=crop",
    },
    {
      id: "i5",
      name: "雪山倒影",
      thumbnail:
        "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?w=1920&h=1080&fit=crop",
    },
    {
      id: "i6",
      name: "紫色极光",
      thumbnail:
        "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&h=1080&fit=crop",
    },
    {
      id: "i7",
      name: "城市霓虹",
      thumbnail:
        "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&h=1080&fit=crop",
    },
    {
      id: "i8",
      name: "樱花盛开",
      thumbnail:
        "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1920&h=1080&fit=crop",
    },
    {
      id: "i9",
      name: "草原天空",
      thumbnail:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&h=1080&fit=crop",
    },
    {
      id: "i10",
      name: "湖泊晨曦",
      thumbnail:
        "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop",
    },
    {
      id: "i11",
      name: "薰衣草田",
      thumbnail:
        "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1920&h=1080&fit=crop",
    },
    {
      id: "i12",
      name: "抽象几何",
      thumbnail:
        "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=200&h=120&fit=crop",
      url: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1920&h=1080&fit=crop",
    },
  ],
};

/**
 * 获取默认壁纸
 * @param {string} type - 壁纸类型 'video' 或 'image'
 * @returns {object} 默认壁纸对象
 */
function getDefaultWallpaper(type = "video") {
  return WALLPAPERS[type][0];
}

/**
 * 根据ID获取壁纸
 * @param {string} id - 壁纸ID
 * @param {string} type - 壁纸类型
 * @returns {object|null} 壁纸对象
 */
function getWallpaperById(id, type) {
  return WALLPAPERS[type].find((w) => w.id === id) || null;
}

/**
 * 获取所有壁纸
 * @param {string} type - 壁纸类型
 * @returns {array} 壁纸数组
 */
function getAllWallpapers(type) {
  return WALLPAPERS[type] || [];
}
