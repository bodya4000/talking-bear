import { setAudioModeAsync } from 'expo-audio';

export const switchAudioRecording = async ({ enable }: { enable: boolean }) => {
  await setAudioModeAsync({
    allowsRecording: enable,
    playsInSilentMode: true,
  });
};
