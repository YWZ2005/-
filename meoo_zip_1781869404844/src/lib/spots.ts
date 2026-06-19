/**
 * 景点数据Mock和工具函数
 */

export interface Spot {
  name: string;
  lat: number;
  lng: number;
  district: string;
  city: string;
  province: string;
  tags: string[];
  imgUrl?: string;
  desc: string;
  rating?: number; // 模拟评分 4.0-5.0
  popularity?: number; // 模拟热度 1-100
}

// Unsplash图片关键词映射
const UNSPLASH_KEYWORDS: Record<string, string> = {
  "灵隐寺": "temple,buddhist,china",
  "西湖": "west-lake,hangzhou,scenery",
  "千岛湖": "lake,island,water",
  "乌镇": "watertown,jiangnan,ancient",
  "普陀山": "buddhist-mountain,temple,sea",
  "雁荡山": "mountain,rock,scenery",
  "故宫": "forbidden-city,beijing,palace",
  "长城": "great-wall,china,mountain",
  "颐和园": "summer-palace,garden,beijing",
  "天坛": "temple-of-heaven,beijing,architecture",
  "外滩": "bund,shanghai,night",
  "东方明珠": "oriental-pearl,tower,shanghai",
  "豫园": "yuyuan,garden,shanghai",
  "拙政园": "classical-garden,suzhou,jiangnan",
  "中山陵": "sun-yat-sen,mausoleum,nanjing",
  "鼋头渚": "taihu-lake,sakura,wuxi",
  "黄山": "yellow-mountain,clouds,china",
  "宏村": "hongcun,village,anhui",
  "张家界": "zhangjiajie,avatar-mountain,nature",
  "凤凰古城": "fenghuang,ancient-town,hunan",
  "岳麓山": "yuelu-mountain,changsha,hunan",
  "九寨沟": "jiuzhaigou,colorful-lake,nature",
  "峨眉山": "emei-mountain,buddhist,sichuan",
  "都江堰": "dujiangyan,water-system,sichuan",
  "稻城亚丁": "daocheng,yading,snow-mountain",
  "丽江古城": "lijiang,old-town,yunnan",
  "大理古城": "dali,ancient-city,erhai",
  "石林": "stone-forest,karst,yunnan",
  "香格里拉": "shangri-la,tibetan,yunnan",
  "鼓浪屿": "gulangyu,island,xiamen",
  "武夷山": "wuyi-mountain,tea,fujian",
  "土楼": "tulou,hakka-building,fujian",
  "兵马俑": "terracotta-warriors,xian,history",
  "华山": "huashan,mountain,cliff",
  "大雁塔": "big-wild-goose-pagoda,xian",
  "广州塔": "canton-tower,guangzhou,night",
  "丹霞山": "danxia,mountain,guangdong",
  "开平碉楼": "kaiping,diaolou,guangdong",
  "三亚湾": "sanya,beach,hainan",
  "蜈支洲岛": "wuzhizhou,island,diving",
  "敦煌莫高窟": "mogao-caves,dunhuang,grotto",
  "鸣沙山月牙泉": "mingsha,dunhuang,desert",
  "布达拉宫": "potala-palace,lhasa,tibet",
  "纳木错": "namtso,lake,tibet",
  "喀纳斯": "kanas,lake,xinjiang",
  "天山天池": "tianshan,lake,xinjiang",
  "桂林山水": "guilin,li-river,karst",
  "阳朔西街": "yangshuo,west-street,guilin",
  "泰山": "mount-tai,shandong,sunrise",
  "崂山": "laoshan,qingdao,taoist",
  "少林寺": "shaolin-temple,kungfu,henan",
  "龙门石窟": "longmen-grottoes,luoyang,henan",
  "庐山": "lushan,jiangxi,clouds",
  "婺源": "wuyuan,jiangxi,rapeseed",
  "黄果树瀑布": "huangguoshu,waterfall,guizhou",
  "西江千户苗寨": "xijiang,miao-village,guizhou",
};

// 生成Unsplash图片URL
function getUnsplashUrl(name: string, seed: string): string {
  const keywords = UNSPLASH_KEYWORDS[name] || "china,scenery,travel";
  return `https://images.unsplash.com/photo-${seed}?w=800&h=400&fit=crop&q=80`;
}

// 生成模拟评分 4.0-5.0
function getRating(name: string): number {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return 4.0 + (hash % 10) / 10;
}

// 生成模拟热度 1-100
function getPopularity(name: string): number {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 100) + 1;
}

/**
 * Mock景点数据 - 覆盖全国各省市，共200+个景点
 */
