import React, { memo, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const RADAR_SIZE = 200;
const BIOLUMINESCENT = '#5BC0BE';

interface RadarBlipData {
  id: number;
  angle: number;
  distance: number;
}

interface BlipProps {
  blip: RadarBlipData;
  found: boolean;
}

const Blip = memo(function Blip({ blip, found }: BlipProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const delay = Math.random() * 800;
    const timer = setTimeout(() => {
      opacity.value = withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(0.3, { duration: 2000 }),
      );
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(0.6, { duration: 2000 }),
      );
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (found) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1.5, { damping: 10, stiffness: 200 });
    }
  }, [found, opacity, scale]);

  const angleRad = (blip.angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * blip.distance;
  const y = Math.sin(angleRad) * blip.distance;

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.blip,
        {
          left: RADAR_SIZE / 2 - 4 + x,
          top: RADAR_SIZE / 2 - 4 + y,
        },
        animStyle,
      ]}
    />
  );
});

interface RadarScanProps {
  visible: boolean;
  onComplete?: () => void;
  scanning: boolean;
}

function RadarScanComponent({ visible, onComplete, scanning }: RadarScanProps) {
  const [blips, setBlips] = useState<RadarBlipData[]>([]);
  const [found, setFound] = useState(false);
  const [message, setMessage] = useState('正在搜索星海...');

  const rotation = useSharedValue(0);
  const centerScale = useSharedValue(1);
  const centerOpacity = useSharedValue(1);
  const radarScale = useSharedValue(1);

  const generateBlips = useCallback(() => {
    const count = Math.floor(Math.random() * 3) + 1;
    const newBlips: RadarBlipData[] = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i,
      angle: Math.random() * 360,
      distance: 30 + Math.random() * 60,
    }));
    setBlips(newBlips);
  }, []);

  useEffect(() => {
    if (visible && scanning) {
      setFound(false);
      setMessage('正在搜索星海...');
      rotation.value = 0;
      centerScale.value = 1;
      centerOpacity.value = 1;
      radarScale.value = 1;

      generateBlips();

      rotation.value = withRepeat(
        withTiming(360, {
          duration: 3000,
          easing: Easing.linear,
        }),
        -1,
        false,
      );

      centerScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );

      const blipInterval = setInterval(() => {
        generateBlips();
      }, 3500);

      return () => {
        clearInterval(blipInterval);
        cancelAnimation(rotation);
        cancelAnimation(centerScale);
      };
    }
  }, [visible, scanning, generateBlips, rotation, centerScale]);

  useEffect(() => {
    if (visible && !scanning) {
      setFound(true);
      setMessage('发现漂流瓶！');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      cancelAnimation(rotation);
      cancelAnimation(centerScale);

      centerScale.value = withSequence(
        withTiming(1.8, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );
      centerOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0.8, { duration: 100 }),
        withTiming(1, { duration: 200 }),
      );
      radarScale.value = withSpring(1.15, { damping: 12, stiffness: 150 });

      if (onComplete) {
        const timer = setTimeout(() => {
          onComplete();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, scanning, onComplete, rotation, centerScale, centerOpacity, radarScale]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const centerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: centerScale.value }],
    opacity: centerOpacity.value,
  }));

  const radarContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: radarScale.value }],
  }));

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value - 45}deg` }],
    opacity: scanning ? 0.5 : 1,
  }));

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.radarContainer, radarContainerStyle]}>
        <View style={styles.radarBase}>
          <View style={[styles.circle, styles.circleOuter]} />
          <View style={[styles.circle, styles.circleMiddle]} />
          <View style={[styles.circle, styles.circleInner]} />

          <View style={styles.crosshairH} />
          <View style={styles.crosshairV} />

          <Animated.View style={[styles.sweepContainer, sweepStyle]}>
            <View style={styles.sweep} />
          </Animated.View>

          <Animated.View style={[styles.scanLineContainer, scanLineStyle]}>
            <View style={styles.scanLine} />
          </Animated.View>

          {blips.map((blip) => (
            <Blip key={blip.id} blip={blip} found={found} />
          ))}

          <Animated.View style={[styles.centerDot, centerStyle]} />
        </View>
      </Animated.View>

      <Text style={[styles.message, found && styles.messageFound]}>{message}</Text>
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
    backgroundColor: 'rgba(11, 19, 43, 0.7)',
  },
  radarContainer: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
  },
  radarBase: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    backgroundColor: 'rgba(28, 37, 65, 0.6)',
    borderWidth: 2,
    borderColor: BIOLUMINESCENT + '60',
    position: 'relative',
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: BIOLUMINESCENT + '30',
  },
  circleOuter: {
    width: RADAR_SIZE - 16,
    height: RADAR_SIZE - 16,
    left: 8,
    top: 8,
  },
  circleMiddle: {
    width: RADAR_SIZE - 60,
    height: RADAR_SIZE - 60,
    left: 30,
    top: 30,
  },
  circleInner: {
    width: RADAR_SIZE - 104,
    height: RADAR_SIZE - 104,
    left: 52,
    top: 52,
  },
  crosshairH: {
    position: 'absolute',
    width: RADAR_SIZE - 32,
    height: 1,
    left: 16,
    top: RADAR_SIZE / 2,
    backgroundColor: BIOLUMINESCENT + '20',
  },
  crosshairV: {
    position: 'absolute',
    width: 1,
    height: RADAR_SIZE - 32,
    left: RADAR_SIZE / 2,
    top: 16,
    backgroundColor: BIOLUMINESCENT + '20',
  },
  sweepContainer: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    left: 0,
    top: 0,
  },
  sweep: {
    position: 'absolute',
    width: RADAR_SIZE / 2,
    height: RADAR_SIZE,
    left: RADAR_SIZE / 2,
    top: 0,
    backgroundColor: BIOLUMINESCENT + '15',
    borderTopRightRadius: RADAR_SIZE,
    borderBottomRightRadius: RADAR_SIZE,
  },
  scanLineContainer: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    left: 0,
    top: 0,
  },
  scanLine: {
    position: 'absolute',
    width: RADAR_SIZE / 2 - 8,
    height: 2,
    left: RADAR_SIZE / 2,
    top: RADAR_SIZE / 2 - 1,
    backgroundColor: BIOLUMINESCENT,
    shadowColor: BIOLUMINESCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  centerDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BIOLUMINESCENT,
    left: RADAR_SIZE / 2 - 6,
    top: RADAR_SIZE / 2 - 6,
    shadowColor: BIOLUMINESCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  blip: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD166',
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  message: {
    marginTop: 32,
    fontSize: 16,
    color: BIOLUMINESCENT,
    fontWeight: '500',
    letterSpacing: 1,
  },
  messageFound: {
    color: '#FFD166',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default memo(RadarScanComponent);
