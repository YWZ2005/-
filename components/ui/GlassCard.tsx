import React, { memo, forwardRef } from 'react';
import { View, Pressable, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  blurIntensity?: number;
  glowColor?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
}

const PADDING_MAP: Record<string, number> = {
  none: 0,
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
};

const GlassCard = forwardRef<View, GlassCardProps>(function GlassCard(
  {
    children,
    blurIntensity = 20,
    glowColor = '#5BC0BE',
    className,
    padding = 'md',
    onPress,
    style,
    ...props
  },
  ref,
) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  };

  const paddingValue = PADDING_MAP[padding];

  const cardContent = (
    <AnimatedBlurView
      intensity={blurIntensity}
      tint="dark"
      style={[
        styles.blurContainer,
        {
          borderColor: glowColor + '40',
          padding: paddingValue,
        },
        animatedStyle,
        style as ViewStyle,
      ]}
      ref={ref as any}
      {...props}
    >
      <View style={styles.innerGlow} pointerEvents="none" />
      <View style={styles.content}>{children}</View>
    </AnimatedBlurView>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {cardContent}
      </Pressable>
    );
  }

  return cardContent;
});

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  blurContainer: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    position: 'relative',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});

export default memo(GlassCard);
