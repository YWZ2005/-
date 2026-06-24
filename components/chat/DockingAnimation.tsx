import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DockingAnimationProps {
  visible: boolean;
  onComplete: () => void;
  onDismiss: () => void;
}

function DockingAnimation({
  visible,
  onComplete,
  onDismiss,
}: DockingAnimationProps) {
  const overlayOpacity = useSharedValue(0);
  const leftParticleX = useSharedValue(-100);
  const rightParticleX = useSharedValue(100);
  const particleScale = useSharedValue(1);
  const rippleScale = useSharedValue(0);
  const rippleOpacity = useSharedValue(0);
  const gemScale = useSharedValue(0);
  const gemOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = 0;
      leftParticleX.value = -SCREEN_WIDTH * 0.4;
      rightParticleX.value = SCREEN_WIDTH * 0.4;
      particleScale.value = 1;
      rippleScale.value = 0;
      rippleOpacity.value = 0;
      gemScale.value = 0;
      gemOpacity.value = 0;
      textOpacity.value = 0;
      textTranslateY.value = 20;
      buttonOpacity.value = 0;
      buttonTranslateY.value = 20;

      overlayOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });

      leftParticleX.value = withSequence(
        withTiming(-SCREEN_WIDTH * 0.4, { duration: 0 }),
        withTiming(-30, {
          duration: 700,
          easing: Easing.in(Easing.cubic),
        }),
      );

      rightParticleX.value = withSequence(
        withTiming(SCREEN_WIDTH * 0.4, { duration: 0 }),
        withTiming(30, {
          duration: 700,
          easing: Easing.in(Easing.cubic),
        }),
      );

      particleScale.value = withDelay(
        700,
        withSequence(
          withTiming(1, { duration: 0 }),
          withTiming(1.3, { duration: 100 }),
          withTiming(0, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          }),
        ),
      );

      rippleScale.value = withDelay(
        800,
        withTiming(3, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
      );

      rippleOpacity.value = withDelay(
        800,
        withSequence(
          withTiming(0.8, { duration: 100 }),
          withTiming(0, {
            duration: 400,
            easing: Easing.out(Easing.ease),
          }),
        ),
      );

      gemScale.value = withDelay(
        900,
        withSpring(1, {
          damping: 6,
          stiffness: 200,
        }),
      );

      gemOpacity.value = withDelay(
        900,
        withTiming(1, { duration: 200 }),
      );

      textOpacity.value = withDelay(
        1000,
        withTiming(1, { duration: 300 }),
      );

      textTranslateY.value = withDelay(
        1000,
        withTiming(0, { duration: 300 }),
      );

      buttonOpacity.value = withDelay(
        1500,
        withTiming(1, { duration: 300 }, () => {
          runOnJS(onComplete)();
        }),
      );

      buttonTranslateY.value = withDelay(
        1500,
        withTiming(0, { duration: 300 }),
      );

      const hapticsTimeout = setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 800);

      const dismissTimeout = setTimeout(() => {
        onDismiss();
      }, 5000);

      return () => {
        clearTimeout(hapticsTimeout);
        clearTimeout(dismissTimeout);
      };
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const leftParticleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: leftParticleX.value },
      { scale: particleScale.value },
    ],
  }));

  const rightParticleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: rightParticleX.value },
      { scale: particleScale.value },
    ],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const gemStyle = useAnimatedStyle(() => ({
    transform: [{ scale: gemScale.value }],
    opacity: gemOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDismiss();
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, overlayStyle]} pointerEvents="auto">
      <View style={styles.centerContainer}>
        <Animated.View style={[styles.ripple, rippleStyle]} />
        <View style={styles.particlesRow}>
          <Animated.View style={[styles.particle, leftParticleStyle]}>
            <View style={styles.particleGlow} />
          </Animated.View>
          <Animated.View style={[styles.particle, rightParticleStyle]}>
            <View style={styles.particleGlow} />
          </Animated.View>
        </View>
        <Animated.View style={[styles.gemContainer, gemStyle]}>
          <Text style={styles.gem}>💎</Text>
        </Animated.View>
      </View>
      <Animated.View style={[styles.textContent, textStyle]}>
        <Text style={styles.title}>你们的频率已共振</Text>
        <Text style={styles.subtitle}>解锁专属海域资产</Text>
      </Animated.View>
      <Animated.View style={[styles.buttonContainer, buttonStyle]}>
        <Pressable onPress={handlePress} style={styles.button}>
          <Text style={styles.buttonText}>开启共游海域</Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    zIndex: 3000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
  },
  particlesRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5BC0BE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5BC0BE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  particleGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(91, 192, 190, 0.3)',
  },
  ripple: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#5BC0BE',
    backgroundColor: 'rgba(91, 192, 190, 0.1)',
  },
  gemContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gem: {
    fontSize: 64,
    textShadowColor: '#5BC0BE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  textContent: {
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#5BC0BE',
    textShadowColor: 'rgba(91, 192, 190, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    backgroundColor: '#5BC0BE',
    shadowColor: '#5BC0BE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B132B',
  },
});

export default memo(DockingAnimation);
