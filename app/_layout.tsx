import { Stack } from 'expo-router';

import { AUDIO_CONFIG } from '@/src/constants';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: AUDIO_CONFIG.BACKGROUND_COLOR } }} />
  );
}
