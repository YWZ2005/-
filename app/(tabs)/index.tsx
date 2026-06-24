import React, { useState, useCallback, memo } from 'react';
import { View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { GlassCard } from '@/components/ui';
import {
  BottomDrawer,
  ThrowBottleAnimation,
  RadarScan,
  TextBottleSheet,
} from '@/components/bottle';
import { useBottle } from '@/hooks/useBottle';
import { TextBottleContent, BottleType } from '@/types';

type DrawerType = 'throwOptions' | 'textBottle' | null;
type ThrowType = 'text' | 'voice' | 'draw';

function HomeScreen() {
  const router = useRouter();
  const { isThrowing, isFishing, error, throwBottle, fishBottle } = useBottle();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(null);
  const [throwAnimVisible, setThrowAnimVisible] = useState(false);
  const [throwAnimType, setThrowAnimType] = useState<BottleType>('text');
  const [radarVisible, setRadarVisible] = useState(false);
  const [radarScanning, setRadarScanning] = useState(false);
  const [dailyThrowCount] = useState(0);

  const openDrawer = useCallback((type: DrawerType) => {
    setDrawerType(type);
    setDrawerVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
    setTimeout(() => setDrawerType(null), 300);
  }, []);

  const handleThrowPress = useCallback(() => {
    openDrawer('throwOptions');
  }, [openDrawer]);

  const handleSelectThrowType = useCallback((type: ThrowType) => {
    closeDrawer();
    if (type === 'text') {
      setTimeout(() => openDrawer('textBottle'), 350);
    } else if (type === 'voice') {
      Alert.alert('语音瓶', '语音录制功能将在后续版本中开放，敬请期待！');
    } else if (type === 'draw') {
      Alert.alert('手绘瓶', '手绘功能将在后续版本中开放，敬请期待！');
    }
  }, [closeDrawer, openDrawer]);

  const handleSubmitTextBottle = useCallback(async (text: string, tags: string[]) => {
    const content: TextBottleContent = { text };
    const result = await throwBottle({ type: 'text', content, tags });

    if (result.success) {
      closeDrawer();
      setThrowAnimType('text');
      setTimeout(() => setThrowAnimVisible(true), 300);
    } else {
      Alert.alert('投递失败', result.error ?? '请稍后重试');
    }
  }, [throwBottle, closeDrawer]);

  const handleThrowAnimComplete = useCallback(() => {
    setThrowAnimVisible(false);
    Alert.alert('投递成功', '你的漂流瓶已投向星海，等待有缘人捞取 🌊');
  }, []);

  const handleFishPress = useCallback(async () => {
    setRadarVisible(true);
    setRadarScanning(true);

    const result = await fishBottle();

    if (result.success && result.bottle) {
      const bottle = result.bottle;
      setRadarScanning(false);
      setTimeout(() => {
        setRadarVisible(false);
        setTimeout(() => {
          router.push(`/bottle/${bottle.id}`);
        }, 300);
      }, 1000);
    } else {
      setRadarScanning(false);
      setTimeout(() => {
        setRadarVisible(false);
        setTimeout(() => {
          Alert.alert('捞瓶提示', result.error ?? '星海暂时没有漂流瓶');
        }, 300);
      }, 500);
    }
  }, [fishBottle, router]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 py-4">
        <View className="flex-row items-center justify-between mb-8">
          <Text className="text-white text-2xl font-bold">星海漂流</Text>
          <GlassCard padding="sm" glowColor="#5BC0BE">
            <View className="flex-row items-center gap-2">
              <Text className="text-bioluminescent text-lg">✧</Text>
              <Text className="text-white font-semibold">842</Text>
            </View>
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

          {dailyThrowCount > 0 && (
            <Text className="text-white/40 text-xs mt-3">
              今日已投递 {dailyThrowCount}/3 个漂流瓶
            </Text>
          )}
        </View>

        <View className="gap-4 mb-4">
          <GlassCard
            padding="lg"
            glowColor="#FFD166"
            onPress={handleThrowPress}
          >
            <View className="flex-row items-center justify-center gap-3">
              <Text className="text-3xl">🏮</Text>
              <View>
                <Text className="text-dawn text-xl font-bold">扔漂流瓶</Text>
                <Text className="text-white/50 text-sm">把你的故事投向星海</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard
            padding="lg"
            glowColor="#5BC0BE"
            onPress={handleFishPress}
          >
            <View className="flex-row items-center justify-center gap-3">
              <Text className="text-3xl">🎣</Text>
              <View>
                <Text className="text-bioluminescent text-xl font-bold">捞漂流瓶</Text>
                <Text className="text-white/50 text-sm">邂逅未知的温暖</Text>
              </View>
            </View>
          </GlassCard>
        </View>
      </View>

      <BottomDrawer visible={drawerVisible && drawerType === 'throwOptions'} onClose={closeDrawer} height={40}>
        <View className="flex-1 px-6 pt-2">
          <Text className="text-white text-lg font-semibold text-center mb-6">选择漂流瓶类型</Text>
          <View className="gap-4">
            <GlassCard padding="lg" glowColor="#FFD166" onPress={() => handleSelectThrowType('text')}>
              <View className="flex-row items-center gap-4">
                <Text className="text-3xl">🏮</Text>
                <View className="flex-1">
                  <Text className="text-dawn text-lg font-bold">文字漂流瓶</Text>
                  <Text className="text-white/50 text-sm">写下你的心事，投向星海</Text>
                </View>
                <Text className="text-white/30 text-xl">›</Text>
              </View>
            </GlassCard>

            <GlassCard padding="lg" glowColor="#5BC0BE" onPress={() => handleSelectThrowType('voice')}>
              <View className="flex-row items-center gap-4">
                <Text className="text-3xl">🎙️</Text>
                <View className="flex-1">
                  <Text className="text-bioluminescent text-lg font-bold">语音漂流瓶</Text>
                  <Text className="text-white/50 text-sm">用声音传递你的温度</Text>
                </View>
                <Text className="text-white/30 text-xl">›</Text>
              </View>
            </GlassCard>

            <GlassCard padding="lg" glowColor="#5BC0BE" onPress={() => handleSelectThrowType('draw')}>
              <View className="flex-row items-center gap-4">
                <Text className="text-3xl">🎨</Text>
                <View className="flex-1">
                  <Text className="text-bioluminescent text-lg font-bold">手绘漂流瓶</Text>
                  <Text className="text-white/50 text-sm">画出你此刻的心情</Text>
                </View>
                <Text className="text-white/30 text-xl">›</Text>
              </View>
            </GlassCard>
          </View>
        </View>
      </BottomDrawer>

      <BottomDrawer visible={drawerVisible && drawerType === 'textBottle'} onClose={closeDrawer} height={70}>
        <TextBottleSheet
          onSubmit={handleSubmitTextBottle}
          onClose={closeDrawer}
          isSubmitting={isThrowing}
        />
      </BottomDrawer>

      <ThrowBottleAnimation
        visible={throwAnimVisible}
        bottleType={throwAnimType}
        onComplete={handleThrowAnimComplete}
      />

      <RadarScan
        visible={radarVisible}
        scanning={radarScanning}
      />

      {error && (
        <View className="absolute bottom-4 left-4 right-4 bg-red-500/90 px-4 py-3 rounded-xl">
          <Text className="text-white text-sm text-center">{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default memo(HomeScreen);
