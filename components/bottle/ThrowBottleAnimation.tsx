import React, { memo, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ThrowBottleAnimationProps {
  visible: boolean;
  bottleType: 'text' | 'voice' | 'draw';
  onComplete: () => void;
}

interface ParticleData {
  id: number;
  x: number;
  y: number;
  delay: number;
}

interface ParticleProps {
  particle: ParticleData;
  particleOpacity: Animated.SharedValue<number>;
}

const Particle = memo(function Particle({ particle, particleOpacity }: ParticleProps) {
  const localScale = useSharedValue(0);
  const localX = useSharedValue(0);
  const localY = useSharedValue(0);

  useEffect(() => {
    localScale.value = withDelay(
      particle.delay,
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1, { duration: 200 }),
        withTiming(0, { duration: 400 }),
      ),
    );
    localX.value = withDelay(
      particle.delay,
      withTiming(particle.x * 2, { duration: 600 }),
    );
    localY.value = withDelay(
      particle.delay,
      withTiming(particle.y * 2 - 50, { duration: 600 }),
    );
  }, []);

  const particleAnimStyle = useAnimatedStyle(() => ({
    opacity: particleOpacity.value,
    transform: [
      { translateX: localX.value },
      { translateY: localY.value },
      { scale: localScale.value },
    ],
  }));

  return <Animated.View style={[styles.particle, particleAnimStyle]} />;
});

function ThrowBottleAnimationComponent({
  visible,
  bottleType,
  onComplete,
}: ThrowBottleAnimationProps) {
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const particleOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = SCREEN_HEIGHT * 0.3;
      translateX.value = 0;
      scale.value = 1;
      opacity.value = 1;
      particleOpacity.value = 0;

      const newParticles: ParticleData[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 120,
        delay: Math.random() * 200,
      }));
      setParticles(newParticles);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      scale.value = withSequence(
        withTiming(0.8, { duration: 150, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.1, { duration: 100 }),
        withTiming(1.1, { duration: 550 }),
        withTiming(0, {
          duration: 400,
          easing: Easing.in(Easing.ease),
        }),
      );

      translateY.value = withSequence(
        withTiming(SCREEN_HEIGHT * 0.3, { duration: 150 }),
        withTiming(-SCREEN_HEIGHT * 0.1, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        }),
        withTiming(-SCREEN_HEIGHT * 0.2, {
          duration: 550,
          easing: Easing.in(Easing.quad),
        }),
      );

      translateX.value = withSequence(
        withTiming(0, { duration: 150 }),
        withTiming(SCREEN_WIDTH * 0.15, {
          duration: 1050,
          easing: Easing.inOut(Easing.ease),
        }),
      );

      particleOpacity.value = withDelay(
        150,
        withTiming(1, { duration: 100 }),
      );

      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 600);

      opacity.value = withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0, {
          duration: 400,
          easing: Easing.in(Easing.ease),
        }, () => {
          runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
          runOnJS(onComplete)();
        }),
      );
    }
  }, [visible]);

  const bottleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const getBottleEmoji = () => {
    switch (bottleType) {
      case 'voice':
        return '🎙️';
      case 'draw':
        return '🎨';
      case 'text':
      default:
        return '🏮';
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Particle key={particle.id} particle={particle} particleOpacity={particleOpacity} />
      ))}
      <Animated.View style={[styles.bottleContainer, bottleStyle]}>
        <View style={styles.glow} />
        <Text style={styles.bottle}>{getBottleEmoji()}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 19, 43, 0.3)',
  },
  bottleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottle: {
    fontSize: 72,
    textShadowColor: '#5BC0BE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(91, 192, 190, 0.2)',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#5BC0BE',
    shadowColor: '#5BC0BE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default memo(ThrowBottleAnimationComponent);
