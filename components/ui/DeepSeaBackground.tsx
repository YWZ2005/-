import React, { memo, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DeepSeaBackgroundProps {
  children?: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

interface ParticleConfig {
  id: number;
  size: number;
  initialX: number;
  initialY: number;
  translateX: number;
  translateY: number;
  duration: number;
  delay: number;
  baseOpacity: number;
  opacityRange: number;
}

const INTENSITY_CONFIG = {
  low: { count: 8, baseOpacity: 0.3, opacityRange: 0.2 },
  medium: { count: 15, baseOpacity: 0.4, opacityRange: 0.3 },
  high: { count: 22, baseOpacity: 0.5, opacityRange: 0.4 },
};

const generateParticles = (intensity: 'low' | 'medium' | 'high'): ParticleConfig[] => {
  const config = INTENSITY_CONFIG[intensity];
  const particles: ParticleConfig[] = [];

  for (let i = 0; i < config.count; i++) {
    const size = 4 + Math.random() * 12;
    const initialX = Math.random() * SCREEN_WIDTH;
    const initialY = Math.random() * SCREEN_HEIGHT;
    const translateX = (Math.random() - 0.5) * 80;
    const translateY = (Math.random() - 0.5) * 60;
    const duration = 8000 + Math.random() * 7000;
    const delay = Math.random() * 5000;
    const baseOpacity = config.baseOpacity + Math.random() * 0.2;
    const opacityRange = config.opacityRange;

    particles.push({
      id: i,
      size,
      initialX,
      initialY,
      translateX,
      translateY,
      duration,
      delay,
      baseOpacity,
      opacityRange,
    });
  }

  return particles;
};

const Particle = memo(function Particle({ config }: { config: ParticleConfig }) {
  const progress = useSharedValue(0);
  const opacityProgress = useSharedValue(0);

  const hasAnimated = useRef(false);

  if (!hasAnimated.current) {
    hasAnimated.current = true;
    progress.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(1, {
          duration: config.duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true,
      ),
    );

    opacityProgress.value = withDelay(
      config.delay * 0.5,
      withRepeat(
        withTiming(1, {
          duration: config.duration * 0.7,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = config.translateX * Math.sin(progress.value * Math.PI * 2);
    const translateY = config.translateY * Math.sin(progress.value * Math.PI * 2 + 1);
    const opacity =
      config.baseOpacity + config.opacityRange * Math.sin(opacityProgress.value * Math.PI * 2);

    return {
      transform: [{ translateX }, { translateY }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          left: config.initialX - config.size / 2,
          top: config.initialY - config.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
});

function DeepSeaBackgroundComponent({
  children,
  intensity = 'medium',
}: DeepSeaBackgroundProps) {
  const particles = useMemo(() => generateParticles(intensity), [intensity]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0B132B', '#1C2541']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {particles.map((particle) => (
          <Particle key={particle.id} config={particle} />
        ))}
      </View>
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  childrenContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#5BC0BE',
    shadowColor: '#5BC0BE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});

export const DeepSeaBackground = memo(DeepSeaBackgroundComponent);

export default DeepSeaBackground;
