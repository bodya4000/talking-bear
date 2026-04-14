import { Stack } from 'expo-router';

import { APP_CONFIG } from '@/src/constants';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: APP_CONFIG.BACKGROUND_COLOR } }} />
  );
}
