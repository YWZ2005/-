import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { View, Text, Alert, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  withSpring,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from 'react-native-reanimated';
import { GlassCard } from '@/components/ui';
import {
  BottomDrawer,
  ThrowBottleAnimation,
  RadarScan,
  TextBottleSheet,
} from '@/components/bottle';
import { useBottle } from '@/hooks/useBottle';
import { TextBottleContent, BottleType } from '@/types';

type DrawerType = 'throwOptions' | 'textBottle' | null;
type ThrowType = 'text' | 'voice' | 'draw';

const OceanCenter = memo(function OceanCenter() {
  const breatheProgress = useSharedValue(0);
  const ripple1Progress = useSharedValue(0);
  const ripple2Progress = useSharedValue(0);
  const ripple3Progress = useSharedValue(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;

      breatheProgress.value = withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true,
      );

      ripple1Progress.value = withRepeat(
        withTiming(1, { duration: 3500, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      );
      ripple2Progress.value = withDelay(
        1200,
        withRepeat(
          withTiming(1, { duration: 3500, easing: Easing.out(Easing.ease) }),
          -1,
          false,
        ),
      );
      ripple3Progress.value = withDelay(
        2400,
        withRepeat(
          withTiming(1, { duration: 3500, easing: Easing.out(Easing.ease) }),
          -1,
          false,
        ),
      );
    }
  }, [breatheProgress, ripple1Progress, ripple2Progress, ripple3Progress]);

  const breatheStyle = useAnimatedStyle(() => {
    const scale = 1 + 0.06 * Math.sin(breatheProgress.value * Math.PI * 2);
    const opacity = 0.7 + 0.3 * Math.sin(breatheProgress.value * Math.PI * 2);
    return { transform: [{ scale }], opacity };
  });

  const innerGlowStyle = useAnimatedStyle(() => {
    const scale = 0.85 + 0.15 * Math.sin(breatheProgress.value * Math.PI * 2 + 0.5);
    const opacity = 0.5 + 0.3 * Math.sin(breatheProgress.value * Math.PI * 2 + 0.5);
    return { transform: [{ scale }], opacity };
  });

  const rippleStyle = (progress: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => {
      const scale = interpolate(progress.value, [0, 1], [0.4, 1.8], Extrapolate.CLAMP);
      const opacity = interpolate(progress.value, [0, 0.3, 1], [0, 0.5, 0], Extrapolate.CLAMP);
      return { transform: [{ scale }], opacity };
    });

  const floatDotStyle = (index: number) =>
    useAnimatedStyle(() => {
      const angle = breatheProgress.value * Math.PI * 2 + index * 1.2;
      const radius = 100 + index * 8;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.6;
      const opacity = 0.4 + 0.4 * Math.sin(breatheProgress.value * Math.PI * 2 + index);
      const scale = 0.8 + 0.4 * Math.sin(breatheProgress.value * Math.PI * 3 + index * 0.7);
      return {
        transform: [{ translateX: x }, { translateY: y }, { scale }],
        opacity,
      };
    });

  return (
    <View style={styles.oceanCenterContainer}>
      <Animated.View style={[styles.ripple, rippleStyle(ripple1Progress)]} />
      <Animated.View style={[styles.ripple, rippleStyle(ripple2Progress)]} />
      <Animated.View style={[styles.ripple, rippleStyle(ripple3Progress)]} />

      <Animated.View style={[styles.outerGlow, breatheStyle]}>
        <LinearGradient
          colors={['rgba(91, 192, 190, 0.1)', 'rgba(91, 192, 190, 0.3)', 'rgba(91, 192, 190, 0.1)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.midGlow, innerGlowStyle]}>
        <LinearGradient
          colors={['rgba(91, 192, 190, 0.2)', 'rgba(91, 192, 190, 0.5)', 'rgba(91, 192, 190, 0.2)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <Animated.View style={[styles.floatDot, styles.floatDot1, floatDotStyle(0)]} />
      <Animated.View style={[styles.floatDot, styles.floatDot2, floatDotStyle(1)]} />
      <Animated.View style={[styles.floatDot, styles.floatDot3, floatDotStyle(2)]} />
      <Animated.View style={[styles.floatDot, styles.floatDot4, floatDotStyle(3)]} />
      <Animated.View style={[styles.floatDot, styles.floatDot5, floatDotStyle(4)]} />
      <Animated.View style={[styles.floatDot, styles.floatDot6, floatDotStyle(5)]} />

      <View style={styles.coreContainer}>
        <LinearGradient
          colors={['#6EE7E5', '#5BC0BE', '#3A8E8C']}
          style={styles.core}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.waveEmoji}>🌊</Text>
        </LinearGradient>
        <View style={styles.coreHighlight} pointerEvents="none" />
      </View>
    </View>
  );
});

function HomeScreen() {
  const router = useRouter();
  const { isThrowing, isFishing, error, throwBottle, fishBottle } = useBottle();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(null);
  const [throwAnimVisible, setThrowAnimVisible] = useState(false);
  const [throwAnimType, setThrowAnimType] = useState<BottleType>('text');
  const [radarVisible, setRadarVisible] = useState(false);
  const [radarScanning, setRadarScanning] = useState(false);
  const [dailyThrowCount] = useState(0);

  const openDrawer = useCallback((type: DrawerType) => {
    setDrawerType(type);
    setDrawerVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
    setTimeout(() => setDrawerType(null), 300);
  }, []);

  const handleThrowPress = useCallback(() => {
    openDrawer('throwOptions');
  }, [openDrawer]);

  const handleSelectThrowType = useCallback((type: ThrowType) => {
    closeDrawer();
    if (type === 'text') {
      setTimeout(() => openDrawer('textBottle'), 350);
    } else if (type === 'voice') {
      Alert.alert('语音瓶', '语音录制功能将在后续版本中开放，敬请期待！');
    } else if (type === 'draw') {
      Alert.alert('手绘瓶', '手绘功能将在后续版本中开放，敬请期待！');
    }
  }, [closeDrawer, openDrawer]);

  const handleSubmitTextBottle = useCallback(async (text: string, tags: string[]) => {
    const content: TextBottleContent = { text };
    const result = await throwBottle({ type: 'text', content, tags });

    if (result.success) {
      closeDrawer();
      setThrowAnimType('text');
      setTimeout(() => setThrowAnimVisible(true), 300);
    } else {
      Alert.alert('投递失败', result.error ?? '请稍后重试');
    }
  }, [throwBottle, closeDrawer]);

  const handleThrowAnimComplete = useCallback(() => {
    setThrowAnimVisible(false);
    Alert.alert('投递成功', '你的漂流瓶已投向星海，等待有缘人捞取 🌊');
  }, []);

  const handleFishPress = useCallback(async () => {
    setRadarVisible(true);
    setRadarScanning(true);

    const result = await fishBottle();

    if (result.success && result.bottle) {
      const bottle = result.bottle;
      setRadarScanning(false);
      setTimeout(() => {
        setRadarVisible(false);
        setTimeout(() => {
          router.push(`/bottle/${bottle.id}`);
        }, 300);
      }, 1000);
    } else {
      setRadarScanning(false);
      setTimeout(() => {
        setRadarVisible(false);
        setTimeout(() => {
          Alert.alert('捞瓶提示', result.error ?? '星海暂时没有漂流瓶');
        }, 300);
      }, 500);
    }
  }, [fishBottle, router]);

  return (
    <SafeAreaView style={styles.flex1} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>星海漂流</Text>
            <Text style={styles.subtitleHeader}>在深海中寻找温暖</Text>
          </View>
          <GlassCard padding="sm" glowColor="#5BC0BE" variant="elevated">
            <View style={styles.energyContainer}>
              <Text style={styles.energyIcon}>✧</Text>
              <Text style={styles.energyText}>842</Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.centerContent}>
          <OceanCenter />

          <View style={styles.centerTexts}>
            <Text style={styles.centerTitle}>在这片神秘的星海中</Text>
            <Text style={styles.centerSubtitle}>每一个漂流瓶都承载着故事</Text>
          </View>

          {dailyThrowCount > 0 && (
            <View style={styles.dailyCountContainer}>
              <Text style={styles.dailyCount}>
                今日已投递 {dailyThrowCount}/3 个漂流瓶
              </Text>
            </View>
          )}
        </View>

        <View style={styles.buttonGroup}>
          <GlassCard
            padding="lg"
            glowColor="#FFD166"
            variant="elevated"
            onPress={handleThrowPress}
            shimmer
          >
            <View style={styles.buttonContent}>
              <View style={[styles.buttonIconWrapper, { backgroundColor: 'rgba(255, 209, 102, 0.15)' }]}>
                <Text style={styles.buttonIcon}>🏮</Text>
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonTitle, { color: '#FFD166' }]}>扔漂流瓶</Text>
                <Text style={styles.buttonSubtitle}>把你的故事投向星海</Text>
              </View>
              <View style={styles.buttonArrow}>
                <Text style={styles.buttonArrowText}>›</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard
            padding="lg"
            glowColor="#5BC0BE"
            variant="elevated"
            onPress={handleFishPress}
          >
            <View style={styles.buttonContent}>
              <View style={[styles.buttonIconWrapper, { backgroundColor: 'rgba(91, 192, 190, 0.15)' }]}>
                <Text style={styles.buttonIcon}>🎣</Text>
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonTitle, { color: '#5BC0BE' }]}>捞漂流瓶</Text>
                <Text style={styles.buttonSubtitle}>邂逅未知的温暖</Text>
              </View>
              <View style={styles.buttonArrow}>
                <Text style={styles.buttonArrowText}>›</Text>
              </View>
            </View>
          </GlassCard>
        </View>
      </View>

      <BottomDrawer visible={drawerVisible && drawerType === 'throwOptions'} onClose={closeDrawer} height={45}>
        <View style={styles.drawerContent}>
          <View style={styles.drawerHandle} />
          <Text style={styles.drawerTitle}>选择漂流瓶类型</Text>
          <View style={styles.drawerOptions}>
            <GlassCard padding="lg" glowColor="#FFD166" onPress={() => handleSelectThrowType('text')}>
              <View style={styles.optionItem}>
                <View style={[styles.optionIconWrapper, { backgroundColor: 'rgba(255, 209, 102, 0.15)' }]}>
                  <Text style={styles.optionIconEmoji}>🏮</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: '#FFD166' }]}>文字漂流瓶</Text>
                  <Text style={styles.optionSubtitle}>写下你的心事，投向星海</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </View>
            </GlassCard>

            <GlassCard padding="lg" glowColor="#5BC0BE" onPress={() => handleSelectThrowType('voice')}>
              <View style={styles.optionItem}>
                <View style={[styles.optionIconWrapper, { backgroundColor: 'rgba(91, 192, 190, 0.15)' }]}>
                  <Text style={styles.optionIconEmoji}>🎙️</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: '#5BC0BE' }]}>语音漂流瓶</Text>
                  <Text style={styles.optionSubtitle}>用声音传递你的温度</Text>
                </View>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>即将推出</Text>
                </View>
              </View>
            </GlassCard>

            <GlassCard padding="lg" glowColor="#A78BFA" onPress={() => handleSelectThrowType('draw')}>
              <View style={styles.optionItem}>
                <View style={[styles.optionIconWrapper, { backgroundColor: 'rgba(167, 139, 250, 0.15)' }]}>
                  <Text style={styles.optionIconEmoji}>🎨</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: '#A78BFA' }]}>手绘漂流瓶</Text>
                  <Text style={styles.optionSubtitle}>画出你此刻的心情</Text>
                </View>
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>即将推出</Text>
                </View>
              </View>
            </GlassCard>
          </View>
        </View>
      </BottomDrawer>

      <BottomDrawer visible={drawerVisible && drawerType === 'textBottle'} onClose={closeDrawer} height={75}>
        <TextBottleSheet
          onSubmit={handleSubmitTextBottle}
          onClose={closeDrawer}
          isSubmitting={isThrowing}
        />
      </BottomDrawer>

      <ThrowBottleAnimation
        visible={throwAnimVisible}
        bottleType={throwAnimType}
        onComplete={handleThrowAnimComplete}
      />

      <RadarScan
        visible={radarVisible}
        scanning={radarScanning}
      />

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitleHeader: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  energyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
  },
  energyIcon: {
    color: '#5BC0BE',
    fontSize: 16,
    textShadowColor: '#5BC0BE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  energyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 17,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  oceanCenterContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(91, 192, 190, 0.4)',
  },
  outerGlow: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    overflow: 'hidden',
  },
  midGlow: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    overflow: 'hidden',
  },
  coreContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5BC0BE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 20,
  },
  core: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreHighlight: {
    position: 'absolute',
    top: 8,
    left: 20,
    right: 20,
    height: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  waveEmoji: {
    fontSize: 44,
  },
  floatDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  floatDot1: {
    backgroundColor: '#FFD166',
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  floatDot2: {
    backgroundColor: '#5BC0BE',
    shadowColor: '#5BC0BE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  floatDot3: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  floatDot4: {
    backgroundColor: '#6EE7E5',
    shadowColor: '#6EE7E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  floatDot5: {
    backgroundColor: '#A78BFA',
    shadowColor: '#A78BFA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  floatDot6: {
    backgroundColor: '#FFD166',
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  centerTexts: {
    alignItems: 'center',
    marginTop: 24,
  },
  centerTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 17,
    fontWeight: '500',
  },
  centerSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    marginTop: 6,
  },
  dailyCountContainer: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(91, 192, 190, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(91, 192, 190, 0.2)',
  },
  dailyCount: {
    color: 'rgba(91, 192, 190, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  buttonGroup: {
    gap: 14,
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  buttonIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 28,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  buttonSubtitle: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 13,
    marginTop: 2,
  },
  buttonArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonArrowText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 18,
    marginTop: -2,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  drawerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  drawerOptions: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  optionIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconEmoji: {
    fontSize: 26,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  optionArrow: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 22,
    marginTop: -2,
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  comingSoonText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default memo(HomeScreen);