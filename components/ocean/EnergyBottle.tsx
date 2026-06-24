import React, { memo, useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { GlassCard } from '@/components/ui';
import type { ExchangeItem } from '@/types';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface EnergyBottleProps {
  currentExp: number;
  onExchange: (itemId: string, cost: number) => Promise<boolean>;
  exchangeItems: ExchangeItem[];
}

interface ExchangeItemCardProps {
  item: ExchangeItem;
  canAfford: boolean;
  onExchange: (item: ExchangeItem) => void;
  exchanging: boolean;
}

const ExchangeItemCard = memo(function ExchangeItemCard({
  item,
  canAfford,
  onExchange,
  exchanging,
}: ExchangeItemCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (canAfford && !exchanging) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  }, [canAfford, exchanging, scale]);

  const handlePressOut = useCallback(() => {
    if (canAfford && !exchanging) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [canAfford, exchanging, scale]);

  const handlePress = useCallback(() => {
    if (canAfford && !exchanging) {
      onExchange(item);
    }
  }, [canAfford, exchanging, onExchange, item]);

  return (
    <Animated.View style={animatedStyle}>
      <GlassCard
        glowColor={canAfford ? '#5BC0BE' : 'rgba(255,255,255,0.1)'}
        padding="md"
        onPress={canAfford && !exchanging ? handlePress : undefined}
      >
        <View className="flex-row items-center gap-3">
          <Text style={{ fontSize: 36 }}>{item.icon}</Text>
          <View className="flex-1">
            <Text className="text-white font-semibold text-base">{item.name}</Text>
            <Text className="text-white/50 text-sm mt-0.5">{item.description}</Text>
          </View>
          <View className="items-end">
            <Text
              className={`font-semibold text-sm ${
                canAfford ? 'text-bioluminescent' : 'text-white/30'
              }`}
            >
              {item.cost} EXP
            </Text>
            <View
              className={`mt-2 px-4 py-1.5 rounded-full ${
                canAfford
                  ? 'bg-bioluminescent/20 border border-bioluminescent/50'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  canAfford ? 'text-bioluminescent' : 'text-white/30'
                }`}
              >
                {exchanging ? '兑换中...' : '兑换'}
              </Text>
            </View>
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
});

function EnergyBottle({ currentExp, onExchange, exchangeItems }: EnergyBottleProps) {
  const [visible, setVisible] = useState(false);
  const [exchangingId, setExchangingId] = useState<string | null>(null);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);
  const bottleScale = useSharedValue(1);
  const bottleFloat = useSharedValue(0);

  useEffect(() => {
    bottleFloat.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [bottleFloat]);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(0.6, { duration: 300 });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.8,
      });
    } else {
      overlayOpacity.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    }
  }, [visible, overlayOpacity, translateY]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const drawerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const bottleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bottleScale.value },
      { translateY: bottleFloat.value },
    ],
  }));

  const handleOpen = useCallback(() => {
    setVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  const handlePressIn = useCallback(() => {
    bottleScale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  }, [bottleScale]);

  const handlePressOut = useCallback(() => {
    bottleScale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [bottleScale]);

  const handleExchange = useCallback(
    async (item: ExchangeItem) => {
      if (currentExp < item.cost) {
        return;
      }

      setExchangingId(item.id);
      try {
        const success = await onExchange(item.id, item.cost);
        if (success) {
          Alert.alert('兑换成功', `已成功兑换 ${item.name}`);
        } else {
          Alert.alert('兑换失败', '请稍后重试');
        }
      } catch {
        Alert.alert('兑换失败', '发生错误，请稍后重试');
      } finally {
        setExchangingId(null);
      }
    },
    [currentExp, onExchange],
  );

  return (
    <>
      <Pressable
        onPress={handleOpen}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          {
            position: 'absolute',
            right: 20,
            bottom: 100,
            zIndex: 100,
          },
        ]}
      >
        <Animated.View style={bottleAnimatedStyle}>
          <GlassCard
            glowColor="#5BC0BE"
            padding="md"
            className="items-center justify-center"
            style={{
              width: 70,
              height: 70,
              borderRadius: 35,
              padding: 0,
            }}
          >
            <View className="items-center">
              <Text style={{ fontSize: 28 }}>⚡</Text>
              <Text className="text-bioluminescent text-xs font-bold mt-1">
                {currentExp >= 1000
                  ? `${(currentExp / 1000).toFixed(1)}k`
                  : currentExp}
              </Text>
            </View>
          </GlassCard>
        </Animated.View>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
      >
        <View style={{ flex: 1 }}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#000000',
              },
              overlayAnimatedStyle,
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={handleClose} />
          </Animated.View>

          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#1C2541',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: SCREEN_HEIGHT * 0.75,
              },
              drawerAnimatedStyle,
            ]}
          >
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: 'rgba(91, 192, 190, 0.4)',
                borderRadius: 2,
                alignSelf: 'center',
                marginTop: 12,
                marginBottom: 8,
              }}
            />

            <View className="px-6 pt-2 pb-4">
              <Text className="text-white text-xl font-bold text-center">
                能量瓶兑换
              </Text>
              <View className="flex-row items-center justify-center mt-2 gap-2">
                <Text style={{ fontSize: 20 }}>⚡</Text>
                <Text className="text-bioluminescent text-lg font-semibold">
                  当前能量：{currentExp.toLocaleString()} EXP
                </Text>
              </View>
            </View>

            <ScrollView
              style={{ maxHeight: SCREEN_HEIGHT * 0.55 }}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {exchangeItems.map((item) => (
                <ExchangeItemCard
                  key={item.id}
                  item={item}
                  canAfford={currentExp >= item.cost}
                  onExchange={handleExchange}
                  exchanging={exchangingId === item.id}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

export default memo(EnergyBottle);
