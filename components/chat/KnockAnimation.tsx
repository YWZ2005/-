import React, { memo, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  withSpring,
  Easing,
} from 'react-native-reanimated';

interface KnockAnimationProps {
  count: number;
  isMe: boolean;
}

interface RippleProps {
  delay: number;
  color: string;
}

const Ripple = memo(function Ripple({ delay, color }: RippleProps) {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 0 }),
        withTiming(1.5, { duration: 1200, easing: Easing.out(Easing.ease) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 0 }),
        withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.ripple,
        {
          borderColor: color,
          backgroundColor: color + '20',
        },
        rippleStyle,
      ]}
    />
  );
});

function KnockAnimation({ count, isMe }: KnockAnimationProps) {
  const iconColor = isMe ? '#FFD166' : '#5BC0BE';
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 300 }),
        withSpring(-6, { damping: 3, stiffness: 200 }),
        withTiming(0, { duration: 300 }),
      ),
      -1,
      false,
    );
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const ripples = Array.from({ length: Math.min(count, 3) }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.rippleContainer}>
        {ripples.map((i) => (
          <Ripple key={i} delay={i * 400} color={iconColor} />
        ))}
        <Animated.View
          style={[
            styles.iconWrapper,
            { backgroundColor: iconColor + '30' },
            iconStyle,
          ]}
        >
          <Text style={styles.icon}>🚪</Text>
        </Animated.View>
      </View>
      <Text style={[styles.text, { color: '#3D2C1E' }]}>
        敲了第 {count} 次门
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  rippleContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  text: {
    fontSize: 13,
    opacity: 0.8,
  },
});

export default memo(KnockAnimation);