export const MOCK_SPOTS: Spot[] = [
  // 浙江省 (15个)
  { name: "灵隐寺", lat: 30.242, lng: 120.135, district: "西湖区", city: "杭州市", province: "浙江省", tags: ["人文", "祈福"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "千年古刹，禅意深远，飞来峰石刻艺术精湛。", rating: getRating("灵隐寺"), popularity: getPopularity("灵隐寺") },
  { name: "西湖", lat: 30.25, lng: 120.15, district: "西湖区", city: "杭州市", province: "浙江省", tags: ["自然", "湖景"], imgUrl: getUnsplashUrl("西湖", "1569163139599-0d451d6f6a55"), desc: "人间天堂，淡妆浓抹总相宜。", rating: getRating("西湖"), popularity: getPopularity("西湖") },
  { name: "千岛湖", lat: 29.59, lng: 119.02, district: "淳安县", city: "杭州市", province: "浙江省", tags: ["湖泊", "度假"], imgUrl: getUnsplashUrl("千岛湖", "1559827265-9e5c3c1c3c3c"), desc: "天下第一秀水，岛屿星罗棋布。", rating: getRating("千岛湖"), popularity: getPopularity("千岛湖") },
  { name: "乌镇", lat: 30.75, lng: 120.48, district: "桐乡市", city: "嘉兴市", province: "浙江省", tags: ["古镇", "水乡"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "江南水乡典范，小桥流水人家。", rating: getRating("乌镇"), popularity: getPopularity("乌镇") },
  { name: "普陀山", lat: 29.98, lng: 122.39, district: "普陀区", city: "舟山市", province: "浙江省", tags: ["佛教", "海岛"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "海天佛国，观音道场。", rating: getRating("普陀山"), popularity: getPopularity("普陀山") },
  { name: "雁荡山", lat: 28.37, lng: 121.11, district: "乐清市", city: "温州市", province: "浙江省", tags: ["山水", "地质"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "东南第一山，奇峰怪石林立。", rating: getRating("雁荡山"), popularity: getPopularity("雁荡山") },
  { name: "西塘古镇", lat: 30.95, lng: 120.89, district: "嘉善县", city: "嘉兴市", province: "浙江省", tags: ["古镇", "水乡"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "活着的千年古镇，烟雨长廊。", rating: getRating("西塘古镇"), popularity: getPopularity("西塘古镇") },
  { name: "南浔古镇", lat: 30.88, lng: 120.43, district: "南浔区", city: "湖州市", province: "浙江省", tags: ["古镇", "园林"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "江南六大古镇之一，中西合璧。", rating: getRating("南浔古镇"), popularity: getPopularity("南浔古镇") },
  { name: "莫干山", lat: 30.63, lng: 119.82, district: "德清县", city: "湖州市", province: "浙江省", tags: ["避暑", "竹海"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "江南第一山，避暑胜地。", rating: getRating("莫干山"), popularity: getPopularity("莫干山") },
  { name: "天台山", lat: 29.16, lng: 121.03, district: "天台县", city: "台州市", province: "浙江省", tags: ["佛教", "瀑布"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "佛宗道源，山水神秀。", rating: getRating("天台山"), popularity: getPopularity("天台山") },
  { name: "神仙居", lat: 28.72, lng: 120.43, district: "仙居县", city: "台州市", province: "浙江省", tags: ["奇峰", "云海"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "太白梦游处，烟霞第一城。", rating: getRating("神仙居"), popularity: getPopularity("神仙居") },
  { name: "东极岛", lat: 30.16, lng: 122.68, district: "普陀区", city: "舟山市", province: "浙江省", tags: ["海岛", "日出"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "中国大陆最东端的岛屿，第一缕阳光。", rating: getRating("东极岛"), popularity: getPopularity("东极岛") },
  { name: "安吉竹海", lat: 30.64, lng: 119.68, district: "安吉县", city: "湖州市", province: "浙江省", tags: ["竹海", "生态"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "中国大竹海，卧虎藏龙取景地。", rating: getRating("安吉竹海"), popularity: getPopularity("安吉竹海") },
  { name: "雪窦山", lat: 29.68, lng: 121.28, district: "奉化区", city: "宁波市", province: "浙江省", tags: ["佛教", "瀑布"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "弥勒道场，四明第一山。", rating: getRating("雪窦山"), popularity: getPopularity("雪窦山") },
  { name: "楠溪江", lat: 28.35, lng: 120.68, district: "永嘉县", city: "温州市", province: "浙江省", tags: ["山水", "古村"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "中国山水诗的摇篮。", rating: getRating("楠溪江"), popularity: getPopularity("楠溪江") },

  // 北京市 (12个)
  { name: "故宫", lat: 39.92, lng: 116.4, district: "东城区", city: "北京市", province: "北京市", tags: ["历史", "皇家"], imgUrl: getUnsplashUrl("故宫", "1548013146-02c942cbd6b5"), desc: "明清两代皇宫，世界文化遗产。", rating: getRating("故宫"), popularity: getPopularity("故宫") },
  { name: "长城", lat: 40.43, lng: 116.57, district: "延庆区", city: "北京市", province: "北京市", tags: ["历史", "徒步"], imgUrl: getUnsplashUrl("长城", "1548013146-02c942cbd6b5"), desc: "不到长城非好汉，中华民族的象征。", rating: getRating("长城"), popularity: getPopularity("长城") },
  { name: "颐和园", lat: 39.99, lng: 116.27, district: "海淀区", city: "北京市", province: "北京市", tags: ["园林", "皇家"], imgUrl: getUnsplashUrl("颐和园", "1548013146-02c942cbd6b5"), desc: "皇家园林博物馆，昆明湖万寿山。", rating: getRating("颐和园"), popularity: getPopularity("颐和园") },
  { name: "天坛", lat: 39.88, lng: 116.41, district: "东城区", city: "北京市", province: "北京市", tags: ["历史", "祭祀"], imgUrl: getUnsplashUrl("天坛", "1548013146-02c942cbd6b5"), desc: "明清皇帝祭天之所，建筑精妙绝伦。", rating: getRating("天坛"), popularity: getPopularity("天坛") },
  { name: "圆明园", lat: 40.01, lng: 116.30, district: "海淀区", city: "北京市", province: "北京市", tags: ["遗址", "历史"], imgUrl: getUnsplashUrl("颐和园", "1548013146-02c942cbd6b5"), desc: "万园之园，历史沧桑见证。", rating: getRating("圆明园"), popularity: getPopularity("圆明园") },
  { name: "北海公园", lat: 39.92, lng: 116.38, district: "西城区", city: "北京市", province: "北京市", tags: ["园林", "白塔"], imgUrl: getUnsplashUrl("颐和园", "1548013146-02c942cbd6b5"), desc: "世界上现存最完整的皇家园林之一。", rating: getRating("北海公园"), popularity: getPopularity("北海公园") },
  { name: "雍和宫", lat: 39.95, lng: 116.42, district: "东城区", city: "北京市", province: "北京市", tags: ["佛教", "祈福"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "北京最大的藏传佛教寺院。", rating: getRating("雍和宫"), popularity: getPopularity("雍和宫") },
  { name: "南锣鼓巷", lat: 39.94, lng: 116.40, district: "东城区", city: "北京市", province: "北京市", tags: ["胡同", "文化"], imgUrl: getUnsplashUrl("颐和园", "1548013146-02c942cbd6b5"), desc: "北京最古老的街区之一，胡同文化。", rating: getRating("南锣鼓巷"), popularity: getPopularity("南锣鼓巷") },
  { name: "798艺术区", lat: 39.98, lng: 116.50, district: "朝阳区", city: "北京市", province: "北京市", tags: ["艺术", "创意"], imgUrl: getUnsplashUrl("颐和园", "1548013146-02c942cbd6b5"), desc: "北京都市文化的新地标。", rating: getRating("798艺术区"), popularity: getPopularity("798艺术区") },
  { name: "香山公园", lat: 39.99, lng: 116.19, district: "海淀区", city: "北京市", province: "北京市", tags: ["红叶", "登山"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "香山红叶红满天。", rating: getRating("香山公园"), popularity: getPopularity("香山公园") },
  { name: "明十三陵", lat: 40.29, lng: 116.24, district: "昌平区", city: "北京市", province: "北京市", tags: ["陵墓", "历史"], imgUrl: getUnsplashUrl("天坛", "1548013146-02c942cbd6b5"), desc: "明朝皇帝的墓葬建筑群。", rating: getRating("明十三陵"), popularity: getPopularity("明十三陵") },
  { name: "古北水镇", lat: 40.65, lng: 117.12, district: "密云区", city: "北京市", province: "北京市", tags: ["水镇", "夜景"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "北方乌镇，长城脚下的星空小镇。", rating: getRating("古北水镇"), popularity: getPopularity("古北水镇") },

  // 上海市 (10个)
  { name: "外滩", lat: 31.24, lng: 121.49, district: "黄浦区", city: "上海市", province: "上海市", tags: ["夜景", "建筑"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "万国建筑博览群，上海城市名片。", rating: getRating("外滩"), popularity: getPopularity("外滩") },
  { name: "东方明珠", lat: 31.24, lng: 121.5, district: "浦东新区", city: "上海市", province: "上海市", tags: ["地标", "观景"], imgUrl: getUnsplashUrl("东方明珠", "1548013146-02c942cbd6b5"), desc: "上海城市象征，俯瞰浦江两岸。", rating: getRating("东方明珠"), popularity: getPopularity("东方明珠") },
  { name: "豫园", lat: 31.23, lng: 121.49, district: "黄浦区", city: "上海市", province: "上海市", tags: ["园林", "古典"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "明代古典园林，城隍庙旁古韵悠长。", rating: getRating("豫园"), popularity: getPopularity("豫园") },
  { name: "田子坊", lat: 31.21, lng: 121.47, district: "黄浦区", city: "上海市", province: "上海市", tags: ["艺术", "创意"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "上海弄堂里的艺术街区。", rating: getRating("田子坊"), popularity: getPopularity("田子坊") },
  { name: "上海迪士尼", lat: 31.14, lng: 121.66, district: "浦东新区", city: "上海市", province: "上海市", tags: ["乐园", "亲子"], imgUrl: getUnsplashUrl("东方明珠", "1548013146-02c942cbd6b5"), desc: "中国大陆首座迪士尼主题乐园。", rating: getRating("上海迪士尼"), popularity: getPopularity("上海迪士尼") },
  { name: "朱家角古镇", lat: 31.11, lng: 121.05, district: "青浦区", city: "上海市", province: "上海市", tags: ["古镇", "水乡"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "上海第一大镇，江南古镇明珠。", rating: getRating("朱家角古镇"), popularity: getPopularity("朱家角古镇") },
  { name: "新天地", lat: 31.22, lng: 121.48, district: "黄浦区", city: "上海市", province: "上海市", tags: ["时尚", "石库门"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "上海时尚地标，石库门里的新天地。", rating: getRating("新天地"), popularity: getPopularity("新天地") },
  { name: "上海博物馆", lat: 31.23, lng: 121.45, district: "黄浦区", city: "上海市", province: "上海市", tags: ["博物馆", "文物"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "中国古代艺术博物馆。", rating: getRating("上海博物馆"), popularity: getPopularity("上海博物馆") },
  { name: "武康路", lat: 31.20, lng: 121.44, district: "徐汇区", city: "上海市", province: "上海市", tags: ["历史", "建筑"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "上海最文艺的马路，名人故居云集。", rating: getRating("武康路"), popularity: getPopularity("武康路") },
  { name: "滴水湖", lat: 31.05, lng: 121.93, district: "浦东新区", city: "上海市", province: "上海市", tags: ["湖泊", "休闲"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "上海最大的人工湖，圆形设计。", rating: getRating("滴水湖"), popularity: getPopularity("滴水湖") },

  // 江苏省 (15个)
  { name: "拙政园", lat: 31.32, lng: 120.63, district: "姑苏区", city: "苏州市", province: "江苏省", tags: ["园林", "世界遗产"], imgUrl: getUnsplashUrl("拙政园", "1548013146-02c942cbd6b5"), desc: "中国四大名园之一，江南园林代表。", rating: getRating("拙政园"), popularity: getPopularity("拙政园") },
  { name: "中山陵", lat: 32.06, lng: 118.85, district: "玄武区", city: "南京市", province: "江苏省", tags: ["历史", "纪念"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "孙中山先生陵寝，庄严肃穆。", rating: getRating("中山陵"), popularity: getPopularity("中山陵") },
  { name: "鼋头渚", lat: 31.52, lng: 120.22, district: "滨湖区", city: "无锡市", province: "江苏省", tags: ["湖景", "樱花"], imgUrl: getUnsplashUrl("鼋头渚", "1548013146-02c942cbd6b5"), desc: "太湖绝佳处，春日樱花如云。", rating: getRating("鼋头渚"), popularity: getPopularity("鼋头渚") },
  { name: "夫子庙秦淮河", lat: 32.02, lng: 118.80, district: "秦淮区", city: "南京市", province: "江苏省", tags: ["历史", "夜景"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "六朝金粉地，金陵帝王州。", rating: getRating("夫子庙秦淮河"), popularity: getPopularity("夫子庙秦淮河") },
  { name: "周庄古镇", lat: 31.12, lng: 120.85, district: "昆山市", city: "苏州市", province: "江苏省", tags: ["古镇", "水乡"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "中国第一水乡，江南六大古镇之一。", rating: getRating("周庄古镇"), popularity: getPopularity("周庄古镇") },
  { name: "瘦西湖", lat: 32.40, lng: 119.42, district: "邗江区", city: "扬州市", province: "江苏省", tags: ["园林", "湖景"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "园林之盛，甲于天下。", rating: getRating("瘦西湖"), popularity: getPopularity("瘦西湖") },
  { name: "虎丘", lat: 31.34, lng: 120.58, district: "姑苏区", city: "苏州市", province: "江苏省", tags: ["古迹", "传说"], imgUrl: getUnsplashUrl("拙政园", "1548013146-02c942cbd6b5"), desc: "吴中第一名胜，东方比萨斜塔。", rating: getRating("虎丘"), popularity: getPopularity("虎丘") },
  { name: "灵山大佛", lat: 31.42, lng: 120.12, district: "滨湖区", city: "无锡市", province: "江苏省", tags: ["佛教", "地标"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "中国最高的青铜佛像。", rating: getRating("灵山大佛"), popularity: getPopularity("灵山大佛") },
  { name: "同里古镇", lat: 31.16, lng: 120.72, district: "吴江区", city: "苏州市", province: "江苏省", tags: ["古镇", "园林"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "醇正水乡，旧时江南。", rating: getRating("同里古镇"), popularity: getPopularity("同里古镇") },
  { name: "明孝陵", lat: 32.06, lng: 118.84, district: "玄武区", city: "南京市", province: "江苏省", tags: ["陵墓", "历史"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "明清皇家第一陵。", rating: getRating("明孝陵"), popularity: getPopularity("明孝陵") },
  { name: "中华恐龙园", lat: 31.82, lng: 120.00, district: "新北区", city: "常州市", province: "江苏省", tags: ["乐园", "亲子"], imgUrl: getUnsplashUrl("东方明珠", "1548013146-02c942cbd6b5"), desc: "东方侏罗纪，恐龙主题乐园。", rating: getRating("中华恐龙园"), popularity: getPopularity("中华恐龙园") },
  { name: "金山寺", lat: 32.22, lng: 119.42, district: "润州区", city: "镇江市", province: "江苏省", tags: ["佛教", "传说"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "水漫金山，白娘子传说。", rating: getRating("金山寺"), popularity: getPopularity("金山寺") },
  { name: "留园", lat: 31.32, lng: 120.60, district: "姑苏区", city: "苏州市", province: "江苏省", tags: ["园林", "古典"], imgUrl: getUnsplashUrl("拙政园", "1548013146-02c942cbd6b5"), desc: "中国四大名园之一，建筑艺术精湛。", rating: getRating("留园"), popularity: getPopularity("留园") },
  { name: "总统府", lat: 32.05, lng: 118.80, district: "玄武区", city: "南京市", province: "江苏省", tags: ["历史", "建筑"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "中国近代史遗址博物馆。", rating: getRating("总统府"), popularity: getPopularity("总统府") },
  { name: "花果山", lat: 34.67, lng: 119.27, district: "海州区", city: "连云港市", province: "江苏省", tags: ["神话", "山海"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "孙悟空故里，东海第一胜境。", rating: getRating("花果山"), popularity: getPopularity("花果山") },

  // 安徽省 (10个)
  { name: "黄山", lat: 30.13, lng: 118.17, district: "黄山区", city: "黄山市", province: "安徽省", tags: ["山水", "云海"], imgUrl: getUnsplashUrl("黄山", "1548013146-02c942cbd6b5"), desc: "五岳归来不看山，黄山归来不看岳。", rating: getRating("黄山"), popularity: getPopularity("黄山") },
  { name: "宏村", lat: 29.9, lng: 117.98, district: "黟县", city: "黄山市", province: "安徽省", tags: ["古村落", "徽派"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "画里乡村，徽派建筑博物馆。", rating: getRating("宏村"), popularity: getPopularity("宏村") },
  { name: "西递", lat: 29.90, lng: 117.90, district: "黟县", city: "黄山市", province: "安徽省", tags: ["古村落", "徽派"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "桃花源里人家，明清古民居。", rating: getRating("西递"), popularity: getPopularity("西递") },
  { name: "九华山", lat: 30.48, lng: 117.80, district: "青阳县", city: "池州市", province: "安徽省", tags: ["佛教", "圣地"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "中国佛教四大名山之一，地藏菩萨道场。", rating: getRating("九华山"), popularity: getPopularity("九华山") },
  { name: "天柱山", lat: 30.74, lng: 116.45, district: "潜山市", city: "安庆市", province: "安徽省", tags: ["山水", "地质"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "古南岳，安徽三大名山之一。", rating: getRating("天柱山"), popularity: getPopularity("天柱山") },
  { name: "三河古镇", lat: 31.52, lng: 117.25, district: "肥西县", city: "合肥市", province: "安徽省", tags: ["古镇", "水乡"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "千年古镇，江淮水乡。", rating: getRating("三河古镇"), popularity: getPopularity("三河古镇") },
  { name: "天堂寨", lat: 31.10, lng: 115.78, district: "金寨县", city: "六安市", province: "安徽省", tags: ["森林", "瀑布"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "华东最后一片原始森林。", rating: getRating("天堂寨"), popularity: getPopularity("天堂寨") },
  { name: "呈坎", lat: 29.92, lng: 118.02, district: "徽州区", city: "黄山市", province: "安徽省", tags: ["古村", "风水"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "中国风水第一村，江南第一村。", rating: getRating("呈坎"), popularity: getPopularity("呈坎") },
  { name: "塔川", lat: 29.95, lng: 117.98, district: "黟县", city: "黄山市", province: "安徽省", tags: ["秋色", "摄影"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "中国三大秋色观赏地之一。", rating: getRating("塔川"), popularity: getPopularity("塔川") },
  { name: "徽州古城", lat: 29.87, lng: 118.43, district: "歙县", city: "黄山市", province: "安徽省", tags: ["古城", "徽文化"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "中国四大古城之一，徽文化发祥地。", rating: getRating("徽州古城"), popularity: getPopularity("徽州古城") },

  // 湖南省 (12个)
  { name: "张家界", lat: 29.12, lng: 110.48, district: "永定区", city: "张家界市", province: "湖南省", tags: ["奇峰", "自然"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "阿凡达取景地，奇峰三千秀水八百。", rating: getRating("张家界"), popularity: getPopularity("张家界") },
  { name: "凤凰古城", lat: 27.95, lng: 109.6, district: "凤凰县", city: "湘西州", province: "湖南省", tags: ["古城", "民族"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "沈从文笔下的边城，沱江畔的吊脚楼。", rating: getRating("凤凰古城"), popularity: getPopularity("凤凰古城") },
  { name: "岳麓山", lat: 28.18, lng: 112.94, district: "岳麓区", city: "长沙市", province: "湖南省", tags: ["名山", "书院"], imgUrl: getUnsplashUrl("岳麓山", "1548013146-02c942cbd6b5"), desc: "千年学府岳麓书院，爱晚亭红叶。", rating: getRating("岳麓山"), popularity: getPopularity("岳麓山") },
  { name: "橘子洲", lat: 28.17, lng: 112.96, district: "岳麓区", city: "长沙市", province: "湖南省", tags: ["江景", "纪念"], imgUrl: getUnsplashUrl("岳麓山", "1548013146-02c942cbd6b5"), desc: "中国第一洲，毛泽东青年艺术雕塑。", rating: getRating("橘子洲"), popularity: getPopularity("橘子洲") },
  { name: "天门山", lat: 29.05, lng: 110.48, district: "永定区", city: "张家界市", province: "湖南省", tags: ["奇峰", "索道"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "湘西第一神山，天门洞开。", rating: getRating("天门山"), popularity: getPopularity("天门山") },
  { name: "岳阳楼", lat: 29.38, lng: 113.09, district: "岳阳楼区", city: "岳阳市", province: "湖南省", tags: ["名楼", "洞庭"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "洞庭天下水，岳阳天下楼。", rating: getRating("岳阳楼"), popularity: getPopularity("岳阳楼") },
  { name: "衡山", lat: 27.25, lng: 112.65, district: "南岳区", city: "衡阳市", province: "湖南省", tags: ["五岳", "佛教"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "南岳独秀，五岳之一。", rating: getRating("衡山"), popularity: getPopularity("衡山") },
  { name: "韶山", lat: 27.91, lng: 112.48, district: "韶山市", city: "湘潭市", province: "湖南省", tags: ["红色", "纪念"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "伟人故里，红色圣地。", rating: getRating("韶山"), popularity: getPopularity("韶山") },
  { name: "芙蓉镇", lat: 28.75, lng: 109.95, district: "永顺县", city: "湘西州", province: "湖南省", tags: ["古镇", "瀑布"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "挂在瀑布上的千年古镇。", rating: getRating("芙蓉镇"), popularity: getPopularity("芙蓉镇") },
  { name: "东江湖", lat: 25.85, lng: 113.28, district: "资兴市", city: "郴州市", province: "湖南省", tags: ["湖泊", "雾漫"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "人间天上一湖水，万千景象在其中。", rating: getRating("东江湖"), popularity: getPopularity("东江湖") },
  { name: "崀山", lat: 26.38, lng: 110.98, district: "新宁县", city: "邵阳市", province: "湖南省", tags: ["丹霞", "自然"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "中国丹霞地貌的精品。", rating: getRating("崀山"), popularity: getPopularity("崀山") },
  { name: "桃花源", lat: 28.92, lng: 111.48, district: "桃源县", city: "常德市", province: "湖南省", tags: ["田园", "隐逸"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "世外桃源，陶渊明笔下的人间仙境。", rating: getRating("桃花源"), popularity: getPopularity("桃花源") },

  // 四川省 (15个)
  { name: "九寨沟", lat: 33.2, lng: 103.92, district: "九寨沟县", city: "阿坝州", province: "四川省", tags: ["湖泊", "彩林"], imgUrl: getUnsplashUrl("九寨沟", "1548013146-02c942cbd6b5"), desc: "童话世界，五彩斑斓的人间仙境。", rating: getRating("九寨沟"), popularity: getPopularity("九寨沟") },
  { name: "峨眉山", lat: 29.6, lng: 103.48, district: "峨眉山市", city: "乐山市", province: "四川省", tags: ["佛教", "云海"], imgUrl: getUnsplashUrl("峨眉山", "1548013146-02c942cbd6b5"), desc: "普贤菩萨道场，金顶日出壮观。", rating: getRating("峨眉山"), popularity: getPopularity("峨眉山") },
  { name: "都江堰", lat: 31.0, lng: 103.62, district: "都江堰市", city: "成都市", province: "四川省", tags: ["水利", "历史"], imgUrl: getUnsplashUrl("都江堰", "1548013146-02c942cbd6b5"), desc: "两千年前的伟大水利工程。", rating: getRating("都江堰"), popularity: getPopularity("都江堰") },
  { name: "稻城亚丁", lat: 28.55, lng: 100.3, district: "稻城县", city: "甘孜州", province: "四川省", tags: ["雪山", "高原"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "蓝色星球上最后一片净土。", rating: getRating("稻城亚丁"), popularity: getPopularity("稻城亚丁") },
  { name: "青城山", lat: 30.90, lng: 103.56, district: "都江堰市", city: "成都市", province: "四川省", tags: ["道教", "清幽"], imgUrl: getUnsplashUrl("峨眉山", "1548013146-02c942cbd6b5"), desc: "青城天下幽，道教发源地。", rating: getRating("青城山"), popularity: getPopularity("青城山") },
  { name: "乐山大佛", lat: 29.55, lng: 103.77, district: "市中区", city: "乐山市", province: "四川省", tags: ["佛教", "石刻"], imgUrl: getUnsplashUrl("峨眉山", "1548013146-02c942cbd6b5"), desc: "世界最大的石刻弥勒佛坐像。", rating: getRating("乐山大佛"), popularity: getPopularity("乐山大佛") },
  { name: "黄龙", lat: 32.75, lng: 103.83, district: "松潘县", city: "阿坝州", province: "四川省", tags: ["彩池", "雪山"], imgUrl: getUnsplashUrl("九寨沟", "1548013146-02c942cbd6b5"), desc: "人间瑶池，五彩钙化池。", rating: getRating("黄龙"), popularity: getPopularity("黄龙") },
  { name: "四姑娘山", lat: 31.03, lng: 102.90, district: "小金县", city: "阿坝州", province: "四川省", tags: ["雪山", "徒步"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "蜀山皇后，东方阿尔卑斯。", rating: getRating("四姑娘山"), popularity: getPopularity("四姑娘山") },
  { name: "宽窄巷子", lat: 30.67, lng: 104.05, district: "青羊区", city: "成都市", province: "四川省", tags: ["街区", "文化"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "成都遗留下来的较成规模的清朝古街道。", rating: getRating("宽窄巷子"), popularity: getPopularity("宽窄巷子") },
  { name: "锦里", lat: 30.65, lng: 104.05, district: "武侯区", city: "成都市", province: "四川省", tags: ["古街", "三国"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "西蜀第一街，体验三国文化。", rating: getRating("锦里"), popularity: getPopularity("锦里") },
  { name: "海螺沟", lat: 29.58, lng: 102.15, district: "泸定县", city: "甘孜州", province: "四川省", tags: ["冰川", "温泉"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "低海拔现代冰川，冰川与温泉共存。", rating: getRating("海螺沟"), popularity: getPopularity("海螺沟") },
  { name: "阆中古城", lat: 31.55, lng: 106.00, district: "阆中市", city: "南充市", province: "四川省", tags: ["古城", "风水"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "中国四大古城之一，风水古城。", rating: getRating("阆中古城"), popularity: getPopularity("阆中古城") },
  { name: "若尔盖", lat: 33.58, lng: 102.55, district: "若尔盖县", city: "阿坝州", province: "四川省", tags: ["草原", "湿地"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "中国最美的高寒湿地草原。", rating: getRating("若尔盖"), popularity: getPopularity("若尔盖") },
  { name: "色达", lat: 32.27, lng: 100.33, district: "色达县", city: "甘孜州", province: "四川省", tags: ["佛教", "红房子"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "世界上最大的佛学院，红色佛国。", rating: getRating("色达"), popularity: getPopularity("色达") },
  { name: "毕棚沟", lat: 31.23, lng: 102.88, district: "理县", city: "阿坝州", province: "四川省", tags: ["彩林", "雪山"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "四姑娘山的背影，秋日彩林。", rating: getRating("毕棚沟"), popularity: getPopularity("毕棚沟") },

  // 云南省 (15个)
  { name: "丽江古城", lat: 26.87, lng: 100.23, district: "古城区", city: "丽江市", province: "云南省", tags: ["古城", "民族"], imgUrl: getUnsplashUrl("丽江古城", "1548013146-02c942cbd6b5"), desc: "世界文化遗产，纳西族文化圣地。", rating: getRating("丽江古城"), popularity: getPopularity("丽江古城") },
  { name: "大理古城", lat: 25.69, lng: 100.16, district: "大理市", city: "大理州", province: "云南省", tags: ["古城", "苍山洱海"], imgUrl: getUnsplashUrl("大理古城", "1548013146-02c942cbd6b5"), desc: "风花雪月，苍山洱海间的白族古城。", rating: getRating("大理古城"), popularity: getPopularity("大理古城") },
  { name: "石林", lat: 24.82, lng: 103.27, district: "石林县", city: "昆明市", province: "云南省", tags: ["喀斯特", "自然"], imgUrl: getUnsplashUrl("石林", "1548013146-02c942cbd6b5"), desc: "天下第一奇观，喀斯特地貌精华。", rating: getRating("石林"), popularity: getPopularity("石林") },
  { name: "香格里拉", lat: 27.83, lng: 99.71, district: "香格里拉市", city: "迪庆州", province: "云南省", tags: ["高原", "藏族"], imgUrl: getUnsplashUrl("香格里拉", "1548013146-02c942cbd6b5"), desc: "心中的日月，雪山草甸藏传佛教。", rating: getRating("香格里拉"), popularity: getPopularity("香格里拉") },
  { name: "玉龙雪山", lat: 27.10, lng: 100.18, district: "玉龙县", city: "丽江市", province: "云南省", tags: ["雪山", "冰川"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "纳西族神山，北半球最南的大雪山。", rating: getRating("玉龙雪山"), popularity: getPopularity("玉龙雪山") },
  { name: "泸沽湖", lat: 27.72, lng: 100.78, district: "宁蒗县", city: "丽江市", province: "云南省", tags: ["湖泊", "摩梭"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "高原明珠，东方女儿国。", rating: getRating("泸沽湖"), popularity: getPopularity("泸沽湖") },
  { name: "西双版纳", lat: 22.01, lng: 100.80, district: "景洪市", city: "西双版纳州", province: "云南省", tags: ["热带", "雨林"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "热带雨林，傣族风情。", rating: getRating("西双版纳"), popularity: getPopularity("西双版纳") },
  { name: "洱海", lat: 25.85, lng: 100.18, district: "大理市", city: "大理州", province: "云南省", tags: ["湖泊", "骑行"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "风花雪月四大名景之一。", rating: getRating("洱海"), popularity: getPopularity("洱海") },
  { name: "束河古镇", lat: 26.92, lng: 100.20, district: "古城区", city: "丽江市", province: "云南省", tags: ["古镇", "宁静"], imgUrl: getUnsplashUrl("丽江古城", "1548013146-02c942cbd6b5"), desc: "茶马古道上的重镇，比丽江更宁静。", rating: getRating("束河古镇"), popularity: getPopularity("束河古镇") },
  { name: "普达措", lat: 27.78, lng: 99.97, district: "香格里拉市", city: "迪庆州", province: "云南省", tags: ["国家公园", "高原"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "中国大陆第一个国家公园。", rating: getRating("普达措"), popularity: getPopularity("普达措") },
  { name: "元阳梯田", lat: 23.15, lng: 102.75, district: "元阳县", city: "红河州", province: "云南省", tags: ["梯田", "摄影"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "哈尼梯田，大地雕塑。", rating: getRating("元阳梯田"), popularity: getPopularity("元阳梯田") },
  { name: "梅里雪山", lat: 28.44, lng: 98.62, district: "德钦县", city: "迪庆州", province: "云南省", tags: ["雪山", "日照金山"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "藏区八大神山之首，太子十三峰。", rating: getRating("梅里雪山"), popularity: getPopularity("梅里雪山") },
  { name: "腾冲热海", lat: 25.27, lng: 98.45, district: "腾冲市", city: "保山市", province: "云南省", tags: ["温泉", "火山"], imgUrl: getUnsplashUrl("鸣沙山月牙泉", "1548013146-02c942cbd6b5"), desc: "中国三大地热区之一，温泉之乡。", rating: getRating("腾冲热海"), popularity: getPopularity("腾冲热海") },
  { name: "罗平油菜花", lat: 24.88, lng: 104.31, district: "罗平县", city: "曲靖市", province: "云南省", tags: ["花海", "摄影"], imgUrl: getUnsplashUrl("婺源", "1548013146-02c942cbd6b5"), desc: "中国最美油菜花海。", rating: getRating("罗平油菜花"), popularity: getPopularity("罗平油菜花") },
  { name: "东川红土地", lat: 26.08, lng: 103.08, district: "东川区", city: "昆明市", province: "云南省", tags: ["红土地", "摄影"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "上帝打翻的调色板。", rating: getRating("东川红土地"), popularity: getPopularity("东川红土地") },

  // 福建省 (12个)
  { name: "鼓浪屿", lat: 24.44, lng: 118.07, district: "思明区", city: "厦门市", province: "福建省", tags: ["海岛", "文艺"], imgUrl: getUnsplashUrl("鼓浪屿", "1548013146-02c942cbd6b5"), desc: "海上花园，钢琴之岛。", rating: getRating("鼓浪屿"), popularity: getPopularity("鼓浪屿") },
  { name: "武夷山", lat: 27.75, lng: 118.02, district: "武夷山市", city: "南平市", province: "福建省", tags: ["丹霞", "茶文化"], imgUrl: getUnsplashUrl("武夷山", "1548013146-02c942cbd6b5"), desc: "世界双遗产，大红袍故乡。", rating: getRating("武夷山"), popularity: getPopularity("武夷山") },
  { name: "土楼", lat: 24.7, lng: 117.0, district: "南靖县", city: "漳州市", province: "福建省", tags: ["民居", "世界遗产"], imgUrl: getUnsplashUrl("土楼", "1548013146-02c942cbd6b5"), desc: "客家土楼，东方古城堡。", rating: getRating("土楼"), popularity: getPopularity("土楼") },
  { name: "厦门大学", lat: 24.44, lng: 118.10, district: "思明区", city: "厦门市", province: "福建省", tags: ["校园", "海景"], imgUrl: getUnsplashUrl("鼓浪屿", "1548013146-02c942cbd6b5"), desc: "中国最美大学，依山傍海。", rating: getRating("厦门大学"), popularity: getPopularity("厦门大学") },
  { name: "南普陀寺", lat: 24.44, lng: 118.12, district: "思明区", city: "厦门市", province: "福建省", tags: ["佛教", "素食"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "闽南佛教胜地，素饼闻名。", rating: getRating("南普陀寺"), popularity: getPopularity("南普陀寺") },
  { name: "曾厝垵", lat: 24.43, lng: 118.13, district: "思明区", city: "厦门市", province: "福建省", tags: ["渔村", "文艺"], imgUrl: getUnsplashUrl("鼓浪屿", "1548013146-02c942cbd6b5"), desc: "中国最文艺渔村。", rating: getRating("曾厝垵"), popularity: getPopularity("曾厝垵") },
  { name: "三坊七巷", lat: 26.08, lng: 119.30, district: "鼓楼区", city: "福州市", province: "福建省", tags: ["历史", "名人"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "明清建筑博物馆，里坊制度活化石。", rating: getRating("三坊七巷"), popularity: getPopularity("三坊七巷") },
  { name: "太姥山", lat: 27.10, lng: 120.20, district: "福鼎市", city: "宁德市", province: "福建省", tags: ["山海", "奇石"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "海上仙都，山海大观。", rating: getRating("太姥山"), popularity: getPopularity("太姥山") },
  { name: "清源山", lat: 24.95, lng: 118.60, district: "丰泽区", city: "泉州市", province: "福建省", tags: ["道教", "石刻"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "闽海蓬莱第一山，老君岩造像。", rating: getRating("清源山"), popularity: getPopularity("清源山") },
  { name: "开元寺", lat: 24.91, lng: 118.59, district: "鲤城区", city: "泉州市", province: "福建省", tags: ["佛教", "古刹"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "福建最大佛教寺院，东西塔。", rating: getRating("开元寺"), popularity: getPopularity("开元寺") },
  { name: "白水洋", lat: 27.05, lng: 119.20, district: "屏南县", city: "宁德市", province: "福建省", tags: ["地质", "亲水"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "天下绝景，宇宙之谜，浅水广场。", rating: getRating("白水洋"), popularity: getPopularity("白水洋") },
  { name: "湄洲岛", lat: 25.08, lng: 119.12, district: "秀屿区", city: "莆田市", province: "福建省", tags: ["海岛", "妈祖"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "妈祖故里，南国蓬莱。", rating: getRating("湄洲岛"), popularity: getPopularity("湄洲岛") },

  // 陕西省 (10个)
  { name: "兵马俑", lat: 34.38, lng: 109.27, district: "临潼区", city: "西安市", province: "陕西省", tags: ["历史", "考古"], imgUrl: getUnsplashUrl("兵马俑", "1548013146-02c942cbd6b5"), desc: "世界第八大奇迹，秦朝军事力量见证。", rating: getRating("兵马俑"), popularity: getPopularity("兵马俑") },
  { name: "华山", lat: 34.47, lng: 110.08, district: "华阴市", city: "渭南市", province: "陕西省", tags: ["险峰", "道教"], imgUrl: getUnsplashUrl("华山", "1548013146-02c942cbd6b5"), desc: "奇险天下第一山，自古华山一条路。", rating: getRating("华山"), popularity: getPopularity("华山") },
  { name: "大雁塔", lat: 34.22, lng: 108.96, district: "雁塔区", city: "西安市", province: "陕西省", tags: ["佛教", "唐代"], imgUrl: getUnsplashUrl("大雁塔", "1548013146-02c942cbd6b5"), desc: "玄奘译经藏经之所，盛唐标志。", rating: getRating("大雁塔"), popularity: getPopularity("大雁塔") },
  { name: "西安城墙", lat: 34.27, lng: 108.95, district: "碑林区", city: "西安市", province: "陕西省", tags: ["古城", "骑行"], imgUrl: getUnsplashUrl("大雁塔", "1548013146-02c942cbd6b5"), desc: "中国现存最完整的古代城垣。", rating: getRating("西安城墙"), popularity: getPopularity("西安城墙") },
  { name: "大唐芙蓉园", lat: 34.22, lng: 108.97, district: "雁塔区", city: "西安市", province: "陕西省", tags: ["园林", "唐风"], imgUrl: getUnsplashUrl("颐和园", "1548013146-02c942cbd6b5"), desc: "中国第一个全方位展示盛唐风貌的皇家园林。", rating: getRating("大唐芙蓉园"), popularity: getPopularity("大唐芙蓉园") },
  { name: "华清池", lat: 34.36, lng: 109.21, district: "临潼区", city: "西安市", province: "陕西省", tags: ["温泉", "历史"], imgUrl: getUnsplashUrl("鸣沙山月牙泉", "1548013146-02c942cbd6b5"), desc: "天下第一温泉，杨贵妃沐浴处。", rating: getRating("华清池"), popularity: getPopularity("华清池") },
  { name: "法门寺", lat: 34.43, lng: 107.90, district: "扶风县", city: "宝鸡市", province: "陕西省", tags: ["佛教", "舍利"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "关中塔庙之祖，佛指舍利供奉地。", rating: getRating("法门寺"), popularity: getPopularity("法门寺") },
  { name: "壶口瀑布", lat: 36.32, lng: 110.45, district: "宜川县", city: "延安市", province: "陕西省", tags: ["瀑布", "黄河"], imgUrl: getUnsplashUrl("黄果树瀑布", "1548013146-02c942cbd6b5"), desc: "黄河之水天上来，千里黄河一壶收。", rating: getRating("壶口瀑布"), popularity: getPopularity("壶口瀑布") },
  { name: "延安革命纪念馆", lat: 36.60, lng: 109.48, district: "宝塔区", city: "延安市", province: "陕西省", tags: ["红色", "历史"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "中国革命圣地，延安精神发源地。", rating: getRating("延安革命纪念馆"), popularity: getPopularity("延安革命纪念馆") },
  { name: "金丝峡", lat: 33.42, lng: 110.35, district: "商南县", city: "商洛市", province: "陕西省", tags: ["峡谷", "生态"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "中国最美的大峡谷，峡谷之都。", rating: getRating("金丝峡"), popularity: getPopularity("金丝峡") },

  // 广东省 (12个)
  { name: "广州塔", lat: 23.11, lng: 113.32, district: "海珠区", city: "广州市", province: "广东省", tags: ["地标", "夜景"], imgUrl: getUnsplashUrl("广州塔", "1548013146-02c942cbd6b5"), desc: "小蛮腰，珠江新城地标建筑。", rating: getRating("广州塔"), popularity: getPopularity("广州塔") },
  { name: "丹霞山", lat: 25.02, lng: 113.73, district: "仁化县", city: "韶关市", province: "广东省", tags: ["丹霞", "自然"], imgUrl: getUnsplashUrl("丹霞山", "1548013146-02c942cbd6b5"), desc: "丹霞地貌命名地，赤壁丹崖。", rating: getRating("丹霞山"), popularity: getPopularity("丹霞山") },
  { name: "开平碉楼", lat: 22.38, lng: 112.67, district: "开平市", city: "江门市", province: "广东省", tags: ["侨乡", "建筑"], imgUrl: getUnsplashUrl("开平碉楼", "1548013146-02c942cbd6b5"), desc: "中西合璧的华侨建筑群。", rating: getRating("开平碉楼"), popularity: getPopularity("开平碉楼") },
  { name: "深圳世界之窗", lat: 22.54, lng: 113.98, district: "南山区", city: "深圳市", province: "广东省", tags: ["乐园", "微缩"], imgUrl: getUnsplashUrl("东方明珠", "1548013146-02c942cbd6b5"), desc: "不出国门看世界，微缩景观公园。", rating: getRating("深圳世界之窗"), popularity: getPopularity("深圳世界之窗") },
  { name: "珠海长隆", lat: 22.10, lng: 113.54, district: "香洲区", city: "珠海市", province: "广东省", tags: ["乐园", "海洋"], imgUrl: getUnsplashUrl("东方明珠", "1548013146-02c942cbd6b5"), desc: "世界级海洋主题公园。", rating: getRating("珠海长隆"), popularity: getPopularity("珠海长隆") },
  { name: "陈家祠", lat: 23.13, lng: 113.25, district: "荔湾区", city: "广州市", province: "广东省", tags: ["建筑", "岭南"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "岭南建筑艺术明珠，广东民间工艺博物馆。", rating: getRating("陈家祠"), popularity: getPopularity("陈家祠") },
  { name: "孙中山故居", lat: 22.43, lng: 113.55, district: "南朗镇", city: "中山市", province: "广东省", tags: ["纪念", "历史"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "孙中山先生出生和成长的地方。", rating: getRating("孙中山故居"), popularity: getPopularity("孙中山故居") },
  { name: "惠州西湖", lat: 23.08, lng: 114.42, district: "惠城区", city: "惠州市", province: "广东省", tags: ["湖泊", "苏轼"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "岭南明珠，苏东坡曾在此留下足迹。", rating: getRating("惠州西湖"), popularity: getPopularity("惠州西湖") },
  { name: "肇庆七星岩", lat: 23.05, lng: 112.47, district: "端州区", city: "肇庆市", province: "广东省", tags: ["喀斯特", "湖泊"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "岭南第一奇观，西湖之水，阳朔之山。", rating: getRating("肇庆七星岩"), popularity: getPopularity("肇庆七星岩") },
  { name: "南澳岛", lat: 23.42, lng: 117.02, district: "南澳县", city: "汕头市", province: "广东省", tags: ["海岛", "风车"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "广东唯一海岛县，东方夏威夷。", rating: getRating("南澳岛"), popularity: getPopularity("南澳岛") },
  { name: "清远古龙峡", lat: 23.78, lng: 113.15, district: "清新区", city: "清远市", province: "广东省", tags: ["漂流", "峡谷"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "中国漂流之乡，广东第一漂。", rating: getRating("清远古龙峡"), popularity: getPopularity("清远古龙峡") },
  { name: "梅州客天下", lat: 24.28, lng: 116.12, district: "梅江区", city: "梅州市", province: "广东省", tags: ["客家", "文化"], imgUrl: getUnsplashUrl("土楼", "1548013146-02c942cbd6b5"), desc: "世界客都，客家文化大观园。", rating: getRating("梅州客天下"), popularity: getPopularity("梅州客天下") },

  // 海南省 (8个)
  { name: "三亚湾", lat: 18.25, lng: 109.51, district: "天涯区", city: "三亚市", province: "海南省", tags: ["海滩", "度假"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "热带海滨，阳光沙滩椰林。", rating: getRating("三亚湾"), popularity: getPopularity("三亚湾") },
  { name: "蜈支洲岛", lat: 18.31, lng: 109.76, district: "海棠区", city: "三亚市", province: "海南省", tags: ["海岛", "潜水"], imgUrl: getUnsplashUrl("蜈支洲岛", "1548013146-02c942cbd6b5"), desc: "中国的马尔代夫，碧海蓝天。", rating: getRating("蜈支洲岛"), popularity: getPopularity("蜈支洲岛") },
  { name: "亚龙湾", lat: 18.23, lng: 109.65, district: "吉阳区", city: "三亚市", province: "海南省", tags: ["海滩", "度假"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "天下第一湾，东方夏威夷。", rating: getRating("亚龙湾"), popularity: getPopularity("亚龙湾") },
  { name: "天涯海角", lat: 18.30, lng: 109.48, district: "天涯区", city: "三亚市", province: "海南省", tags: ["海景", "浪漫"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "天之边缘，海之尽头。", rating: getRating("天涯海角"), popularity: getPopularity("天涯海角") },
  { name: "南山寺", lat: 18.30, lng: 109.20, district: "崖州区", city: "三亚市", province: "海南省", tags: ["佛教", "海上观音"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "108米海上观音，福寿文化。", rating: getRating("南山寺"), popularity: getPopularity("南山寺") },
  { name: "分界洲岛", lat: 18.58, lng: 110.20, district: "陵水县", city: "陵水黎族自治县", province: "海南省", tags: ["海岛", "潜水"], imgUrl: getUnsplashUrl("蜈支洲岛", "1548013146-02c942cbd6b5"), desc: "心灵的分界岛，潜水天堂。", rating: getRating("分界洲岛"), popularity: getPopularity("分界洲岛") },
  { name: "呀诺达", lat: 18.45, lng: 109.65, district: "保亭县", city: "保亭黎族苗族自治县", province: "海南省", tags: ["雨林", "生态"], imgUrl: getUnsplashUrl("西双版纳", "1548013146-02c942cbd6b5"), desc: "热带雨林，海南的香格里拉。", rating: getRating("呀诺达"), popularity: getPopularity("呀诺达") },
  { name: "博鳌", lat: 19.15, lng: 110.58, district: "博鳌镇", city: "琼海市", province: "海南省", tags: ["论坛", "小镇"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "亚洲论坛永久会址，天堂小镇。", rating: getRating("博鳌"), popularity: getPopularity("博鳌") },

  // 甘肃省 (8个)
  { name: "敦煌莫高窟", lat: 40.04, lng: 94.8, district: "敦煌市", city: "酒泉市", province: "甘肃省", tags: ["艺术", "佛教"], imgUrl: getUnsplashUrl("敦煌莫高窟", "1548013146-02c942cbd6b5"), desc: "东方艺术明珠，千年佛教壁画宝库。", rating: getRating("敦煌莫高窟"), popularity: getPopularity("敦煌莫高窟") },
  { name: "鸣沙山月牙泉", lat: 40.08, lng: 94.67, district: "敦煌市", city: "酒泉市", province: "甘肃省", tags: ["沙漠", "奇观"], imgUrl: getUnsplashUrl("鸣沙山月牙泉", "1548013146-02c942cbd6b5"), desc: "沙泉共处，大漠中的奇迹。", rating: getRating("鸣沙山月牙泉"), popularity: getPopularity("鸣沙山月牙泉") },
  { name: "嘉峪关", lat: 39.80, lng: 98.22, district: "嘉峪关市", city: "嘉峪关市", province: "甘肃省", tags: ["长城", "雄关"], imgUrl: getUnsplashUrl("长城", "1548013146-02c942cbd6b5"), desc: "天下第一雄关，河西咽喉。", rating: getRating("嘉峪关"), popularity: getPopularity("嘉峪关") },
  { name: "张掖丹霞", lat: 38.91, lng: 100.13, district: "临泽县", city: "张掖市", province: "甘肃省", tags: ["丹霞", "彩色"], imgUrl: getUnsplashUrl("丹霞山", "1548013146-02c942cbd6b5"), desc: "中国最美的七大丹霞地貌之一。", rating: getRating("张掖丹霞"), popularity: getPopularity("张掖丹霞") },
  { name: "麦积山", lat: 34.35, lng: 106.00, district: "麦积区", city: "天水市", province: "甘肃省", tags: ["石窟", "泥塑"], imgUrl: getUnsplashUrl("敦煌莫高窟", "1548013146-02c942cbd6b5"), desc: "东方雕塑馆，麦积烟雨。", rating: getRating("麦积山"), popularity: getPopularity("麦积山") },
  { name: "拉卜楞寺", lat: 35.20, lng: 102.51, district: "夏河县", city: "甘南州", province: "甘肃省", tags: ["佛教", "藏传"], imgUrl: getUnsplashUrl("布达拉宫", "1548013146-02c942cbd6b5"), desc: "世界藏学府，藏传佛教格鲁派六大寺院之一。", rating: getRating("拉卜楞寺"), popularity: getPopularity("拉卜楞寺") },
  { name: "崆峒山", lat: 35.55, lng: 106.53, district: "崆峒区", city: "平凉市", province: "甘肃省", tags: ["道教", "武术"], imgUrl: getUnsplashUrl("峨眉山", "1548013146-02c942cbd6b5"), desc: "西来第一山，道教名山。", rating: getRating("崆峒山"), popularity: getPopularity("崆峒山") },
  { name: "甘南草原", lat: 34.98, lng: 102.91, district: "合作市", city: "甘南州", province: "甘肃省", tags: ["草原", "藏族"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "中国最美的高原草原之一。", rating: getRating("甘南草原"), popularity: getPopularity("甘南草原") },

  // 西藏自治区 (8个)
  { name: "布达拉宫", lat: 29.65, lng: 91.12, district: "城关区", city: "拉萨市", province: "西藏自治区", tags: ["宗教", "宫殿"], imgUrl: getUnsplashUrl("布达拉宫", "1548013146-02c942cbd6b5"), desc: "雪域高原的圣殿，藏传佛教圣地。", rating: getRating("布达拉宫"), popularity: getPopularity("布达拉宫") },
  { name: "纳木错", lat: 30.7, lng: 90.5, district: "当雄县", city: "拉萨市", province: "西藏自治区", tags: ["圣湖", "高原"], imgUrl: getUnsplashUrl("纳木错", "1548013146-02c942cbd6b5"), desc: "天湖，世界海拔最高的大型湖泊。", rating: getRating("纳木错"), popularity: getPopularity("纳木错") },
  { name: "大昭寺", lat: 29.65, lng: 91.13, district: "城关区", city: "拉萨市", province: "西藏自治区", tags: ["佛教", "圣地"], imgUrl: getUnsplashUrl("布达拉宫", "1548013146-02c942cbd6b5"), desc: "藏传佛教最神圣的寺院，先有大昭寺后有拉萨城。", rating: getRating("大昭寺"), popularity: getPopularity("大昭寺") },
  { name: "羊卓雍措", lat: 28.95, lng: 90.40, district: "浪卡子县", city: "山南市", province: "西藏自治区", tags: ["圣湖", "高原"], imgUrl: getUnsplashUrl("纳木错", "1548013146-02c942cbd6b5"), desc: "西藏三大圣湖之一，碧玉湖。", rating: getRating("羊卓雍措"), popularity: getPopularity("羊卓雍措") },
  { name: "珠穆朗玛峰", lat: 28.00, lng: 86.92, district: "定日县", city: "日喀则市", province: "西藏自治区", tags: ["雪山", "世界之巅"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "世界最高峰，8848.86米。", rating: getRating("珠穆朗玛峰"), popularity: getPopularity("珠穆朗玛峰") },
  { name: "林芝桃花", lat: 29.65, lng: 94.36, district: "巴宜区", city: "林芝市", province: "西藏自治区", tags: ["花海", "雪山"], imgUrl: getUnsplashUrl("罗平油菜花", "1548013146-02c942cbd6b5"), desc: "西藏江南，雪山下的桃花源。", rating: getRating("林芝桃花"), popularity: getPopularity("林芝桃花") },
  { name: "扎什伦布寺", lat: 29.27, lng: 88.52, district: "桑珠孜区", city: "日喀则市", province: "西藏自治区", tags: ["佛教", "班禅"], imgUrl: getUnsplashUrl("布达拉宫", "1548013146-02c942cbd6b5"), desc: "历代班禅驻锡地，后藏第一大寺。", rating: getRating("扎什伦布寺"), popularity: getPopularity("扎什伦布寺") },
  { name: "冈仁波齐", lat: 31.07, lng: 81.31, district: "普兰县", city: "阿里地区", province: "西藏自治区", tags: ["神山", "朝圣"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "世界公认的神山，众神的居所。", rating: getRating("冈仁波齐"), popularity: getPopularity("冈仁波齐") },

  // 新疆维吾尔自治区 (10个)
  { name: "喀纳斯", lat: 48.71, lng: 87.02, district: "布尔津县", city: "阿勒泰地区", province: "新疆维吾尔自治区", tags: ["湖泊", "秋色"], imgUrl: getUnsplashUrl("喀纳斯", "1548013146-02c942cbd6b5"), desc: "人间净土，神秘的变色湖。", rating: getRating("喀纳斯"), popularity: getPopularity("喀纳斯") },
  { name: "天山天池", lat: 43.88, lng: 88.12, district: "阜康市", city: "昌吉州", province: "新疆维吾尔自治区", tags: ["高山湖", "雪山"], imgUrl: getUnsplashUrl("天山天池", "1548013146-02c942cbd6b5"), desc: "瑶池仙境，雪峰环抱的高山湖泊。", rating: getRating("天山天池"), popularity: getPopularity("天山天池") },
  { name: "赛里木湖", lat: 44.60, lng: 81.85, district: "博乐市", city: "博尔塔拉州", province: "新疆维吾尔自治区", tags: ["湖泊", "草原"], imgUrl: getUnsplashUrl("天山天池", "1548013146-02c942cbd6b5"), desc: "大西洋最后一滴眼泪。", rating: getRating("赛里木湖"), popularity: getPopularity("赛里木湖") },
  { name: "那拉提", lat: 43.43, lng: 84.02, district: "新源县", city: "伊犁州", province: "新疆维吾尔自治区", tags: ["草原", "哈萨克"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "空中草原，哈萨克族的摇篮。", rating: getRating("那拉提"), popularity: getPopularity("那拉提") },
  { name: "巴音布鲁克", lat: 42.68, lng: 84.15, district: "和静县", city: "巴音郭楞州", province: "新疆维吾尔自治区", tags: ["草原", "天鹅"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "中国第二大草原，九曲十八弯。", rating: getRating("巴音布鲁克"), popularity: getPopularity("巴音布鲁克") },
  { name: "吐鲁番", lat: 42.95, lng: 89.19, district: "高昌区", city: "吐鲁番市", province: "新疆维吾尔自治区", tags: ["火焰山", "葡萄"], imgUrl: getUnsplashUrl("鸣沙山月牙泉", "1548013146-02c942cbd6b5"), desc: "火洲，葡萄沟，坎儿井。", rating: getRating("吐鲁番"), popularity: getPopularity("吐鲁番") },
  { name: "喀什古城", lat: 39.47, lng: 75.98, district: "喀什市", city: "喀什地区", province: "新疆维吾尔自治区", tags: ["古城", "维吾尔"], imgUrl: getUnsplashUrl("丽江古城", "1548013146-02c942cbd6b5"), desc: "活着的千年古城，丝路明珠。", rating: getRating("喀什古城"), popularity: getPopularity("喀什古城") },
  { name: "禾木村", lat: 48.57, lng: 87.43, district: "布尔津县", city: "阿勒泰地区", province: "新疆维吾尔自治区", tags: ["村落", "图瓦"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "中国最美乡村，神的自留地。", rating: getRating("禾木村"), popularity: getPopularity("禾木村") },
  { name: "可可托海", lat: 47.22, lng: 89.85, district: "富蕴县", city: "阿勒泰地区", province: "新疆维吾尔自治区", tags: ["峡谷", "地质"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "地质矿产博物馆，功勋矿区。", rating: getRating("可可托海"), popularity: getPopularity("可可托海") },
  { name: "独库公路", lat: 43.50, lng: 84.50, district: "独山子区", city: "克拉玛依市", province: "新疆维吾尔自治区", tags: ["公路", "自驾"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "中国最美公路，一日四季。", rating: getRating("独库公路"), popularity: getPopularity("独库公路") },

  // 广西壮族自治区 (10个)
  { name: "桂林山水", lat: 25.27, lng: 110.29, district: "秀峰区", city: "桂林市", province: "广西壮族自治区", tags: ["山水", "漓江"], imgUrl: getUnsplashUrl("桂林山水", "1548013146-02c942cbd6b5"), desc: "桂林山水甲天下，漓江风光如画。", rating: getRating("桂林山水"), popularity: getPopularity("桂林山水") },
  { name: "阳朔西街", lat: 24.77, lng: 110.49, district: "阳朔县", city: "桂林市", province: "广西壮族自治区", tags: ["古镇", "休闲"], imgUrl: getUnsplashUrl("阳朔西街", "1548013146-02c942cbd6b5"), desc: "洋人街，遇龙河畔的悠闲时光。", rating: getRating("阳朔西街"), popularity: getPopularity("阳朔西街") },
  { name: "龙脊梯田", lat: 25.75, lng: 110.12, district: "龙胜县", city: "桂林市", province: "广西壮族自治区", tags: ["梯田", "壮族"], imgUrl: getUnsplashUrl("元阳梯田", "1548013146-02c942cbd6b5"), desc: "世界梯田之冠，壮族瑶族家园。", rating: getRating("龙脊梯田"), popularity: getPopularity("龙脊梯田") },
  { name: "德天瀑布", lat: 22.85, lng: 106.72, district: "大新县", city: "崇左市", province: "广西壮族自治区", tags: ["瀑布", "跨国"], imgUrl: getUnsplashUrl("黄果树瀑布", "1548013146-02c942cbd6b5"), desc: "亚洲第一跨国瀑布，中越边境。", rating: getRating("德天瀑布"), popularity: getPopularity("德天瀑布") },
  { name: "北海银滩", lat: 21.40, lng: 109.12, district: "银海区", city: "北海市", province: "广西壮族自治区", tags: ["海滩", "度假"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "天下第一滩，滩长平沙细白。", rating: getRating("北海银滩"), popularity: getPopularity("北海银滩") },
  { name: "涠洲岛", lat: 21.03, lng: 109.12, district: "海城区", city: "北海市", province: "广西壮族自治区", tags: ["海岛", "火山"], imgUrl: getUnsplashUrl("蜈支洲岛", "1548013146-02c942cbd6b5"), desc: "中国最大最年轻的火山岛。", rating: getRating("涠洲岛"), popularity: getPopularity("涠洲岛") },
  { name: "象鼻山", lat: 25.27, lng: 110.29, district: "象山区", city: "桂林市", province: "广西壮族自治区", tags: ["地标", "象形"], imgUrl: getUnsplashUrl("桂林山水", "1548013146-02c942cbd6b5"), desc: "桂林城徽，象山水月。", rating: getRating("象鼻山"), popularity: getPopularity("象鼻山") },
  { name: "黄姚古镇", lat: 24.25, lng: 111.20, district: "昭平县", city: "贺州市", province: "广西壮族自治区", tags: ["古镇", "宁静"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "梦境家园，中国最美十大古镇之一。", rating: getRating("黄姚古镇"), popularity: getPopularity("黄姚古镇") },
  { name: "通灵大峡谷", lat: 22.72, lng: 106.62, district: "靖西市", city: "百色市", province: "广西壮族自治区", tags: ["峡谷", "瀑布"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "中国最绿的峡谷，通灵瀑布。", rating: getRating("通灵大峡谷"), popularity: getPopularity("通灵大峡谷") },
  { name: "三江侗寨", lat: 25.78, lng: 109.60, district: "三江侗族自治县", city: "柳州市", province: "广西壮族自治区", tags: ["侗族", "风雨桥"], imgUrl: getUnsplashUrl("土楼", "1548013146-02c942cbd6b5"), desc: "世界桥楼之乡，侗族大歌。", rating: getRating("三江侗寨"), popularity: getPopularity("三江侗寨") },

  // 山东省 (10个)
  { name: "泰山", lat: 36.25, lng: 117.1, district: "泰山区", city: "泰安市", province: "山东省", tags: ["五岳", "日出"], imgUrl: getUnsplashUrl("泰山", "1548013146-02c942cbd6b5"), desc: "五岳之首，登泰山而小天下。", rating: getRating("泰山"), popularity: getPopularity("泰山") },
  { name: "崂山", lat: 36.1, lng: 120.6, district: "崂山区", city: "青岛市", province: "山东省", tags: ["道教", "海景"], imgUrl: getUnsplashUrl("崂山", "1548013146-02c942cbd6b5"), desc: "海上名山第一，道教圣地。", rating: getRating("崂山"), popularity: getPopularity("崂山") },
  { name: "曲阜三孔", lat: 35.58, lng: 117.02, district: "曲阜市", city: "济宁市", province: "山东省", tags: ["儒家", "孔庙"], imgUrl: getUnsplashUrl("天坛", "1548013146-02c942cbd6b5"), desc: "孔庙孔府孔林，世界文化遗产。", rating: getRating("曲阜三孔"), popularity: getPopularity("曲阜三孔") },
  { name: "蓬莱阁", lat: 37.82, lng: 120.75, district: "蓬莱区", city: "烟台市", province: "山东省", tags: ["仙境", "海市"], imgUrl: getUnsplashUrl("崂山", "1548013146-02c942cbd6b5"), desc: "人间仙境，海市蜃楼。", rating: getRating("蓬莱阁"), popularity: getPopularity("蓬莱阁") },
  { name: "趵突泉", lat: 36.66, lng: 117.02, district: "历下区", city: "济南市", province: "山东省", tags: ["泉水", "园林"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "天下第一泉，济南七十二名泉之首。", rating: getRating("趵突泉"), popularity: getPopularity("趵突泉") },
  { name: "刘公岛", lat: 37.50, lng: 122.18, district: "环翠区", city: "威海市", province: "山东省", tags: ["海岛", "历史"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "海上仙山，北洋水师诞生地。", rating: getRating("刘公岛"), popularity: getPopularity("刘公岛") },
  { name: "台儿庄古城", lat: 34.56, lng: 117.73, district: "台儿庄区", city: "枣庄市", province: "山东省", tags: ["古城", "运河"], imgUrl: getUnsplashUrl("乌镇", "1548013146-02c942cbd6b5"), desc: "天下第一庄，京杭运河仅存的遗产村庄。", rating: getRating("台儿庄古城"), popularity: getPopularity("台儿庄古城") },
  { name: "大明湖", lat: 36.67, lng: 117.02, district: "历下区", city: "济南市", province: "山东省", tags: ["湖泊", "夏雨荷"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "四面荷花三面柳，一城山色半城湖。", rating: getRating("大明湖"), popularity: getPopularity("大明湖") },
  { name: "成山头", lat: 37.40, lng: 122.68, district: "荣成市", city: "威海市", province: "山东省", tags: ["海角", "日出"], imgUrl: getUnsplashUrl("崂山", "1548013146-02c942cbd6b5"), desc: "中国好望角，天尽头。", rating: getRating("成山头"), popularity: getPopularity("成山头") },
  { name: "沂蒙山", lat: 35.55, lng: 118.35, district: "蒙阴县", city: "临沂市", province: "山东省", tags: ["革命", "山水"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "沂蒙山小调，红色革命根据地。", rating: getRating("沂蒙山"), popularity: getPopularity("沂蒙山") },

  // 河南省 (10个)
  { name: "少林寺", lat: 34.51, lng: 112.95, district: "登封市", city: "郑州市", province: "河南省", tags: ["武术", "佛教"], imgUrl: getUnsplashUrl("少林寺", "1548013146-02c942cbd6b5"), desc: "天下武功出少林，禅宗祖庭。", rating: getRating("少林寺"), popularity: getPopularity("少林寺") },
  { name: "龙门石窟", lat: 34.57, lng: 112.47, district: "洛龙区", city: "洛阳市", province: "河南省", tags: ["石刻", "世界遗产"], imgUrl: getUnsplashUrl("龙门石窟", "1548013146-02c942cbd6b5"), desc: "中国石刻艺术巅峰之作。", rating: getRating("龙门石窟"), popularity: getPopularity("龙门石窟") },
  { name: "云台山", lat: 35.40, lng: 113.35, district: "修武县", city: "焦作市", province: "河南省", tags: ["山水", "峡谷"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "北方九寨沟，峡谷极品。", rating: getRating("云台山"), popularity: getPopularity("云台山") },
  { name: "清明上河园", lat: 34.81, lng: 114.31, district: "龙亭区", city: "开封市", province: "河南省", tags: ["宋文化", "主题公园"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "一朝步入画卷，一日梦回千年。", rating: getRating("清明上河园"), popularity: getPopularity("清明上河园") },
  { name: "白马寺", lat: 34.72, lng: 112.61, district: "洛龙区", city: "洛阳市", province: "河南省", tags: ["佛教", "祖庭"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "中国第一古刹，佛教传入中国后第一座官办寺院。", rating: getRating("白马寺"), popularity: getPopularity("白马寺") },
  { name: "老君山", lat: 33.72, lng: 111.65, district: "栾川县", city: "洛阳市", province: "河南省", tags: ["道教", "云海"], imgUrl: getUnsplashUrl("峨眉山", "1548013146-02c942cbd6b5"), desc: "天下无双圣境，世界第一仙山。", rating: getRating("老君山"), popularity: getPopularity("老君山") },
  { name: "殷墟", lat: 36.13, lng: 114.31, district: "殷都区", city: "安阳市", province: "河南省", tags: ["考古", "甲骨文"], imgUrl: getUnsplashUrl("兵马俑", "1548013146-02c942cbd6b5"), desc: "商朝晚期都城遗址，甲骨文发现地。", rating: getRating("殷墟"), popularity: getPopularity("殷墟") },
  { name: "嵩山", lat: 34.49, lng: 113.02, district: "登封市", city: "郑州市", province: "河南省", tags: ["五岳", "地质"], imgUrl: getUnsplashUrl("泰山", "1548013146-02c942cbd6b5"), desc: "五岳之中岳，万山之祖。", rating: getRating("嵩山"), popularity: getPopularity("嵩山") },
  { name: "红旗渠", lat: 36.08, lng: 113.68, district: "林州市", city: "安阳市", province: "河南省", tags: ["水利", "精神"], imgUrl: getUnsplashUrl("都江堰", "1548013146-02c942cbd6b5"), desc: "人工天河，世界第八大奇迹。", rating: getRating("红旗渠"), popularity: getPopularity("红旗渠") },
  { name: "郭亮村", lat: 35.73, lng: 113.62, district: "辉县市", city: "新乡市", province: "河南省", tags: ["挂壁公路", "绝壁"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "太行明珠，绝壁上的村庄。", rating: getRating("郭亮村"), popularity: getPopularity("郭亮村") },

  // 江西省 (10个)
  { name: "庐山", lat: 29.59, lng: 115.97, district: "庐山市", city: "九江市", province: "江西省", tags: ["避暑", "瀑布"], imgUrl: getUnsplashUrl("庐山", "1548013146-02c942cbd6b5"), desc: "不识庐山真面目，只缘身在此山中。", rating: getRating("庐山"), popularity: getPopularity("庐山") },
  { name: "婺源", lat: 29.25, lng: 117.86, district: "婺源县", city: "上饶市", province: "江西省", tags: ["油菜花", "古村落"], imgUrl: getUnsplashUrl("婺源", "1548013146-02c942cbd6b5"), desc: "中国最美乡村，春日油菜花海。", rating: getRating("婺源"), popularity: getPopularity("婺源") },
  { name: "井冈山", lat: 26.48, lng: 114.15, district: "井冈山市", city: "吉安市", province: "江西省", tags: ["红色", "革命"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "中国革命的摇篮，红色圣地。", rating: getRating("井冈山"), popularity: getPopularity("井冈山") },
  { name: "三清山", lat: 28.92, lng: 118.07, district: "玉山县", city: "上饶市", province: "江西省", tags: ["道教", "花岗岩"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "江南第一仙峰，天下无双福地。", rating: getRating("三清山"), popularity: getPopularity("三清山") },
  { name: "龙虎山", lat: 28.12, lng: 117.02, district: "贵溪市", city: "鹰潭市", province: "江西省", tags: ["道教", "丹霞"], imgUrl: getUnsplashUrl("武夷山", "1548013146-02c942cbd6b5"), desc: "道教祖庭，丹霞仙境。", rating: getRating("龙虎山"), popularity: getPopularity("龙虎山") },
  { name: "滕王阁", lat: 28.68, lng: 115.88, district: "东湖区", city: "南昌市", province: "江西省", tags: ["名楼", "江南"], imgUrl: getUnsplashUrl("岳阳楼", "1548013146-02c942cbd6b5"), desc: "江南三大名楼之一，落霞与孤鹜齐飞。", rating: getRating("滕王阁"), popularity: getPopularity("滕王阁") },
  { name: "景德镇", lat: 29.27, lng: 117.21, district: "珠山区", city: "景德镇市", province: "江西省", tags: ["陶瓷", "古镇"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "瓷都，千年窑火，世界陶瓷圣地。", rating: getRating("景德镇"), popularity: getPopularity("景德镇") },
  { name: "鄱阳湖", lat: 29.12, lng: 116.28, district: "鄱阳县", city: "上饶市", province: "江西省", tags: ["湖泊", "候鸟"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "中国第一大淡水湖，候鸟天堂。", rating: getRating("鄱阳湖"), popularity: getPopularity("鄱阳湖") },
  { name: "武功山", lat: 27.45, lng: 114.17, district: "芦溪县", city: "萍乡市", province: "江西省", tags: ["草甸", "云海"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "云中草原，户外天堂。", rating: getRating("武功山"), popularity: getPopularity("武功山") },
  { name: "瑶里古镇", lat: 29.55, lng: 117.62, district: "浮梁县", city: "景德镇市", province: "江西省", tags: ["古镇", "瓷源"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "瓷都之源，茶乡古镇。", rating: getRating("瑶里古镇"), popularity: getPopularity("瑶里古镇") },

  // 贵州省 (10个)
  { name: "黄果树瀑布", lat: 25.99, lng: 105.67, district: "镇宁县", city: "安顺市", province: "贵州省", tags: ["瀑布", "自然"], imgUrl: getUnsplashUrl("黄果树瀑布", "1548013146-02c942cbd6b5"), desc: "亚洲最大瀑布，气势磅礴。", rating: getRating("黄果树瀑布"), popularity: getPopularity("黄果树瀑布") },
  { name: "西江千户苗寨", lat: 26.5, lng: 108.17, district: "雷山县", city: "黔东南州", province: "贵州省", tags: ["苗族", "夜景"], imgUrl: getUnsplashUrl("西江千户苗寨", "1548013146-02c942cbd6b5"), desc: "世界最大苗寨，万家灯火如星河。", rating: getRating("西江千户苗寨"), popularity: getPopularity("西江千户苗寨") },
  { name: "荔波小七孔", lat: 25.42, lng: 107.88, district: "荔波县", city: "黔南州", province: "贵州省", tags: ["喀斯特", "碧水"], imgUrl: getUnsplashUrl("九寨沟", "1548013146-02c942cbd6b5"), desc: "地球腰带上的绿宝石，超级盆景。", rating: getRating("荔波小七孔"), popularity: getPopularity("荔波小七孔") },
  { name: "梵净山", lat: 27.91, lng: 108.70, district: "江口县", city: "铜仁市", province: "贵州省", tags: ["佛教", "蘑菇石"], imgUrl: getUnsplashUrl("峨眉山", "1548013146-02c942cbd6b5"), desc: "天空之城，贵州第一名山。", rating: getRating("梵净山"), popularity: getPopularity("梵净山") },
  { name: "镇远古镇", lat: 27.05, lng: 108.42, district: "镇远县", city: "黔东南州", province: "贵州省", tags: ["古镇", "太极"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "滇楚锁钥，黔东门户，太极古镇。", rating: getRating("镇远古镇"), popularity: getPopularity("镇远古镇") },
  { name: "织金洞", lat: 26.78, lng: 105.90, district: "织金县", city: "毕节市", province: "贵州省", tags: ["溶洞", "奇观"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "溶洞之王，地下艺术宫殿。", rating: getRating("织金洞"), popularity: getPopularity("织金洞") },
  { name: "马岭河峡谷", lat: 25.15, lng: 104.95, district: "兴义市", city: "黔西南州", province: "贵州省", tags: ["峡谷", "瀑布群"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "地球上最美丽的伤疤。", rating: getRating("马岭河峡谷"), popularity: getPopularity("马岭河峡谷") },
  { name: "肇兴侗寨", lat: 25.91, lng: 109.17, district: "黎平县", city: "黔东南州", province: "贵州省", tags: ["侗族", "鼓楼"], imgUrl: getUnsplashUrl("西江千户苗寨", "1548013146-02c942cbd6b5"), desc: "侗乡第一寨，鼓楼之乡。", rating: getRating("肇兴侗寨"), popularity: getPopularity("肇兴侗寨") },
  { name: "百里杜鹃", lat: 27.15, lng: 105.85, district: "大方县", city: "毕节市", province: "贵州省", tags: ["花海", "杜鹃"], imgUrl: getUnsplashUrl("罗平油菜花", "1548013146-02c942cbd6b5"), desc: "世界上最大的天然杜鹃花园。", rating: getRating("百里杜鹃"), popularity: getPopularity("百里杜鹃") },
  { name: "青岩古镇", lat: 26.33, lng: 106.68, district: "花溪区", city: "贵阳市", province: "贵州省", tags: ["古镇", "军事"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "贵州四大古镇之一，明清军事要塞。", rating: getRating("青岩古镇"), popularity: getPopularity("青岩古镇") },

  // 湖北省 (10个)
  { name: "黄鹤楼", lat: 30.55, lng: 114.30, district: "武昌区", city: "武汉市", province: "湖北省", tags: ["名楼", "长江"], imgUrl: getUnsplashUrl("岳阳楼", "1548013146-02c942cbd6b5"), desc: "天下江山第一楼，江南三大名楼之首。", rating: getRating("黄鹤楼"), popularity: getPopularity("黄鹤楼") },
  { name: "武当山", lat: 32.40, lng: 111.00, district: "丹江口市", city: "十堰市", province: "湖北省", tags: ["道教", "武术"], imgUrl: getUnsplashUrl("峨眉山", "1548013146-02c942cbd6b5"), desc: "亘古无双胜境，天下第一仙山。", rating: getRating("武当山"), popularity: getPopularity("武当山") },
  { name: "三峡大坝", lat: 30.82, lng: 111.00, district: "夷陵区", city: "宜昌市", province: "湖北省", tags: ["水利", "工程"], imgUrl: getUnsplashUrl("都江堰", "1548013146-02c942cbd6b5"), desc: "世界第一大水利工程，高峡出平湖。", rating: getRating("三峡大坝"), popularity: getPopularity("三峡大坝") },
  { name: "神农架", lat: 31.75, lng: 110.67, district: "神农架林区", city: "神农架林区", province: "湖北省", tags: ["原始森林", "野人"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "华中屋脊，物种基因库。", rating: getRating("神农架"), popularity: getPopularity("神农架") },
  { name: "恩施大峡谷", lat: 30.32, lng: 109.48, district: "恩施市", city: "恩施州", province: "湖北省", tags: ["峡谷", "喀斯特"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "东方科罗拉多，清江画廊。", rating: getRating("恩施大峡谷"), popularity: getPopularity("恩施大峡谷") },
  { name: "东湖", lat: 30.55, lng: 114.40, district: "武昌区", city: "武汉市", province: "湖北省", tags: ["湖泊", "樱花"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "中国第二大城中湖，武汉绿心。", rating: getRating("东湖"), popularity: getPopularity("东湖") },
  { name: "古隆中", lat: 32.02, lng: 112.00, district: "襄城区", city: "襄阳市", province: "湖北省", tags: ["三国", "诸葛亮"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "三顾茅庐，隆中对发生地。", rating: getRating("古隆中"), popularity: getPopularity("古隆中") },
  { name: "赤壁", lat: 29.72, lng: 113.88, district: "赤壁市", city: "咸宁市", province: "湖北省", tags: ["三国", "古战场"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "赤壁之战发生地，三国文化。", rating: getRating("赤壁"), popularity: getPopularity("赤壁") },
  { name: "户部巷", lat: 30.55, lng: 114.30, district: "武昌区", city: "武汉市", province: "湖北省", tags: ["美食", "汉味"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "汉味小吃第一巷，过早文化。", rating: getRating("户部巷"), popularity: getPopularity("户部巷") },
  { name: "明显陵", lat: 31.35, lng: 112.58, district: "钟祥市", city: "荆门市", province: "湖北省", tags: ["陵墓", "明代"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "中南六省唯一明代帝王陵，一陵两冢。", rating: getRating("明显陵"), popularity: getPopularity("明显陵") },

  // 河北省 (8个)
  { name: "承德避暑山庄", lat: 40.98, lng: 117.93, district: "双桥区", city: "承德市", province: "河北省", tags: ["皇家", "园林"], imgUrl: getUnsplashUrl("颐和园", "1548013146-02c942cbd6b5"), desc: "中国四大名园之一，清代皇帝避暑行宫。", rating: getRating("承德避暑山庄"), popularity: getPopularity("承德避暑山庄") },
  { name: "北戴河", lat: 39.83, lng: 119.48, district: "北戴河区", city: "秦皇岛市", province: "河北省", tags: ["海滨", "避暑"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "中国夏都，北方避暑胜地。", rating: getRating("北戴河"), popularity: getPopularity("北戴河") },
  { name: "山海关", lat: 40.00, lng: 119.75, district: "山海关区", city: "秦皇岛市", province: "河北省", tags: ["长城", "雄关"], imgUrl: getUnsplashUrl("长城", "1548013146-02c942cbd6b5"), desc: "天下第一关，长城起点。", rating: getRating("山海关"), popularity: getPopularity("山海关") },
  { name: "白洋淀", lat: 38.94, lng: 115.98, district: "安新县", city: "保定市", province: "河北省", tags: ["湿地", "荷花"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "华北明珠，北国江南。", rating: getRating("白洋淀"), popularity: getPopularity("白洋淀") },
  { name: "西柏坡", lat: 38.37, lng: 113.95, district: "平山县", city: "石家庄市", province: "河北省", tags: ["红色", "革命"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "新中国从这里走来，革命圣地。", rating: getRating("西柏坡"), popularity: getPopularity("西柏坡") },
  { name: "清东陵", lat: 40.18, lng: 117.65, district: "遵化市", city: "唐山市", province: "河北省", tags: ["陵墓", "清代"], imgUrl: getUnsplashUrl("明孝陵", "1548013146-02c942cbd6b5"), desc: "中国现存规模最宏大、体系最完整的帝王陵墓群。", rating: getRating("清东陵"), popularity: getPopularity("清东陵") },
  { name: "野三坡", lat: 39.65, lng: 115.42, district: "涞水县", city: "保定市", province: "河北省", tags: ["山水", "峡谷"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "北方小桂林，世外桃源。", rating: getRating("野三坡"), popularity: getPopularity("野三坡") },
  { name: "赵州桥", lat: 37.72, lng: 114.77, district: "赵县", city: "石家庄市", province: "河北省", tags: ["古桥", "隋代"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "天下第一桥，世界最古老的石拱桥。", rating: getRating("赵州桥"), popularity: getPopularity("赵州桥") },

  // 山西省 (8个)
  { name: "平遥古城", lat: 37.20, lng: 112.18, district: "平遥县", city: "晋中市", province: "山西省", tags: ["古城", "金融"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "中国保存最完整的古城，明清金融中心。", rating: getRating("平遥古城"), popularity: getPopularity("平遥古城") },
  { name: "云冈石窟", lat: 40.11, lng: 113.13, district: "云冈区", city: "大同市", province: "山西省", tags: ["石窟", "佛教"], imgUrl: getUnsplashUrl("敦煌莫高窟", "1548013146-02c942cbd6b5"), desc: "中国四大石窟之一，北魏皇家石窟。", rating: getRating("云冈石窟"), popularity: getPopularity("云冈石窟") },
  { name: "五台山", lat: 39.07, lng: 113.58, district: "五台县", city: "忻州市", province: "山西省", tags: ["佛教", "圣地"], imgUrl: getUnsplashUrl("普陀山", "1548013146-02c942cbd6b5"), desc: "中国佛教四大名山之首，文殊菩萨道场。", rating: getRating("五台山"), popularity: getPopularity("五台山") },
  { name: "乔家大院", lat: 37.42, lng: 112.45, district: "祁县", city: "晋中市", province: "山西省", tags: ["民居", "晋商"], imgUrl: getUnsplashUrl("宏村", "1548013146-02c942cbd6b5"), desc: "北方民居建筑的一颗明珠，晋商文化。", rating: getRating("乔家大院"), popularity: getPopularity("乔家大院") },
  { name: "悬空寺", lat: 39.65, lng: 113.70, district: "浑源县", city: "大同市", province: "山西省", tags: ["寺庙", "悬空"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "悬空寺，半天高，三根马尾空中吊。", rating: getRating("悬空寺"), popularity: getPopularity("悬空寺") },
  { name: "壶口瀑布晋", lat: 36.15, lng: 110.45, district: "吉县", city: "临汾市", province: "山西省", tags: ["瀑布", "黄河"], imgUrl: getUnsplashUrl("黄果树瀑布", "1548013146-02c942cbd6b5"), desc: "黄河之水天上来，千里黄河一壶收。", rating: getRating("壶口瀑布晋"), popularity: getPopularity("壶口瀑布晋") },
  { name: "晋祠", lat: 37.72, lng: 112.43, district: "晋源区", city: "太原市", province: "山西省", tags: ["园林", "宋代"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "中国现存最早的皇家园林，晋文化发祥地。", rating: getRating("晋祠"), popularity: getPopularity("晋祠") },
  { name: "雁门关", lat: 39.20, lng: 112.43, district: "代县", city: "忻州市", province: "山西省", tags: ["长城", "雄关"], imgUrl: getUnsplashUrl("长城", "1548013146-02c942cbd6b5"), desc: "中华第一关，天下九塞，雁门为首。", rating: getRating("雁门关"), popularity: getPopularity("雁门关") },

  // 辽宁省 (8个)
  { name: "沈阳故宫", lat: 41.80, lng: 123.43, district: "沈河区", city: "沈阳市", province: "辽宁省", tags: ["皇宫", "清代"], imgUrl: getUnsplashUrl("故宫", "1548013146-02c942cbd6b5"), desc: "中国现存第二大宫殿建筑群，清初皇宫。", rating: getRating("沈阳故宫"), popularity: getPopularity("沈阳故宫") },
  { name: "大连星海广场", lat: 38.87, lng: 121.68, district: "沙河口区", city: "大连市", province: "辽宁省", tags: ["广场", "海滨"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "亚洲最大的城市广场，大连地标。", rating: getRating("大连星海广场"), popularity: getPopularity("大连星海广场") },
  { name: "千山", lat: 41.03, lng: 123.12, district: "千山区", city: "鞍山市", province: "辽宁省", tags: ["佛教", "道教"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "东北明珠，无峰不奇，无石不峭。", rating: getRating("千山"), popularity: getPopularity("千山") },
  { name: "本溪水洞", lat: 41.30, lng: 124.08, district: "本溪满族自治县", city: "本溪市", province: "辽宁省", tags: ["溶洞", "地下河"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "亚洲最长的地下水溶洞，九曲银河。", rating: getRating("本溪水洞"), popularity: getPopularity("本溪水洞") },
  { name: "老虎滩", lat: 38.87, lng: 121.68, district: "中山区", city: "大连市", province: "辽宁省", tags: ["海洋", "公园"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "中国最大的一座现代化海滨游乐场。", rating: getRating("老虎滩"), popularity: getPopularity("老虎滩") },
  { name: "金石滩", lat: 39.10, lng: 122.02, district: "金州区", city: "大连市", province: "辽宁省", tags: ["地质", "海岸"], imgUrl: getUnsplashUrl("三亚湾", "1548013146-02c942cbd6b5"), desc: "神力雕塑公园，天然地质博物馆。", rating: getRating("金石滩"), popularity: getPopularity("金石滩") },
  { name: "鸭绿江", lat: 40.12, lng: 124.38, district: "振兴区", city: "丹东市", province: "辽宁省", tags: ["边境", "断桥"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "中朝界河，抗美援朝见证。", rating: getRating("鸭绿江"), popularity: getPopularity("鸭绿江") },
  { name: "红海滩", lat: 41.05, lng: 122.08, district: "大洼区", city: "盘锦市", province: "辽宁省", tags: ["湿地", "红色"], imgUrl: getUnsplashUrl("东川红土地", "1548013146-02c942cbd6b5"), desc: "世界红色海岸线，碱蓬草奇观。", rating: getRating("红海滩"), popularity: getPopularity("红海滩") },

  // 吉林省 (6个)
  { name: "长白山", lat: 42.00, lng: 128.00, district: "安图县", city: "延边州", province: "吉林省", tags: ["火山", "天池"], imgUrl: getUnsplashUrl("天山天池", "1548013146-02c942cbd6b5"), desc: "关东第一山，天池仙境。", rating: getRating("长白山"), popularity: getPopularity("长白山") },
  { name: "伪满皇宫", lat: 43.85, lng: 125.35, district: "宽城区", city: "长春市", province: "吉林省", tags: ["历史", "建筑"], imgUrl: getUnsplashUrl("故宫", "1548013146-02c942cbd6b5"), desc: "末代皇帝溥仪的宫殿，近代史见证。", rating: getRating("伪满皇宫"), popularity: getPopularity("伪满皇宫") },
  { name: "雾凇岛", lat: 43.32, lng: 126.55, district: "龙潭区", city: "吉林市", province: "吉林省", tags: ["雾凇", "冰雪"], imgUrl: getUnsplashUrl("天山天池", "1548013146-02c942cbd6b5"), desc: "中国四大自然奇观之一，雾凇之都。", rating: getRating("雾凇岛"), popularity: getPopularity("雾凇岛") },
  { name: "净月潭", lat: 43.82, lng: 125.45, district: "南关区", city: "长春市", province: "吉林省", tags: ["森林", "湖泊"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "亚洲最大的人工林海，绿海明珠。", rating: getRating("净月潭"), popularity: getPopularity("净月潭") },
  { name: "查干湖", lat: 45.28, lng: 124.28, district: "前郭尔罗斯蒙古族自治县", city: "松原市", province: "吉林省", tags: ["湖泊", "冬捕"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "中国北方最后的渔猎部落，冬捕奇观。", rating: getRating("查干湖"), popularity: getPopularity("查干湖") },
  { name: "高句丽", lat: 41.12, lng: 126.18, district: "集安市", city: "通化市", province: "吉林省", tags: ["遗址", "世界遗产"], imgUrl: getUnsplashUrl("兵马俑", "1548013146-02c942cbd6b5"), desc: "东方金字塔，高句丽王城王陵。", rating: getRating("高句丽"), popularity: getPopularity("高句丽") },

  // 黑龙江省 (6个)
  { name: "冰雪大世界", lat: 45.75, lng: 126.55, district: "松北区", city: "哈尔滨市", province: "黑龙江省", tags: ["冰雪", "雕塑"], imgUrl: getUnsplashUrl("天山天池", "1548013146-02c942cbd6b5"), desc: "世界最大冰雪主题乐园，冰雪童话王国。", rating: getRating("冰雪大世界"), popularity: getPopularity("冰雪大世界") },
  { name: "太阳岛", lat: 45.78, lng: 126.55, district: "松北区", city: "哈尔滨市", province: "黑龙江省", tags: ["湿地", "避暑"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "哈尔滨明珠，避暑胜地。", rating: getRating("太阳岛"), popularity: getPopularity("太阳岛") },
  { name: "五大连池", lat: 48.65, lng: 126.12, district: "五大连池市", city: "黑河市", province: "黑龙江省", tags: ["火山", "矿泉"], imgUrl: getUnsplashUrl("天山天池", "1548013146-02c942cbd6b5"), desc: "世界地质公园，火山地貌博物馆。", rating: getRating("五大连池"), popularity: getPopularity("五大连池") },
  { name: "镜泊湖", lat: 44.05, lng: 128.92, district: "宁安市", city: "牡丹江市", province: "黑龙江省", tags: ["湖泊", "瀑布"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "中国最大高山堰塞湖，吊水楼瀑布。", rating: getRating("镜泊湖"), popularity: getPopularity("镜泊湖") },
  { name: "雪乡", lat: 44.33, lng: 128.25, district: "大海林林业局", city: "牡丹江市", province: "黑龙江省", tags: ["雪景", "童话"], imgUrl: getUnsplashUrl("天山天池", "1548013146-02c942cbd6b5"), desc: "中国雪乡，童话世界。", rating: getRating("雪乡"), popularity: getPopularity("雪乡") },
  { name: "扎龙湿地", lat: 47.20, lng: 124.20, district: "铁锋区", city: "齐齐哈尔市", province: "黑龙江省", tags: ["湿地", "丹顶鹤"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "世界最大芦苇湿地，丹顶鹤故乡。", rating: getRating("扎龙湿地"), popularity: getPopularity("扎龙湿地") },

  // 内蒙古自治区 (6个)
  { name: "呼伦贝尔草原", lat: 49.20, lng: 119.70, district: "海拉尔区", city: "呼伦贝尔市", province: "内蒙古自治区", tags: ["草原", "牧场"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "中国最美草原，风吹草低见牛羊。", rating: getRating("呼伦贝尔草原"), popularity: getPopularity("呼伦贝尔草原") },
  { name: "响沙湾", lat: 40.22, lng: 109.95, district: "达拉特旗", city: "鄂尔多斯市", province: "内蒙古自治区", tags: ["沙漠", "响沙"], imgUrl: getUnsplashUrl("鸣沙山月牙泉", "1548013146-02c942cbd6b5"), desc: "沙漠中的迪士尼，会唱歌的沙子。", rating: getRating("响沙湾"), popularity: getPopularity("响沙湾") },
  { name: "成吉思汗陵", lat: 39.38, lng: 109.78, district: "伊金霍洛旗", city: "鄂尔多斯市", province: "内蒙古自治区", tags: ["陵墓", "蒙古"], imgUrl: getUnsplashUrl("中山陵", "1548013146-02c942cbd6b5"), desc: "一代天骄，蒙古民族圣地。", rating: getRating("成吉思汗陵"), popularity: getPopularity("成吉思汗陵") },
  { name: "阿尔山", lat: 47.18, lng: 119.95, district: "阿尔山市", city: "兴安盟", province: "内蒙古自治区", tags: ["森林", "温泉"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "中国瑞士，火山温泉地质公园。", rating: getRating("阿尔山"), popularity: getPopularity("阿尔山") },
  { name: "额济纳胡杨林", lat: 41.95, lng: 101.08, district: "额济纳旗", city: "阿拉善盟", province: "内蒙古自治区", tags: ["胡杨", "秋色"], imgUrl: getUnsplashUrl("罗平油菜花", "1548013146-02c942cbd6b5"), desc: "三千年不死，三千年不倒，三千年不朽。", rating: getRating("额济纳胡杨林"), popularity: getPopularity("额济纳胡杨林") },
  { name: "满洲里", lat: 49.60, lng: 117.43, district: "满洲里市", city: "呼伦贝尔市", province: "内蒙古自治区", tags: ["边境", "俄罗斯"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "东亚之窗，中俄蒙风情。", rating: getRating("满洲里"), popularity: getPopularity("满洲里") },

  // 宁夏回族自治区 (4个)
  { name: "沙坡头", lat: 37.50, lng: 104.98, district: "沙坡头区", city: "中卫市", province: "宁夏回族自治区", tags: ["沙漠", "黄河"], imgUrl: getUnsplashUrl("鸣沙山月牙泉", "1548013146-02c942cbd6b5"), desc: "大漠孤烟直，长河落日圆。", rating: getRating("沙坡头"), popularity: getPopularity("沙坡头") },
  { name: "西夏王陵", lat: 38.48, lng: 106.03, district: "西夏区", city: "银川市", province: "宁夏回族自治区", tags: ["陵墓", "西夏"], imgUrl: getUnsplashUrl("明孝陵", "1548013146-02c942cbd6b5"), desc: "东方金字塔，西夏王朝皇家陵园。", rating: getRating("西夏王陵"), popularity: getPopularity("西夏王陵") },
  { name: "镇北堡", lat: 38.58, lng: 106.12, district: "西夏区", city: "银川市", province: "宁夏回族自治区", tags: ["影视", "古堡"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "中国西部影视城，大话西游取景地。", rating: getRating("镇北堡"), popularity: getPopularity("镇北堡") },
  { name: "沙湖", lat: 38.82, lng: 106.35, district: "平罗县", city: "石嘴山市", province: "宁夏回族自治区", tags: ["湖泊", "沙漠"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "塞上江南，沙水相依。", rating: getRating("沙湖"), popularity: getPopularity("沙湖") },

  // 青海省 (4个)
  { name: "青海湖", lat: 36.99, lng: 100.20, district: "共和县", city: "海南州", province: "青海省", tags: ["湖泊", "油菜花"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "中国最大内陆湖，高原蓝宝石。", rating: getRating("青海湖"), popularity: getPopularity("青海湖") },
  { name: "茶卡盐湖", lat: 36.80, lng: 99.10, district: "乌兰县", city: "海西州", province: "青海省", tags: ["盐湖", "天空之镜"], imgUrl: getUnsplashUrl("西湖", "1548013146-02c942cbd6b5"), desc: "天空之镜，人一生必去的55个地方之一。", rating: getRating("茶卡盐湖"), popularity: getPopularity("茶卡盐湖") },
  { name: "塔尔寺", lat: 36.48, lng: 101.57, district: "湟中区", city: "西宁市", province: "青海省", tags: ["佛教", "艺术"], imgUrl: getUnsplashUrl("灵隐寺", "1548013146-02c942cbd6b5"), desc: "藏传佛教格鲁派六大寺院之一，艺术三绝。", rating: getRating("塔尔寺"), popularity: getPopularity("塔尔寺") },
  { name: "可可西里", lat: 35.22, lng: 91.10, district: "格尔木市", city: "海西州", province: "青海省", tags: ["无人区", "藏羚羊"], imgUrl: getUnsplashUrl("稻城亚丁", "1548013146-02c942cbd6b5"), desc: "世界自然遗产，藏羚羊的故乡。", rating: getRating("可可西里"), popularity: getPopularity("可可西里") },

  // 重庆市 (6个)
  { name: "洪崖洞", lat: 29.56, lng: 106.57, district: "渝中区", city: "重庆市", province: "重庆市", tags: ["夜景", "吊脚楼"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "千与千寻现实版，山城夜景名片。", rating: getRating("洪崖洞"), popularity: getPopularity("洪崖洞") },
  { name: "武隆天坑", lat: 29.42, lng: 107.35, district: "武隆区", city: "重庆市", province: "重庆市", tags: ["天坑", "喀斯特"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "世界自然遗产，变形金刚取景地。", rating: getRating("武隆天坑"), popularity: getPopularity("武隆天坑") },
  { name: "大足石刻", lat: 29.70, lng: 105.72, district: "大足区", city: "重庆市", province: "重庆市", tags: ["石刻", "佛教"], imgUrl: getUnsplashUrl("敦煌莫高窟", "1548013146-02c942cbd6b5"), desc: "世界石刻艺术之瑰宝。", rating: getRating("大足石刻"), popularity: getPopularity("大足石刻") },
  { name: "长江三峡", lat: 30.77, lng: 111.00, district: "巫山县", city: "重庆市", province: "重庆市", tags: ["峡谷", "长江"], imgUrl: getUnsplashUrl("张家界", "1548013146-02c942cbd6b5"), desc: "两岸猿声啼不住，轻舟已过万重山。", rating: getRating("长江三峡"), popularity: getPopularity("长江三峡") },
  { name: "磁器口", lat: 29.58, lng: 106.45, district: "沙坪坝区", city: "重庆市", province: "重庆市", tags: ["古镇", "美食"], imgUrl: getUnsplashUrl("凤凰古城", "1548013146-02c942cbd6b5"), desc: "千年古镇，巴渝风情。", rating: getRating("磁器口"), popularity: getPopularity("磁器口") },
  { name: "解放碑", lat: 29.56, lng: 106.55, district: "渝中区", city: "重庆市", province: "重庆市", tags: ["地标", "商圈"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "抗战胜利纪功碑，重庆地标。", rating: getRating("解放碑"), popularity: getPopularity("解放碑") },

  // 天津市 (4个)
  { name: "天津之眼", lat: 39.13, lng: 117.18, district: "红桥区", city: "天津市", province: "天津市", tags: ["摩天轮", "夜景"], imgUrl: getUnsplashUrl("东方明珠", "1548013146-02c942cbd6b5"), desc: "世界上唯一建在桥上的摩天轮。", rating: getRating("天津之眼"), popularity: getPopularity("天津之眼") },
  { name: "古文化街", lat: 39.13, lng: 117.18, district: "南开区", city: "天津市", province: "天津市", tags: ["古街", "民俗"], imgUrl: getUnsplashUrl("豫园", "1548013146-02c942cbd6b5"), desc: "津门故里，天津卫的发祥地。", rating: getRating("古文化街"), popularity: getPopularity("古文化街") },
  { name: "五大道", lat: 39.11, lng: 117.20, district: "和平区", city: "天津市", province: "天津市", tags: ["建筑", "租界"], imgUrl: getUnsplashUrl("外滩", "1548013146-02c942cbd6b5"), desc: "万国建筑博览馆，小洋楼群。", rating: getRating("五大道"), popularity: getPopularity("五大道") },
  { name: "盘山", lat: 40.08, lng: 117.28, district: "蓟州区", city: "天津市", province: "天津市", tags: ["山水", "乾隆"], imgUrl: getUnsplashUrl("雁荡山", "1548013146-02c942cbd6b5"), desc: "京东第一山，乾隆巡幸32次。", rating: getRating("盘山"), popularity: getPopularity("盘山") },
];

/**
 * Haversine公式计算球面距离(单位:公里)
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * 根据筛选条件过滤景点
 */
export function filterSpots(
  spots: Spot[],
  userLocation: { lat: number; lng: number } | null,
  distanceRange: string | null,
  regionRange: string,
  userRegion: { district: string; city: string; province: string }
): Spot[] {
  let filtered = [...spots];

  // 按距离筛选
  if (distanceRange && userLocation) {
    const maxDist = parseInt(distanceRange);
    filtered = filtered.filter((spot) => {
      const dist = haversineDistance(
        userLocation.lat,
        userLocation.lng,
        spot.lat,
        spot.lng
      );
      return dist <= maxDist;
    });
  } else if (regionRange !== "nationwide") {
    // 按行政区域筛选（仅在没有选择距离时生效）
    if (regionRange === "district" && userRegion.district) {
      filtered = filtered.filter((s) => s.district === userRegion.district);
    } else if (regionRange === "city" && userRegion.city) {
      filtered = filtered.filter((s) => s.city === userRegion.city);
    } else if (regionRange === "province" && userRegion.province) {
      filtered = filtered.filter((s) => s.province === userRegion.province);
    }
  }
  // regionRange === "nationwide" 时不做任何过滤，返回全部

  // 无结果时返回全部
  return filtered.length > 0 ? filtered : spots;
}

/**
 * 随机选择一个景点
 */
export function pickRandomSpot(spots: Spot[]): Spot {
  const index = Math.floor(Math.random() * spots.length);
  return spots[index];
}

/**
 * 清除已展示记录（当无可用景点时）
 */
export function clearShownSpots(): void {
  try {
    const stored = localStorage.getItem("spot-recommender-daily-usage");
    if (stored) {
      const usage = JSON.parse(stored);
      usage.shownSpots = [];
      localStorage.setItem("spot-recommender-daily-usage", JSON.stringify(usage));
    }
  } catch {
    // ignore
  }
}