import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect } from 'react';
import { Alert } from 'react-native';

import { AUDIO_CONFIG } from '../constants';
import { AudioPhase, useAudioStore } from './use-audio-store';
import { switchAudioRecording } from './utils';

export const useAudioSpeaker = () => {
  const { recordedUri, speechStartOffsetMs, phase, updateAudioState } = useAudioStore();
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (!recordedUri || phase === AudioPhase.Playing) return;

    const playVoice = async () => {
      try {
        await switchAudioRecording({ enable: false });

        updateAudioState({ phase: AudioPhase.Playing });

        player.replace({ uri: recordedUri });
        updateAudioState({ recordedUri: null });

        player.seekTo((speechStartOffsetMs ? speechStartOffsetMs - 500 : 0) / 1000);
        player.setPlaybackRate(AUDIO_CONFIG.PITCH_RATE, 'medium');
        player.play();
      } catch (error) {
        Alert.alert('Failed to play audio');
      }
    };

    playVoice();
  }, [recordedUri, phase]);

  useEffect(() => {
    if (status.didJustFinish) {
      updateAudioState({ recordedUri: null, phase: AudioPhase.Monitoring });
    }
  }, [status.didJustFinish]);

  return { isPlaying: status.playing };
};
