import { Tabs } from 'expo-router';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useEffect, useRef } from 'react';

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: { navigate: (route: string) => void };
}

const TAB_CONFIG = {
  index: { icon: '🌊', label: '星海', color: '#5BC0BE' },
  ocean: { icon: '🏝️', label: '海域', color: '#FFD166' },
  profile: { icon: '🐚', label: '我的', color: '#A78BFA' },
};

function TabBarItem({
  routeName,
  label,
  isFocused,
  onPress,
}: {
  routeName: string;
  label: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0.9);
  const glowOpacity = useSharedValue(isFocused ? 1 : 0);
  const config = TAB_CONFIG[routeName as keyof typeof TAB_CONFIG] ?? TAB_CONFIG.index;

  const prevFocused = useRef(isFocused);

  useEffect(() => {
    if (prevFocused.current !== isFocused) {
      prevFocused.current = isFocused;
      scale.value = withSpring(isFocused ? 1.08 : 1, {
        damping: 12,
        stiffness: 250,
        mass: 0.8,
      });
      glowOpacity.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
    }
  }, [isFocused, scale, glowOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <Pressable onPress={onPress} style={styles.tabItem} android_ripple={{ color: 'transparent', borderless: true }}>
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <View style={styles.iconContainer}>
          <Animated.View
            style={[
              styles.iconGlow,
              {
                shadowColor: config.color,
                backgroundColor: config.color + '30',
              },
              glowAnimatedStyle,
            ]}
          />
          <Text style={styles.tabIcon}>{config.icon}</Text>
        </View>
        <Text
          style={[
            styles.tabLabel,
            {
              color: isFocused ? config.color : 'rgba(255, 255, 255, 0.45)',
              fontWeight: isFocused ? '600' : '400',
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBarOuter}>
        <LinearGradient
          colors={[
            'rgba(28, 37, 65, 0.95)',
            'rgba(20, 28, 50, 0.98)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.tabBarGradient}
        />

        <View style={styles.tabBarBorder} />

        <View style={styles.tabBarTopHighlight} />

        <View style={styles.tabBarContent}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const label = options.title ?? route.name;

            const onPress = () => {
              if (!isFocused) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabBarItem
                key={route.key}
                routeName={route.name}
                label={label}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '星海',
        }}
      />
      <Tabs.Screen
        name="ocean"
        options={{
          title: '海域',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  tabBarOuter: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(91, 192, 190, 0.15)',
  },
  tabBarGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabBarTopHighlight: {
    position: 'absolute',
    top: 1,
    left: 20,
    right: 20,
    height: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 8,
  },
  tabIcon: {
    fontSize: 26,
  },
  tabLabel: {
    fontSize: 12,
  },
});