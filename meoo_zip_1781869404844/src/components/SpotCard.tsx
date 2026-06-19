import { useState, useEffect } from "react";
import { RefreshCw, ThumbsDown, CheckCircle2, MapPin, Star, Share2, Flame, X } from "lucide-react";
import type { Spot } from "@/lib/spots";

interface SpotCardProps {
  spot: Spot;
  distance?: number;
  onRetry: () => void;
  onExclude: (name: string, reason: "not_interested" | "visited") => void;
}

// 生成分享卡片内容
function generateShareContent(spot: Spot, distance?: number): string {
  const distanceText = distance ? `，距离我 ${distance.toFixed(1)}km` : "";
  return `🎯 章章的随机游玩推荐\n\n📍 ${spot.name}\n📮 ${spot.province} ${spot.city}\n⭐ 评分 ${spot.rating?.toFixed(1) || "4.5"}/5.0\n🔥 热度 ${spot.popularity || 50}/100\n\n${spot.desc}${distanceText}\n\n🏷️ ${spot.tags.join(" ")}`;
}

export function SpotCard({ spot, distance, onRetry, onExclude }: SpotCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // 入场动画
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    const content = generateShareContent(spot, distance);
    
    // 尝试使用原生分享API
    if (navigator.share) {
      try {
        await navigator.share({
          title: `推荐：${spot.name}`,
          text: content,
        });
        return;
      } catch {
        // 用户取消分享，继续显示模态框
      }
    }
    
    // 显示分享模态框
    setShowShareModal(true);
  };

  const handleCopy = async () => {
    const content = generateShareContent(spot, distance);
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 复制失败
    }
  };

  // 热度等级颜色
  const getPopularityColor = (popularity: number = 50) => {
    if (popularity >= 80) return "text-red-500";
    if (popularity >= 60) return "text-orange-500";
    if (popularity >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  // 热度等级文字
  const getPopularityText = (popularity: number = 50) => {
    if (popularity >= 80) return "超热门";
    if (popularity >= 60) return "热门";
    if (popularity >= 40) return "一般";
    return "小众";
  };

  return (
    <>
      <div 
        className={`border-t pt-4 mt-4 transition-all duration-500 ease-out transform ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* 景点图片 */}
        <div className="w-full h-56 bg-secondary mb-4 overflow-hidden rounded-lg relative group">
          {spot.imgUrl ? (
            <>
              <img
                src={spot.imgUrl}
                alt={spot.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* 图片上的热度标签 */}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm flex items-center gap-1 ${getPopularityColor(spot.popularity)}`}>
                  <Flame className="w-3 h-3" />
                  {getPopularityText(spot.popularity)}
                </span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              暂无图片
            </div>
          )}
        </div>

        {/* 内容区 */}
        <div className="space-y-3">
          {/* 标题和评分 */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">{spot.name}</h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{spot.province} · {spot.city}</span>
                {distance !== undefined && (
                  <span className="text-primary">· {distance.toFixed(1)}km</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-md">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">{spot.rating?.toFixed(1) || "4.5"}</span>
            </div>
          </div>

          {/* 描述 */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {spot.desc}
          </p>

          {/* 标签 */}
          <div className="flex gap-2 flex-wrap">
            {spot.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 操作按钮组 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onExclude(spot.name, "not_interested")}
              className="flex-1 border rounded-md py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors text-muted-foreground"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              不感兴趣
            </button>
            <button
              onClick={() => onExclude(spot.name, "visited")}
              className="flex-1 border rounded-md py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors text-muted-foreground"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              已去过
            </button>
            <button
              onClick={handleShare}
              className="flex-1 border rounded-md py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-secondary transition-colors text-muted-foreground"
            >
              <Share2 className="w-3.5 h-3.5" />
              分享
            </button>
            <button
              onClick={onRetry}
              className="flex-1 bg-primary text-primary-foreground rounded-md py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              换一个
            </button>
          </div>
        </div>
      </div>

      {/* 分享模态框 */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-background rounded-lg p-5 max-w-sm w-full shadow-xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">分享景点</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-secondary rounded-lg p-4 mb-4">
              <p className="text-sm whitespace-pre-line">{generateShareContent(spot, distance)}</p>
            </div>
            
            <button
              onClick={handleCopy}
              className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {copied ? "已复制到剪贴板！" : "复制分享文案"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
