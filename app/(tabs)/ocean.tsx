import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '@/components/ui';

interface Creature {
  id: string;
  name: string;
  emoji: string;
  rarity: string;
  unlocked: boolean;
}

const creatures: Creature[] = [
  { id: '1', name: '荧光水母', emoji: '🪼', rarity: '普通', unlocked: true },
  { id: '2', name: '深海蓝鲸', emoji: '🐋', rarity: '稀有', unlocked: true },
  { id: '3', name: '彩虹珊瑚', emoji: '🪸', rarity: '普通', unlocked: true },
  { id: '4', name: '星光海豚', emoji: '🐬', rarity: '稀有', unlocked: true },
  { id: '5', name: '月光章鱼', emoji: '🐙', rarity: '史诗', unlocked: false },
  { id: '6', name: '深海龙王', emoji: '🐉', rarity: '传说', unlocked: false },
];

export default function OceanScreen() {
  const oceanLevel = 7;
  const oceanEnergy = 842;
  const nextLevelEnergy = 1000;
  const progress = (oceanEnergy / nextLevelEnergy) * 100;

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-white text-2xl font-bold mb-6">我的海域</Text>

        <GlassCard padding="lg" glowColor="#5BC0BE" className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white/60 text-sm">海域等级</Text>
              <Text className="text-bioluminescent text-3xl font-bold">Lv.{oceanLevel}</Text>
            </View>
            <View className="items-end">
              <Text className="text-white/60 text-sm">海洋能量</Text>
              <Text className="text-dawn text-2xl font-bold">{oceanEnergy} / {nextLevelEnergy}</Text>
            </View>
          </View>
          
          <View className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: '#5BC0BE' }}
            />
          </View>
          <Text className="text-white/40 text-xs mt-2 text-right">
            距离下一级还需 {nextLevelEnergy - oceanEnergy} 能量
          </Text>
        </GlassCard>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-lg font-semibold">海洋生物图鉴</Text>
          <Text className="text-white/50 text-sm">
            {creatures.filter(c => c.unlocked).length} / {creatures.length}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-4">
          {creatures.map((creature) => (
            <View key={creature.id} className="w-[calc(50%-8px)]">
              <GlassCard
                padding="md"
                glowColor={creature.unlocked ? '#5BC0BE' : 'rgba(255,255,255,0.2)'}
              >
                <View className="items-center">
                  <Text className="text-4xl mb-2" style={{ opacity: creature.unlocked ? 1 : 0.3 }}>
                    {creature.emoji}
                  </Text>
                  <Text
                    className="text-white font-semibold text-sm"
                    style={{ opacity: creature.unlocked ? 1 : 0.3 }}
                  >
                    {creature.name}
                  </Text>
                  <Text
                    className="text-xs mt-1"
                    style={{
                      color: creature.unlocked
                        ? creature.rarity === '传说'
                          ? '#FFD166'
                          : creature.rarity === '史诗'
                          ? '#C084FC'
                          : creature.rarity === '稀有'
                          ? '#60A5FA'
                          : '#5BC0BE'
                        : 'rgba(255,255,255,0.3)',
                    }}
                  >
                    {creature.unlocked ? creature.rarity : '???'}
                  </Text>
                </View>
              </GlassCard>
            </View>
          ))}
        </View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
