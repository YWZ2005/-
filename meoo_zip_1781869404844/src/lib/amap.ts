/**
 * 高德地图API服务模块
 *
 * 使用前请设置环境变量：VITE_AMAP_KEY=你的高德Web服务Key
 * 或在下方 AMAP_KEY 处直接填入Key（仅开发调试用）
 */

// ⚠️ 在此处填入你的高德Web服务Key，或通过环境变量 VITE_AMAP_KEY 注入
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || "";

/**
 * 从景点信息中提取特色标签
 */
function extractFeatureTags(
  name: string,
  type: string,
  province: string,
  city: string
): string[] {
  const tags: string[] = [];
  const nameLower = name.toLowerCase();

  // 从名称提取景点类型特征
  const featureMap: Record<string, string[]> = {
    "山": ["山", "峰", "岭", "岳", "岩", "崖"],
    "水": ["湖", "海", "江", "河", "潭", "溪", "泉", "瀑", "池"],
    "寺": ["寺", "庙", "庵", "院", "宫", "观", "阁", "殿"],
    "园": ["园", "林", "苑", "圃"],
    "塔": ["塔", "阁", "楼"],
    "城": ["城", "堡", "关", "寨", "镇", "村", "庄"],
    "岛": ["岛", "屿", "礁", "滩"],
    "洞": ["洞", "穴", "窟"],
    "陵": ["陵", "墓", "坟", "冢"],
  };

  for (const [category, keywords] of Object.entries(featureMap)) {
    if (keywords.some((k) => nameLower.includes(k))) {
      tags.push(category);
      break; // 只取第一个匹配的类型
    }
  }

  // 从type提取细分类型（过滤掉通用词）
  const typeTags = (type || "")
    .split(";")
    .filter((t) => t && !t.includes("风景名胜") && t !== "旅游景点" && t !== "国家" && t !== "省级")
    .filter((t) => !tags.includes(t)) // 避免重复
    .slice(0, 1); // 只取一个

  tags.push(...typeTags);

  // 添加地域标签（省或市）
  if (province && province !== city) {
    tags.push(province.replace(/省|市|自治区|壮族|回族|维吾尔/g, ""));
  }
  if (city && city !== province) {
    tags.push(city.replace(/市|地区|自治州/g, ""));
  }

  return tags.slice(0, 3); // 最多3个标签
}

/**
 * 逆地理编码：经纬度 → 省/市/区
 */
export async function reverseGeocode(lat: number, lng: number): Promise<{
  province: string;
  city: string;
  district: string;
} | null> {
  if (!AMAP_KEY) {
    console.warn("[高德] 未配置 VITE_AMAP_KEY，跳过逆地理编码");
    return null;
  }

  try {
    const resp = await fetch(
      `https://restapi.amap.com/v3/geocode/regeo?key=${AMAP_KEY}&location=${lng},${lat}&extensions=base`
    );
    const data = await resp.json();

    if (data.status === "1" && data.regeocode) {
      const addr = data.regeocode.addressComponent;
      return {
        province: addr.province || "",
        city: Array.isArray(addr.city) ? "" : addr.city || "",
        district: addr.district || "",
      };
    }
    return null;
  } catch (err) {
    console.error("[高德] 逆地理编码失败:", err);
    return null;
  }
}

export interface AmapPoi {
  name: string;
  lat: number;
  lng: number;
  district: string;
  city: string;
  province: string;
  tags: string[];
  imgUrl?: string;
  desc: string;
}

/**
 * POI搜索：根据关键词和范围获取景点数据
 * @param keyword 搜索关键词，如"景点"
 * @param options 筛选选项
 */
export async function searchPoi(
  keyword: string,
  options: {
    location?: { lat: number; lng: number };
    radius?: number;       // 单位：米
    city?: string;         // 城市名称或adcode
    page?: number;
    pageSize?: number;
  } = {}
): Promise<AmapPoi[]> {
  if (!AMAP_KEY) {
    console.warn("[高德] 未配置 VITE_AMAP_KEY，POI搜索返回空");
    return [];
  }

  // 全国/省份搜索时随机取一页，增加结果多样性
  const isRandomPage = !options.location && !options.radius;
  const randomPage = isRandomPage ? Math.floor(Math.random() * 5) + 1 : 1; // 随机1-5页

  const params = new URLSearchParams({
    key: AMAP_KEY,
    keywords: keyword,
    types: "110000|110100|110200", // 风景名胜大类
    offset: String(options.pageSize || 25),
    page: String(options.page || randomPage),
    extensions: "all",
    output: "json",
  });

  if (options.location) {
    params.set("location", `${options.location.lng},${options.location.lat}`);
  }
  if (options.radius) {
    params.set("radius", String(options.radius));
  }
  if (options.city) {
    params.set("city", options.city);
  }

  try {
    const resp = await fetch(`https://restapi.amap.com/v3/place/text?${params.toString()}`);
    const data = await resp.json();

    if (data.status === "1" && data.pois) {
      return data.pois.map((poi: Record<string, unknown>) => {
        const [lng, lat] = (poi.location as string).split(",").map(Number);
        const photos = poi.photos as Array<{ url: string }> | undefined;
        return {
          name: poi.name as string,
          lat,
          lng,
          district: (poi.adname as string) || "",
          city: (poi.cityname as string) || "",
          province: (poi.pname as string) || "",
          tags: extractFeatureTags(
            poi.name as string,
            poi.type as string,
            poi.pname as string,
            poi.cityname as string
          ),
          imgUrl: photos?.[0]?.url || undefined,
          desc: (poi.biz_ext as Record<string, string>)?.rating
            ? `评分 ${(poi.biz_ext as Record<string, string>).rating} · ${poi.address || ""}`
            : (poi.address as string) || "",
        };
      });
    }
    return [];
  } catch (err) {
    console.error("[高德] POI搜索失败:", err);
    return [];
  }
}

/**
 * 检查Key是否已配置
 */
export function isAmapConfigured(): boolean {
  return !!AMAP_KEY;
}
