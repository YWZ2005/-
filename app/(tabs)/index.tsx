import React, { useState, useCallback, memo } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
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
    <SafeAreaView style={styles.flex1}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>星海漂流</Text>
          <GlassCard padding="sm" glowColor="#5BC0BE">
            <View style={styles.energyContainer}>
              <Text style={styles.energyIcon}>✧</Text>
              <Text style={styles.energyText}>842</Text>
            </View>
          </GlassCard>
        </View>

        <View style={styles.centerContent}>
          <View style={styles.oceanCircle}>
            <View style={[styles.circleLayer, styles.circleOuter]} />
            <View style={[styles.circleLayer, styles.circleMiddle]} />
            <View style={[styles.circleLayer, styles.circleInner]} />

            <LinearGradient
              colors={['rgba(91, 192, 190, 0.6)', 'rgba(91, 192, 190, 0.1)']}
              style={styles.centerButton}
            >
              <Text style={styles.waveEmoji}>🌊</Text>
            </LinearGradient>

            <View style={[styles.particle, styles.particle1]} />
            <View style={[styles.star, styles.star1]} />
            <View style={[styles.glowDot, styles.glowDot1]} />
            <View style={[styles.particle, styles.particle2]} />
            <View style={[styles.star, styles.star2]} />
            <View style={[styles.glowDot, styles.glowDot2]} />
          </View>

          <Text style={styles.subtitle}>
            在这片神秘的星海中{'\n'}每一个漂流瓶都承载着故事
          </Text>

          {dailyThrowCount > 0 && (
            <Text style={styles.dailyCount}>
              今日已投递 {dailyThrowCount}/3 个漂流瓶
            </Text>
          )}
        </View>

        <View style={styles.buttonGroup}>
          <GlassCard
            padding="lg"
            glowColor="#FFD166"
            onPress={handleThrowPress}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🏮</Text>
              <View>
                <Text style={[styles.buttonTitle, { color: '#FFD166' }]}>扔漂流瓶</Text>
                <Text style={styles.buttonSubtitle}>把你的故事投向星海</Text>
              </View>
            </View>
          </GlassCard>

          <GlassCard
            padding="lg"
            glowColor="#5BC0BE"
            onPress={handleFishPress}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🎣</Text>
              <View>
                <Text style={[styles.buttonTitle, { color: '#5BC0BE' }]}>捞漂流瓶</Text>
                <Text style={styles.buttonSubtitle}>邂逅未知的温暖</Text>
              </View>
            </View>
          </GlassCard>
        </View>
      </View>

      <BottomDrawer visible={drawerVisible && drawerType === 'throwOptions'} onClose={closeDrawer} height={40}>
        <View style={styles.drawerContent}>
          <Text style={styles.drawerTitle}>选择漂流瓶类型</Text>
          <View style={styles.drawerOptions}>
            <GlassCard padding="lg" glowColor="#FFD166" onPress={() => handleSelectThrowType('text')}>
              <View style={styles.optionItem}>
                <Text style={styles.optionIcon}>🏮</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: '#FFD166' }]}>文字漂流瓶</Text>
                  <Text style={styles.optionSubtitle}>写下你的心事，投向星海</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </View>
            </GlassCard>

            <GlassCard padding="lg" glowColor="#5BC0BE" onPress={() => handleSelectThrowType('voice')}>
              <View style={styles.optionItem}>
                <Text style={styles.optionIcon}>🎙️</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: '#5BC0BE' }]}>语音漂流瓶</Text>
                  <Text style={styles.optionSubtitle}>用声音传递你的温度</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
              </View>
            </GlassCard>

            <GlassCard padding="lg" glowColor="#5BC0BE" onPress={() => handleSelectThrowType('draw')}>
              <View style={styles.optionItem}>
                <Text style={styles.optionIcon}>🎨</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: '#5BC0BE' }]}>手绘漂流瓶</Text>
                  <Text style={styles.optionSubtitle}>画出你此刻的心情</Text>
                </View>
                <Text style={styles.optionArrow}>›</Text>
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
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  energyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  energyIcon: {
    color: '#5BC0BE',
    fontSize: 18,
  },
  energyText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  oceanCircle: {
    width: 288,
    height: 288,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleLayer: {
    position: 'absolute',
    borderRadius: 144,
  },
  circleOuter: {
    width: 288,
    height: 288,
    backgroundColor: '#5BC0BE',
    opacity: 0.2,
  },
  circleMiddle: {
    width: 224,
    height: 224,
    backgroundColor: '#5BC0BE',
    opacity: 0.3,
  },
  circleInner: {
    width: 160,
    height: 160,
    backgroundColor: '#5BC0BE',
    opacity: 0.4,
  },
  centerButton: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveEmoji: {
    fontSize: 48,
  },
  particle: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5BC0BE',
    opacity: 0.6,
  },
  particle1: {
    top: 48,
    left: 32,
  },
  particle2: {
    bottom: 96,
    right: 32,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.7,
  },
  star: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.4,
  },
  star1: {
    top: 80,
    right: 48,
  },
  star2: {
    top: 128,
    left: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.3,
  },
  glowDot: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFD166',
    opacity: 0.5,
  },
  glowDot1: {
    bottom: 64,
    left: 64,
  },
  glowDot2: {
    bottom: 32,
    right: 96,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5BC0BE',
    opacity: 0.5,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    marginTop: 32,
    textAlign: 'center',
  },
  dailyCount: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    marginTop: 12,
  },
  buttonGroup: {
    gap: 16,
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  buttonIcon: {
    fontSize: 32,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
  drawerContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  drawerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  drawerOptions: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optionIcon: {
    fontSize: 32,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
  },
  optionArrow: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 20,
  },
  errorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default memo(HomeScreen);