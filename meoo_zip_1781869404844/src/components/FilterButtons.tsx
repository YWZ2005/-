interface FilterButtonsProps {
  distanceRange: string | null;
  regionRange: string;
  onDistanceChange: (range: string | null) => void;
  onRegionChange: (region: string) => void;
}

const DISTANCE_OPTIONS = [
  { value: "5km", label: "5公里" },
  { value: "10km", label: "10公里" },
  { value: "20km", label: "20公里" },
  { value: "50km", label: "50公里" },
];

const REGION_OPTIONS = [
  { value: "district", label: "区县" },
  { value: "city", label: "城市" },
  { value: "province", label: "省份" },
  { value: "nationwide", label: "全国" },
];

export function FilterButtons({
  distanceRange,
  regionRange,
  onDistanceChange,
  onRegionChange,
}: FilterButtonsProps) {
  return (
    <div className="space-y-2 mb-4">
      <div>
        <div className="flex gap-2 flex-wrap">
          {DISTANCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onDistanceChange(opt.value);
                onRegionChange("");
              }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                distanceRange === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex gap-2 flex-wrap">
          {REGION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onRegionChange(opt.value);
                onDistanceChange(null);
              }}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                regionRange === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
