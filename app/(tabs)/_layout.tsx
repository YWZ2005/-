import { Tabs } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui';

interface TabBarProps {
  state: {
    index: number;
    routes: { name: string }[];
  };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: { navigate: (route: string) => void };
}

function CustomTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  const icons: Record<string, string> = {
    index: '✦',
    ocean: '◈',
    profile: '◎',
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      <GlassCard padding="sm" glowColor="#5BC0BE" style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const label = options.title ?? route.name;
          const icon = icons[route.name] ?? '●';

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
            >
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabIcon,
                    { color: isFocused ? '#5BC0BE' : 'rgba(255, 255, 255, 0.5)' },
                  ]}
                >
                  {icon}
                </Text>
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? '#5BC0BE' : 'rgba(255, 255, 255, 0.5)' },
                  ]}
                >
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </GlassCard>
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
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});
