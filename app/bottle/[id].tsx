import { View, Text, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui';

export default function BottleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const bottleType = '文字';
  const bottleContent = `你好，陌生的朋友：

今夜的星空格外明亮，我坐在海边，听着海浪声，突然想把这份心情装进瓶子里，投向未知的你。

不知道你现在在哪里，过着怎样的生活？也许你正在为梦想努力，也许你正在经历低谷，但请相信，一切都会好起来的。

我喜欢在深夜看星星，每一颗星星都像是宇宙写给地球的情书。希望这封来自星海的信，能给你带来一点点温暖。

愿你眼中有星辰，心中有大海。

—— 来自某个夜晚的漂流者`;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <Text className="text-white text-xl">‹</Text>
          </Pressable>
          <Text className="flex-1 text-center text-white text-lg font-semibold mr-10">
            漂流瓶
          </Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-bioluminescent/20 items-center justify-center mb-4">
              <Text className="text-5xl">🏮</Text>
            </View>
            <View className="px-4 py-1.5 rounded-full bg-bioluminescent/20">
              <Text className="text-bioluminescent text-sm font-medium">{bottleType}瓶</Text>
            </View>
          </View>

          <GlassCard padding="xl" glowColor="#5BC0BE" className="mb-6">
            <Text className="text-white/60 text-xs text-center mb-4">
              · 来自星海的一封信 ·
            </Text>
            <Text className="text-white leading-7 text-base whitespace-pre-line">
              {bottleContent}
            </Text>
            <View className="mt-6 pt-4 border-t border-white/10">
              <Text className="text-white/40 text-xs text-right">
                漂流了 3 天 12 小时
              </Text>
            </View>
          </GlassCard>

          <View className="flex-row justify-center gap-6 mb-6">
            <View className="items-center">
              <View className="w-12 h-12 rounded-full bg-dawn/20 items-center justify-center mb-2">
                <Text className="text-xl">💫</Text>
              </View>
              <Text className="text-white/50 text-xs">温暖</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 rounded-full bg-bioluminescent/20 items-center justify-center mb-2">
                <Text className="text-xl">🌊</Text>
              </View>
              <Text className="text-white/50 text-xs">共鸣</Text>
            </View>
            <View className="items-center">
              <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center mb-2">
                <Text className="text-xl">✨</Text>
              </View>
              <Text className="text-white/50 text-xs">收藏</Text>
            </View>
          </View>

          <View className="h-4" />
        </ScrollView>

        <GlassCard
          padding="lg"
          glowColor="#5BC0BE"
          onPress={() => router.push(`/chat/${id}`)}
        >
          <Pressable className="flex-row items-center justify-center gap-2">
            <Text className="text-2xl">💬</Text>
            <Text className="text-bioluminescent text-lg font-bold">打开聊天</Text>
          </Pressable>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}
