import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect } from 'react';
import { Alert } from 'react-native';

import { AUDIO_CONFIG } from '../constants';
import { AudioPhase, useAudioStore } from './use-audio-store';
import { switchAudioRecording } from './utils';

export const useAudioSpeaker = () => {
  const { recordedUri, speechStartOffsetMs, updateAudioState } = useAudioStore();
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  const resetToMonitoring = useCallback(async () => {
    switchAudioRecording({ enable: true });
    updateAudioState({
      recordedUri: null,
      speechStartOffsetMs: null,
      phase: AudioPhase.Monitoring,
    });
  }, [updateAudioState]);

  useEffect(() => {
    if (!recordedUri) return;

    const playVoice = async () => {
      try {
        await switchAudioRecording({ enable: false });

        player.replace({ uri: recordedUri });
        player.setPlaybackRate(AUDIO_CONFIG.PITCH_RATE, 'high');

        const seekTime = Math.max(0, (speechStartOffsetMs ?? 0) / 1000 - 1);
        player.seekTo(seekTime);

        updateAudioState({ phase: AudioPhase.Playing });

        player.play();
      } catch (error) {
        await resetToMonitoring();
        Alert.alert('Error', 'Failed to play audio');
      }
    };

    playVoice();
  }, [recordedUri]);


  console.log('useAudioSpeaker: status', status.didJustFinish);


  useEffect(() => {
    if (status.didJustFinish) {
      resetToMonitoring();
    }
  }, [status.didJustFinish]);

  return { isPlaying: status.playing };
};
