import { setAudioModeAsync } from 'expo-audio';

export const switchAudioRecording = async ({ enable }: { enable: boolean }) => {
  await setAudioModeAsync({
    allowsRecording: enable,
    playsInSilentMode: true,
  });
};

export const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));
