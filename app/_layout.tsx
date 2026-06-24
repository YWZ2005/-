import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { useEffect } from 'react';
import { DeepSeaBackground } from '@/components/ui';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.style.backgroundColor = '#0B132B';
      document.body.style.backgroundColor = '#0B132B';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      const root = document.getElementById('root');
      if (root) {
        root.style.backgroundColor = '#0B132B';
        root.style.height = '100%';
        root.style.width = '100%';
      }
    }
  }, []);

  return (
    <View style={styles.root}>
      <DeepSeaBackground intensity="medium">
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0B132B' },
          }}
        />
      </DeepSeaBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B132B',
    height: '100%',
    width: '100%',
  },
});