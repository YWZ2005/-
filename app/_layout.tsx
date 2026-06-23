import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DeepSeaBackground } from '@/components/ui';
import './global.css';

export default function RootLayout() {
  return (
    <DeepSeaBackground intensity="medium">
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </DeepSeaBackground>
  );
}
