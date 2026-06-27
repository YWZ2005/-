import React, { memo, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  color: string;
  isGlow: boolean;
}

interface LightBeamConfig {
  id: number;
  left: number;
  width: number;
  opacity: number;
  duration: number;
  delay: number;
}

const INTENSITY_CONFIG = {
  low: { particleCount: 12, beamCount: 2, baseOpacity: 0.25, glowCount: 2 },
  medium: { particleCount: 25, beamCount: 4, baseOpacity: 0.35, glowCount: 5 },
  high: { particleCount: 40, beamCount: 6, baseOpacity: 0.45, glowCount: 8 },
};

const PARTICLE_COLORS = ['#5BC0BE', '#6EE7E5', '#FFFFFF', '#FFD166', '#7DD3FC'];

const generateParticles = (intensity: 'low' | 'medium' | 'high'): ParticleConfig[] => {
  const config = INTENSITY_CONFIG[intensity];
  const particles: ParticleConfig[] = [];
  const totalCount = config.particleCount + config.glowCount;

  for (let i = 0; i < totalCount; i++) {
    const isGlow = i >= config.particleCount;
    const size = isGlow ? 6 + Math.random() * 10 : 2 + Math.random() * 6;
    const initialX = Math.random() * SCREEN_WIDTH;
    const initialY = Math.random() * SCREEN_HEIGHT;
    const translateX = 20 + Math.random() * 100;
    const translateY = 30 + Math.random() * 120;
    const duration = 6000 + Math.random() * 10000;
    const delay = Math.random() * 6000;
    const baseOpacity = config.baseOpacity + Math.random() * 0.25;
    const opacityRange = 0.2 + Math.random() * 0.3;
    const color = isGlow
      ? PARTICLE_COLORS[Math.floor(Math.random() * 2)]
      : PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

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
      color,
      isGlow,
    });
  }

  return particles;
};

const generateLightBeams = (intensity: 'low' | 'medium' | 'high'): LightBeamConfig[] => {
  const config = INTENSITY_CONFIG[intensity];
  const beams: LightBeamConfig[] = [];

  for (let i = 0; i < config.beamCount; i++) {
    beams.push({
      id: i,
      left: Math.random() * SCREEN_WIDTH,
      width: 60 + Math.random() * 120,
      opacity: 0.04 + Math.random() * 0.06,
      duration: 8000 + Math.random() * 6000,
      delay: Math.random() * 5000,
    });
  }

  return beams;
};

const Particle = memo(function Particle({ config }: { config: ParticleConfig }) {
  const progress = useSharedValue(0);
  const opacityProgress = useSharedValue(0);

  const hasAnimated = useRef(false);

  useEffect(() => {
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
        config.delay * 0.6,
        withRepeat(
          withTiming(1, {
            duration: config.duration * 0.6,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        ),
      );
    }
  }, [config.delay, config.duration, progress, opacityProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = config.translateX * Math.sin(progress.value * Math.PI * 2);
    const translateY = config.translateY * Math.sin(progress.value * Math.PI * 2 + config.id * 0.5);
    const opacity =
      config.baseOpacity + config.opacityRange * Math.sin(opacityProgress.value * Math.PI * 2);
    const scale = config.isGlow
      ? 0.8 + 0.4 * Math.sin(opacityProgress.value * Math.PI * 2 + 1)
      : 1;

    return {
      transform: [{ translateX }, { translateY }, { scale }],
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
          backgroundColor: config.color,
        },
        config.isGlow && styles.glowParticle,
        animatedStyle,
      ]}
    />
  );
});

const LightBeam = memo(function LightBeam({ config }: { config: LightBeamConfig }) {
  const progress = useSharedValue(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      progress.value = withDelay(
        config.delay,
        withRepeat(
          withTiming(1, {
            duration: config.duration,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true,
        ),
      );
    }
  }, [config.delay, config.duration, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = config.opacity * (0.6 + 0.4 * Math.sin(progress.value * Math.PI * 2));
    const translateX = 30 * Math.sin(progress.value * Math.PI * 2 + config.id);

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.lightBeam,
        {
          left: config.left - config.width / 2,
          width: config.width,
          opacity: config.opacity,
        },
        animatedStyle,
      ]}
    />
  );
});

const FloatingBottle = memo(function FloatingBottle({ index }: { index: number }) {
  const progress = useSharedValue(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!hasAnimated.current) {
      hasAnimated.current = true;
      progress.value = withDelay(
        index * 2000,
        withRepeat(
          withTiming(1, {
            duration: 12000 + index * 3000,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        ),
      );
    }
  }, [index, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const x = interpolate(
      progress.value,
      [0, 0.5, 1],
      [-60, SCREEN_WIDTH + 60, -60],
      Extrapolate.CLAMP,
    );
    const y = 150 + Math.sin(progress.value * Math.PI * 4) * 30;
    const rotation = Math.sin(progress.value * Math.PI * 3) * 15;

    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${rotation}deg` }],
      opacity: 0.15 + Math.sin(progress.value * Math.PI) * 0.1,
    };
  });

  return (
    <Animated.View style={[styles.floatingBottle, animatedStyle]}>
      <Text style={styles.bottleEmoji}>🍶</Text>
    </Animated.View>
  );
});

function DeepSeaBackgroundComponent({
  children,
  intensity = 'medium',
}: DeepSeaBackgroundProps) {
  const particles = useMemo(() => generateParticles(intensity), [intensity]);
  const lightBeams = useMemo(() => generateLightBeams(intensity), [intensity]);

  return (
    <View style={styles.container}>
      <View style={styles.solidBackground} />

      <LinearGradient
        colors={['#070B14', '#0B132B', '#141E3C', '#1C2541']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.lightBeamContainer} pointerEvents="none">
        {lightBeams.map((beam) => (
          <LightBeam key={beam.id} config={beam} />
        ))}
      </View>

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {particles.map((particle) => (
          <Particle key={particle.id} config={particle} />
        ))}
      </View>

      {intensity !== 'low' && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <FloatingBottle index={0} />
          {intensity === 'high' && <FloatingBottle index={1} />}
        </View>
      )}

      <LinearGradient
        colors={['transparent', 'rgba(11, 19, 43, 0.6)', '#0B132B']}
        style={styles.bottomGradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#0B132B',
  },
  solidBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0B132B',
  },
  childrenContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  particle: {
    position: 'absolute',
  },
  glowParticle: {
    shadowColor: '#5BC0BE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  lightBeamContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  lightBeam: {
    position: 'absolute',
    top: -50,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: '#5BC0BE',
    transform: [{ skewX: '-8deg' }],
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SCREEN_HEIGHT * 0.4,
    zIndex: 5,
  },
  floatingBottle: {
    position: 'absolute',
    fontSize: 28,
  },
  bottleEmoji: {
    fontSize: 28,
    opacity: 0.5,
  },
});

export const DeepSeaBackground = memo(DeepSeaBackgroundComponent);

export default DeepSeaBackground;