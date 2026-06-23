import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/components/ui';

export default function HomeScreen() {
  const oceanEnergy = 842;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-white text-2xl font-bold">星海漂流</Text>
          <GlassCard padding="sm" glowColor="#5BC0BE" className="flex-row items-center gap-2">
            <Text className="text-bioluminescent text-lg">✧</Text>
            <Text className="text-white font-semibold">{oceanEnergy}</Text>
          </GlassCard>
        </View>

        <View className="flex-1 items-center justify-center relative">
          <View className="relative w-72 h-72 items-center justify-center">
            <View className="absolute w-72 h-72 rounded-full opacity-20" style={{ backgroundColor: '#5BC0BE' }} />
            <View className="absolute w-56 h-56 rounded-full opacity-30" style={{ backgroundColor: '#5BC0BE' }} />
            <View className="absolute w-40 h-40 rounded-full opacity-40" style={{ backgroundColor: '#5BC0BE' }} />
            
            <LinearGradient
              colors={['rgba(91, 192, 190, 0.6)', 'rgba(91, 192, 190, 0.1)']}
              className="w-28 h-28 rounded-full items-center justify-center"
            >
              <Text className="text-5xl">🌊</Text>
            </LinearGradient>

            <View className="absolute top-12 left-8 w-3 h-3 rounded-full bg-bioluminescent opacity-60" />
            <View className="absolute top-20 right-12 w-2 h-2 rounded-full bg-white opacity-40" />
            <View className="absolute bottom-16 left-16 w-4 h-4 rounded-full bg-dawn opacity-50" />
            <View className="absolute bottom-24 right-8 w-2 h-2 rounded-full bg-bioluminescent opacity-70" />
            <View className="absolute top-32 left-4 w-2 h-2 rounded-full bg-white opacity-30" />
            <View className="absolute bottom-8 right-24 w-3 h-3 rounded-full bg-bioluminescent opacity-50" />
          </View>

          <Text className="text-white/60 text-base mt-8 text-center">
            在这片神秘的星海中{'\n'}每一个漂流瓶都承载着故事
          </Text>
        </View>

        <View className="gap-4 mb-4">
          <GlassCard
            padding="lg"
            glowColor="#FFD166"
            onPress={() => {}}
          >
            <Pressable className="flex-row items-center justify-center gap-3">
              <Text className="text-3xl">🏮</Text>
              <View>
                <Text className="text-dawn text-xl font-bold">扔漂流瓶</Text>
                <Text className="text-white/50 text-sm">把你的故事投向星海</Text>
              </View>
            </Pressable>
          </GlassCard>

          <GlassCard
            padding="lg"
            glowColor="#5BC0BE"
            onPress={() => {}}
          >
            <Pressable className="flex-row items-center justify-center gap-3">
              <Text className="text-3xl">🎣</Text>
              <View>
                <Text className="text-bioluminescent text-xl font-bold">捞漂流瓶</Text>
                <Text className="text-white/50 text-sm">邂逅未知的温暖</Text>
              </View>
            </Pressable>
          </GlassCard>
        </View>
      </View>
    </SafeAreaView>
  );
}
