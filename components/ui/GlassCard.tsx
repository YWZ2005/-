import React, { memo, forwardRef, useRef } from 'react';
import { View, Pressable, StyleSheet, ViewProps, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withDelay,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  glowColor?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'subtle';
  shimmer?: boolean;
}

const PADDING_MAP: Record<string, number> = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

const GlassCard = forwardRef<View, GlassCardProps>(function GlassCard(
  {
    children,
    glowColor = '#5BC0BE',
    padding = 'md',
    onPress,
    variant = 'default',
    shimmer = false,
    style,
    ...props
  },
  ref,
) {
  const scale = useSharedValue(1);
  const shimmerProgress = useSharedValue(0);
  const pressableRef = useRef(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-200, 400],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{ translateX }],
      opacity: 0.08 + 0.04 * Math.sin(shimmerProgress.value * Math.PI),
    };
  });

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.96, { damping: 14, stiffness: 320, mass: 0.8 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 12, stiffness: 300, mass: 0.9 });
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const paddingValue = PADDING_MAP[padding];

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
          elevation: 8,
        };
      case 'subtle':
        return {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        };
      default:
        return {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 4,
        };
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        styles.cardOuter,
        getVariantStyles(),
        animatedStyle,
        style as ViewStyle,
      ]}
      ref={ref as any}
      {...props}
    >
      <LinearGradient
        colors={[
          Platform.OS === 'web' ? 'rgba(40, 52, 90, 0.9)' : 'rgba(255, 255, 255, 0.08)',
          Platform.OS === 'web' ? 'rgba(28, 37, 65, 0.95)' : 'rgba(255, 255, 255, 0.03)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientBg}
      />

      <View
        style={[
          styles.borderOverlay,
          {
            borderColor: glowColor + '50',
            borderTopColor: glowColor + '80',
            padding: paddingValue,
          },
        ]}
      >
        {shimmer && (
          <Animated.View style={[styles.shimmerLayer, shimmerAnimatedStyle]} pointerEvents="none">
            <LinearGradient
              colors={['transparent', glowColor + '40', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shimmerGradient}
            />
          </Animated.View>
        )}

        <View style={styles.topHighlight} pointerEvents="none" />
        <View style={styles.content}>{children}</View>
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <Pressable
        ref={pressableRef as any}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
        android_ripple={{ color: glowColor + '20', borderless: false }}
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
  cardOuter: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  borderOverlay: {
    position: 'relative',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  shimmerLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 200,
    zIndex: 5,
  },
  shimmerGradient: {
    flex: 1,
  },
  content: {
    position: 'relative',
    zIndex: 10,
  },
});

export default memo(GlassCard);