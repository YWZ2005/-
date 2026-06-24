import React, { memo } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { GlassCard } from '@/components/ui';

interface OceanStageHeaderProps {
  stageName: string;
  stageLevel: number;
  stageIcon: string;
  currentExp: number;
  nextStageExp: number;
  progress: number;
  nextStageName?: string;
  primaryColor: string;
}

function OceanStageHeader({
  stageName,
  stageLevel,
  stageIcon,
  currentExp,
  nextStageExp,
  progress,
  nextStageName,
  primaryColor,
}: OceanStageHeaderProps) {
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [glowOpacity]);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <GlassCard glowColor={primaryColor} padding="lg" className="relative overflow-hidden">
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: -50,
            left: -50,
            right: -50,
            bottom: -50,
            backgroundColor: primaryColor,
            borderRadius: 100,
            zIndex: 0,
          },
          glowAnimatedStyle,
        ]}
      />

      <View className="relative z-10">
        <Text className="text-xs text-white/50 mb-2">
          {nextStageName ? `下一站：${nextStageName}` : '已达最高海域'}
        </Text>

        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <Text style={{ fontSize: 32 }}>{stageIcon}</Text>
            <View>
              <Text className="text-white font-bold text-lg">{stageName}</Text>
              <Text className="text-white/60 text-sm">Lv. {stageLevel}</Text>
            </View>
          </View>

          <View className="items-end">
            <Text className="text-white font-semibold text-base">
              {currentExp.toLocaleString()} EXP
            </Text>
            <Text className="text-white/50 text-xs">
              / {nextStageExp.toLocaleString()}
            </Text>
          </View>
        </View>

        <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <View
            style={{
              width: `${clampedProgress * 100}%` as const,
              height: '100%',
              backgroundColor: primaryColor,
              borderRadius: 999,
            }}
          />
        </View>
      </View>
    </GlassCard>
  );
}

export default memo(OceanStageHeader);
