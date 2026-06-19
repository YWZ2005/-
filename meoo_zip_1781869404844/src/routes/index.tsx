import { useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LocationInfo } from "@/components/LocationInfo";
import { FilterButtons } from "@/components/FilterButtons";
import { SpotCard } from "@/components/SpotCard";
import { MOCK_SPOTS, filterSpots, pickRandomSpot, haversineDistance, type Spot } from "@/lib/spots";
import { searchPoi, isAmapConfigured, type AmapPoi } from "@/lib/amap";
import { useExcludedSpots } from "@/hooks/useExcludedSpots";
import { useDailyLimit } from "@/hooks/useDailyLimit";

export const Route = createFileRoute("/")({
  component: Index,
});

/** 将高德POI转为统一Spot格式 */
function poiToSpot(poi: AmapPoi): Spot {
  return {
    name: poi.name,
    lat: poi.lat,
    lng: poi.lng,
    district: poi.district,
    city: poi.city,
    province: poi.province,
    tags: poi.tags,
    imgUrl: poi.imgUrl,
    desc: poi.desc,
  };
}

function Index() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userRegion, setUserRegion] = useState({ district: "", city: "", province: "" });
  const [distanceRange, setDistanceRange] = useState<string | null>(null);
  const [regionRange, setRegionRange] = useState("district");
  const [currentSpot, setCurrentSpot] = useState<Spot | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { excludeSpot, excludedNames } = useExcludedSpots();
  const { remaining, isLimitReached, consumeOne, dailyLimit, shownSpots, clearShownSpots } = useDailyLimit();

  const handleLocationUpdate = useCallback(
    (location: { lat: number; lng: number } | null, region: { district: string; city: string; province: string }) => {
      setUserLocation(location);
      setUserRegion(region);
      if (location) {
        setRegionRange("district");
      } else {
        setRegionRange("nationwide");
      }
    },
    []
  );

  /** 从候选列表中随机选一个未被排除且未展示过的景点 */
  const pickUnexcluded = useCallback(
    (candidates: Spot[]): Spot | null => {
      const shownSet = new Set(shownSpots || []);
      const available = candidates.filter(
        (s) => !excludedNames.includes(s.name) && !shownSet.has(s.name)
      );
      if (available.length === 0) return null;
      return available[Math.floor(Math.random() * available.length)];
    },
    [excludedNames, shownSpots]
  );

  const handleRecommend = useCallback(async () => {
    // 检查每日使用限制
    if (isLimitReached) {
      alert(`今日推荐次数已用完（${dailyLimit}次/天），明天再来吧~`);
      return;
    }

    setLoading(true);

    try {
      let spot: Spot | null = null;

      if (isAmapConfigured()) {
        const radiusMap: Record<string, number> = {
          "5km": 5000,
          "10km": 10000,
          "20km": 20000,
          "50km": 50000,
        };

        const isNationwide = regionRange === "nationwide";
        const isDistanceMode = !!distanceRange;

        let poiCity: string | undefined;
        if (!isNationwide && !isDistanceMode) {
          if (regionRange === "district" || regionRange === "city") {
            poiCity = userRegion.city || undefined;
          } else if (regionRange === "province") {
            poiCity = userRegion.province || undefined;
          }
        }

        // 全国范围时：混合高德API和Mock数据，确保覆盖全国各省份
        if (isNationwide) {
          // 先获取高德数据（不指定城市，全国搜索）
          const pois = await searchPoi("景点", {
            pageSize: 25,
          });

          // 合并高德数据和Mock数据，去重后随机选择
          const amapCandidates = pois.map(poiToSpot);
          const mockCandidates = MOCK_SPOTS;

          // 合并并去重（以name为唯一标识）
          const allCandidates = [...amapCandidates];
          const existingNames = new Set(amapCandidates.map(s => s.name));
          for (const mock of mockCandidates) {
            if (!existingNames.has(mock.name)) {
              allCandidates.push(mock);
            }
          }

          spot = pickUnexcluded(allCandidates);
        } else {
          // 非全国范围：优先高德，无结果时回退Mock
          const pois = await searchPoi("景点", {
            location: isDistanceMode ? (userLocation || undefined) : undefined,
            radius: isDistanceMode && distanceRange ? radiusMap[distanceRange] : undefined,
            city: poiCity,
            pageSize: 25,
          });

          if (pois.length > 0) {
            const candidates = pois.map(poiToSpot);
            spot = pickUnexcluded(candidates);
          }

          // POI无可用结果时回退Mock
          if (!spot) {
            const filtered = filterSpots(MOCK_SPOTS, userLocation, userRegion, distanceRange, regionRange);
            spot = pickUnexcluded(filtered);
          }
        }
      } else {
        const filtered = filterSpots(MOCK_SPOTS, userLocation, userRegion, distanceRange, regionRange);
        spot = pickUnexcluded(filtered);
      }

      if (spot) {
        // 消耗一次使用次数并记录已展示的景点
        if (!consumeOne(spot.name)) {
          alert(`今日推荐次数已用完（${dailyLimit}次/天），明天再来吧~`);
          return;
        }
        setCurrentSpot(spot);
        setIsExpanded(true);
      } else {
        // 所有景点都被排除了，提供智能引导
        const shouldReset = window.confirm(
          "当前范围内的景点都已展示过了！\n\n" +
          "是否清除今日展示记录，重新开始推荐？\n" +
          "（或点击取消，尝试切换筛选范围）"
        );
        if (shouldReset) {
          clearShownSpots();
          // 重新尝试推荐
          handleRecommend();
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  }, [userLocation, userRegion, distanceRange, regionRange, pickUnexcluded, consumeOne, dailyLimit, isLimitReached]);

  const handleExclude = useCallback(
    (name: string, reason: "not_interested" | "visited") => {
      excludeSpot(name, reason);
      // 排除后自动推荐下一个
      handleRecommend();
    },
    [excludeSpot, handleRecommend]
  );

  const currentDistance =
    currentSpot && userLocation
      ? haversineDistance(userLocation.lat, userLocation.lng, currentSpot.lat, currentSpot.lng)
      : undefined;

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full px-5 py-5 flex-1 flex flex-col">
        {/* 标题 */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold mb-1">章章的随机游玩推荐</h1>
          <p className="text-xs text-muted-foreground">
            {isAmapConfigured() ? "基于高德地图 · 实时景点数据" : "随机发现身边的好去处"}
          </p>
        </div>

        {/* 定位信息 */}
        <LocationInfo onLocationUpdate={handleLocationUpdate} />

        {/* 筛选按钮 */}
        <FilterButtons
          distanceRange={distanceRange}
          regionRange={regionRange}
          onDistanceChange={setDistanceRange}
          onRegionChange={setRegionRange}
        />

        {/* 开始筛选按钮 */}
        <button
          onClick={handleRecommend}
          disabled={loading || isLimitReached}
          className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "搜索中..." : isLimitReached ? "今日次数已用完" : `开始筛选（剩余${remaining}次）`}
        </button>

        {/* 结果卡片 */}
        {isExpanded && currentSpot && (
          <SpotCard
            spot={currentSpot}
            distance={currentDistance}
            onRetry={handleRecommend}
            onExclude={handleExclude}
          />
        )}
      </div>
    </div>
  );
}
