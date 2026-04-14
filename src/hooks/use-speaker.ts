import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { APP_CONFIG } from '../constants';
import { useAudioStore } from '../store/use-audio-store';
import { AudioState } from '../types';
import { delay, switchAudioRecording } from '../utils';

export const useAudioSpeaker = () => {
  const { recordedUri, speechStartOffsetMs, updateAudioState } = useAudioStore();
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const resetToMonitoring = useCallback(async () => {
    await switchAudioRecording({ enable: true });
    await delay();

    updateAudioState({
      recordedUri: null,
      speechStartOffsetMs: null,
      state: AudioState.Monitoring
    });
  }, [updateAudioState]);

  useEffect(() => {
    if (!recordedUri) return;

    const playVoice = async () => {
      try {
        await switchAudioRecording({ enable: false });

        player.replace({ uri: recordedUri });
        player.setPlaybackRate(APP_CONFIG.PITCH_RATE, 'high');

        const seekTime = Math.max(0, (speechStartOffsetMs ?? 0) / 1000 - 1);

        player.seekTo(seekTime);

        updateAudioState({ state: AudioState.Playing });

        await delay();
        player.play();
      } catch (error) {
        await resetToMonitoring();
        Alert.alert('Error', 'Failed to play audio');
      }
    };

    playVoice();
  }, [recordedUri]);

  useEffect(() => {
    if (status.didJustFinish) {
      resetToMonitoring();
    }
  }, [status.didJustFinish]);

  return { isPlaying: status.playing };
};
