import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { reverseGeocode, isAmapConfigured } from "@/lib/amap";

interface LocationInfoProps {
  onLocationUpdate: (
    location: { lat: number; lng: number } | null,
    region: { district: string; city: string; province: string }
  ) => void;
}

export function LocationInfo({ onLocationUpdate }: LocationInfoProps) {
  const [status, setStatus] = useState("正在获取位置...");

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("浏览器不支持定位");
      onLocationUpdate(null, { district: "", city: "", province: "" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        // 尝试调用高德逆地理编码
        if (isAmapConfigured()) {
          setStatus("定位成功，解析地址中...");
          const region = await reverseGeocode(location.lat, location.lng);
          if (region) {
            setStatus(`${region.province} ${region.city} ${region.district}`);
            onLocationUpdate(location, region);
          } else {
            setStatus(`${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`);
            onLocationUpdate(location, { district: "", city: "", province: "" });
          }
        } else {
          // 未配置Key时使用Mock区域
          setStatus(`${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}（未配置高德Key）`);
          onLocationUpdate(location, {
            district: "西湖区",
            city: "杭州市",
            province: "浙江省",
          });
        }
      },
      () => {
        setStatus("定位失败");
        onLocationUpdate(null, { district: "", city: "", province: "" });
      }
    );
  }, [onLocationUpdate]);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
      <MapPin className="w-4 h-4" />
      <span>{status}</span>
    </div>
  );
}
