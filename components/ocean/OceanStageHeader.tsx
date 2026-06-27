import React, { memo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/ui';
import { LinearGradient } from 'expo-linear-gradient';

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
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [glowOpacity, shimmerProgress]);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: 0.9 + 0.1 * Math.sin(glowOpacity.value * Math.PI * 2) }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-100, 300],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{ translateX }],
      opacity: 0.3,
    };
  });

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <GlassCard glowColor={primaryColor} padding="lg" variant="elevated">
      <Animated.View
        style={[
          styles.glowOrb,
          {
            backgroundColor: primaryColor,
            shadowColor: primaryColor,
          },
          glowAnimatedStyle,
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.nextStageText}>
          {nextStageName ? `下一站：${nextStageName}` : '已达最高海域'}
        </Text>

        <View style={styles.stageRow}>
          <View style={styles.stageInfo}>
            <View style={[styles.stageIconWrapper, { backgroundColor: primaryColor + '20' }]}>
              <Text style={styles.stageIcon}>{stageIcon}</Text>
            </View>
            <View>
              <Text style={styles.stageName}>{stageName}</Text>
              <Text style={styles.stageLevel}>Lv. {stageLevel}</Text>
            </View>
          </View>

          <View style={styles.expInfo}>
            <Text style={styles.expValue}>{currentExp.toLocaleString()}</Text>
            <Text style={styles.expUnit}>EXP</Text>
            <Text style={styles.expNext}>/ {nextStageExp.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${clampedProgress * 100}%`, backgroundColor: primaryColor }]}>
            <Animated.View style={[styles.progressShimmer, shimmerAnimatedStyle]}>
              <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                style={styles.progressShimmerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  glowOrb: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    opacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  content: {
    position: 'relative',
    zIndex: 10,
  },
  nextStageText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    marginBottom: 14,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stageIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageIcon: {
    fontSize: 28,
  },
  stageName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  stageLevel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    marginTop: 2,
  },
  expInfo: {
    alignItems: 'flex-end',
  },
  expValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 20,
  },
  expUnit: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginTop: -2,
  },
  expNext: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 12,
    marginTop: 2,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  progressShimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
  },
  progressShimmerGradient: {
    flex: 1,
  },
});

export default memo(OceanStageHeader);