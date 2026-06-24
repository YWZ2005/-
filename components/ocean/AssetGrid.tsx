import React, { memo, useCallback } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/ui';
import type { AssetConfig, AssetRarity } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 12;
const GRID_PADDING = 16;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

interface AssetGridProps {
  assets: AssetConfig[];
  currentExp: number;
  onAssetPress?: (asset: AssetConfig) => void;
}

const RARITY_COLOR_MAP: Record<AssetRarity, string> = {
  common: 'text-white/60',
  rare: 'text-blue-300',
  epic: 'text-purple-300',
  legendary: 'text-dawn',
};

const RARITY_GLOW_MAP: Record<AssetRarity, string> = {
  common: '#ffffff',
  rare: '#93c5fd',
  epic: '#d8b4fe',
  legendary: '#FFD166',
};

const RARITY_LABEL_MAP: Record<AssetRarity, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

interface AssetCardProps {
  asset: AssetConfig;
  isUnlocked: boolean;
  onPress?: (asset: AssetConfig) => void;
}

const AssetCard = memo(function AssetCard({
  asset,
  isUnlocked,
  onPress,
}: AssetCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (onPress) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
    }
  }, [onPress, scale]);

  const handlePressOut = useCallback(() => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [onPress, scale]);

  const handlePress = useCallback(() => {
    onPress?.(asset);
  }, [onPress, asset]);

  const rarityColor = RARITY_COLOR_MAP[asset.rarity];
  const glowColor = RARITY_GLOW_MAP[asset.rarity];

  return (
    <Animated.View style={[{ width: CARD_WIDTH }, animatedStyle]}>
      <GlassCard
        glowColor={isUnlocked ? glowColor : 'rgba(255,255,255,0.1)'}
        padding="md"
        onPress={onPress ? handlePress : undefined}
        className="h-40"
      >
        <View className="flex-1 items-center justify-between">
          <View className="items-center">
            {isUnlocked ? (
              <Text style={{ fontSize: 40 }}>{asset.icon}</Text>
            ) : (
              <View className="items-center">
                <Text style={{ fontSize: 40, opacity: 0.3 }}>
                  {asset.icon}
                </Text>
                <Text style={{ fontSize: 24, marginTop: -30, opacity: 0.8 }}>
                  🔒
                </Text>
              </View>
            )}
          </View>

          <View className="items-center w-full">
            <Text
              className={`text-sm font-semibold text-center ${
                isUnlocked ? 'text-white' : 'text-white/40'
              }`}
              numberOfLines={1}
            >
              {isUnlocked ? asset.name : '???'}
            </Text>
            <View className="mt-1 px-2 py-0.5 rounded-full bg-white/5">
              <Text className={`text-xs ${isUnlocked ? rarityColor : 'text-white/30'}`}>
                {isUnlocked ? RARITY_LABEL_MAP[asset.rarity] : `${asset.requiredExp} EXP`}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
});

function AssetGrid({ assets, currentExp, onAssetPress }: AssetGridProps) {
  const renderItem = useCallback(
    ({ item }: { item: AssetConfig }) => {
      const isUnlocked = item.requiredExp <= currentExp;
      return (
        <AssetCard
          asset={item}
          isUnlocked={isUnlocked}
          onPress={onAssetPress}
        />
      );
    },
    [currentExp, onAssetPress],
  );

  const keyExtractor = useCallback((item: AssetConfig) => item.id, []);

  const sortedAssets = [...assets].sort((a, b) => a.requiredExp - b.requiredExp);

  return (
    <FlatList
      data={sortedAssets}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      columnWrapperStyle={{ gap: GRID_GAP }}
      contentContainerStyle={{
        paddingHorizontal: GRID_PADDING,
        paddingVertical: 8,
        gap: GRID_GAP,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
}

export default memo(AssetGrid);
