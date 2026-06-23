import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui';

interface SettingItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
}

const settingItems: SettingItem[] = [
  { id: '1', icon: '🔔', title: '通知设置', subtitle: '管理消息推送' },
  { id: '2', icon: '🔒', title: '隐私设置', subtitle: '保护你的隐私' },
  { id: '3', icon: '🌙', title: '深色模式', subtitle: '跟随系统' },
  { id: '4', icon: '📖', title: '关于我们', subtitle: '版本 1.0.0' },
  { id: '5', icon: '❓', title: '帮助与反馈' },
  { id: '6', icon: '⚙️', title: '通用设置' },
];

export default function ProfileScreen() {
  const creditScore = 92;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-white text-2xl font-bold mb-6">个人中心</Text>

        <GlassCard padding="lg" glowColor="#5BC0BE" className="mb-6">
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-bioluminescent/20 items-center justify-center">
              <Text className="text-3xl">🧜</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-white text-xl font-bold">星海漫游者</Text>
                <View className="px-2 py-0.5 rounded-full bg-bioluminescent/20">
                  <Text className="text-bioluminescent text-xs font-semibold">已认证</Text>
                </View>
              </View>
              <Text className="text-white/50 text-sm mt-1">ID: xinghai_888</Text>
            </View>
            <Text className="text-white/40 text-xl">›</Text>
          </View>
        </GlassCard>

        <GlassCard padding="lg" glowColor="#FFD166" className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-xl">⭐</Text>
              <Text className="text-white font-semibold">信用分</Text>
            </View>
            <Text className="text-dawn text-2xl font-bold">{creditScore}</Text>
          </View>
          <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${creditScore}%`, backgroundColor: '#FFD166' }}
            />
          </View>
          <Text className="text-white/40 text-xs mt-2">信用良好，继续保持</Text>
        </GlassCard>

        <View className="flex-row gap-4 mb-6">
          <GlassCard padding="md" glowColor="#5BC0BE" className="flex-1">
            <View className="items-center">
              <Text className="text-bioluminescent text-2xl font-bold">23</Text>
              <Text className="text-white/50 text-xs mt-1">扔出的瓶子</Text>
            </View>
          </GlassCard>
          <GlassCard padding="md" glowColor="#5BC0BE" className="flex-1">
            <View className="items-center">
              <Text className="text-bioluminescent text-2xl font-bold">17</Text>
              <Text className="text-white/50 text-xs mt-1">捞到的瓶子</Text>
            </View>
          </GlassCard>
          <GlassCard padding="md" glowColor="#5BC0BE" className="flex-1">
            <View className="items-center">
              <Text className="text-bioluminescent text-2xl font-bold">8</Text>
              <Text className="text-white/50 text-xs mt-1">好友</Text>
            </View>
          </GlassCard>
        </View>

        <Text className="text-white/70 text-sm font-medium mb-3">设置</Text>

        <View className="gap-3">
          {settingItems.map((item) => (
            <GlassCard
              key={item.id}
              padding="md"
              glowColor="rgba(255,255,255,0.1)"
              onPress={() => {}}
            >
              <Pressable className="flex-row items-center gap-4">
                <View className="w-10 h-10 rounded-xl bg-white/5 items-center justify-center">
                  <Text className="text-xl">{item.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">{item.title}</Text>
                  {item.subtitle && (
                    <Text className="text-white/40 text-xs mt-0.5">{item.subtitle}</Text>
                  )}
                </View>
                <Text className="text-white/30 text-lg">›</Text>
              </Pressable>
            </GlassCard>
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
