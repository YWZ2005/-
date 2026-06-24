import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  OceanStageHeader,
  AssetGrid,
  EnergyBottle,
} from '@/components/ocean';
import { GlassCard, DeepSeaBackground } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import {
  getCurrentStage,
  consumeExp,
  getUnlockedAssets,
} from '@/services/oceanExp';
import { OCEAN_STAGES } from '@/data/oceanStages';
import { OCEAN_ASSETS } from '@/data/oceanAssets';
import { EXCHANGE_ITEMS } from '@/data/exchangeItems';
import type { AssetConfig, AssetType } from '@/types';

type FilterType = 'all' | AssetType;

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'creature', label: '生物' },
  { key: 'landscape', label: '景观' },
  { key: 'decoration', label: '装饰' },
  { key: 'effect', label: '特效' },
];

const RARITY_LABEL_MAP: Record<string, string> = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

export default function OceanScreen() {
  const insets = useSafeAreaInsets();
  const [currentExp, setCurrentExp] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [userId, setUserId] = useState<string | null>(null);

  const fetchOceanData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError('请先登录');
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error: fetchError } = await supabase
        .from('users')
        .select('ocean_energy')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setCurrentExp(data?.ocean_energy ?? 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOceanData();
  }, [fetchOceanData]);

  const stageInfo = useMemo(() => {
    return getCurrentStage(currentExp);
  }, [currentExp]);

  const unlockedAssets = useMemo(() => {
    return getUnlockedAssets(currentExp, OCEAN_ASSETS);
  }, [currentExp]);

  const filteredAssets = useMemo(() => {
    if (selectedFilter === 'all') {
      return OCEAN_ASSETS;
    }
    return OCEAN_ASSETS.filter((asset) => asset.type === selectedFilter);
  }, [selectedFilter]);

  const handleAssetPress = useCallback((asset: AssetConfig) => {
    const isUnlocked = currentExp >= asset.requiredExp;
    Alert.alert(
      isUnlocked ? asset.name : '???',
      isUnlocked
        ? `稀有度：${RARITY_LABEL_MAP[asset.rarity]}\n${asset.description}`
        : `解锁所需：${asset.requiredExp} EXP\n继续探索海域来解锁吧！`,
      [{ text: '确定', style: 'default' }],
    );
  }, [currentExp]);

  const handleExchange = useCallback(
    async (itemId: string, cost: number): Promise<boolean> => {
      if (!userId) {
        Alert.alert('错误', '请先登录');
        return false;
      }

      const result = await consumeExp(userId, cost);
      if (result.success) {
        setCurrentExp(result.remaining);
        return true;
      } else {
        Alert.alert('兑换失败', result.error ?? '请稍后重试');
        return false;
      }
    },
    [userId],
  );

  const handleRetry = useCallback(() => {
    fetchOceanData();
  }, [fetchOceanData]);

  const nextStageExp = stageInfo.nextStage
    ? stageInfo.nextStage.minExp
    : stageInfo.stage.maxExp;

  if (loading) {
    return (
      <DeepSeaBackground intensity="low">
        <View
          style={{ paddingTop: insets.top }}
          className="flex-1 justify-center items-center"
        >
          <ActivityIndicator size="large" color="#5BC0BE" />
          <Text className="text-white/60 mt-4">加载中...</Text>
        </View>
      </DeepSeaBackground>
    );
  }

  if (error) {
    return (
      <DeepSeaBackground intensity="low">
        <View
          style={{ paddingTop: insets.top }}
          className="flex-1 justify-center items-center px-8"
        >
          <Text className="text-white text-xl font-bold mb-2">加载失败</Text>
          <Text className="text-white/60 text-center mb-6">{error}</Text>
          <Pressable
            onPress={handleRetry}
            className="px-8 py-3 bg-bioluminescent/20 rounded-full border border-bioluminescent/50"
          >
            <Text className="text-bioluminescent font-semibold">重试</Text>
          </Pressable>
        </View>
      </DeepSeaBackground>
    );
  }

  return (
    <DeepSeaBackground intensity="medium">
      <View style={{ paddingTop: insets.top }} className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-white text-2xl font-bold">我的海域</Text>
          <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-white/5">
            <Text className="text-white/60 text-lg">⋯</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <OceanStageHeader
            stageName={stageInfo.stage.name}
            stageLevel={stageInfo.stage.level}
            stageIcon={stageInfo.stage.icon}
            currentExp={currentExp}
            nextStageExp={nextStageExp}
            progress={stageInfo.progress}
            nextStageName={stageInfo.nextStage?.name}
            primaryColor={stageInfo.stage.primaryColor}
          />

          <View className="flex-row gap-3 mt-4">
            <GlassCard padding="md" className="flex-1" glowColor="#5BC0BE">
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">
                  {unlockedAssets.unlocked.length}
                  <Text className="text-white/40 text-base">
                    {' '}/{OCEAN_ASSETS.length}
                  </Text>
                </Text>
                <Text className="text-white/50 text-xs mt-1">已解锁资产</Text>
              </View>
            </GlassCard>

            <GlassCard padding="md" className="flex-1" glowColor="#63B3ED">
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">0</Text>
                <Text className="text-white/50 text-xs mt-1">本周能量</Text>
              </View>
            </GlassCard>

            <GlassCard padding="md" className="flex-1" glowColor="#B794F4">
              <View className="items-center">
                <Text className="text-white text-2xl font-bold">0</Text>
                <Text className="text-white/50 text-xs mt-1">靠岸次数</Text>
              </View>
            </GlassCard>
          </View>

          <View className="mt-6 mb-2">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4, gap: 8 }}
            >
              {FILTER_TABS.map((tab) => {
                const isActive = selectedFilter === tab.key;
                return (
                  <Pressable
                    key={tab.key}
                    onPress={() => setSelectedFilter(tab.key)}
                    className={`px-5 py-2.5 rounded-full ${
                      isActive
                        ? 'bg-bioluminescent/20 border border-bioluminescent/50'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isActive ? 'text-bioluminescent' : 'text-white/60'
                      }`}
                    >
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View className="flex-row items-center justify-between px-2 mt-4 mb-2">
            <Text className="text-white text-lg font-semibold">资产图鉴</Text>
            <Text className="text-white/50 text-sm">
              {
                filteredAssets.filter((a) => currentExp >= a.requiredExp)
                  .length
              }{' '}
              / {filteredAssets.length}
            </Text>
          </View>

          <View style={{ height: 420 }}>
            <AssetGrid
              assets={filteredAssets}
              currentExp={currentExp}
              onAssetPress={handleAssetPress}
            />
          </View>
        </ScrollView>

        <EnergyBottle
          currentExp={currentExp}
          onExchange={handleExchange}
          exchangeItems={EXCHANGE_ITEMS}
        />
      </View>
    </DeepSeaBackground>
  );
}
