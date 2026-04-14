import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect } from 'react';

import { AUDIO_CONFIG } from '../constants';
import { AudioPhase, useAudioStore } from './use-audio-store';
import { delay, switchAudioRecording } from './utils';

export const useAudioSpeaker = () => {
  const { recordedUri, speechStartOffsetMs, phase, updateAudioState } = useAudioStore();
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (!recordedUri || phase === AudioPhase.Playing) return;

    const playVoice = async () => {
      try {
        await switchAudioRecording({ enable: false });
        await delay(200);

        updateAudioState({ phase: AudioPhase.Playing });

        player.replace({ uri: recordedUri });
        updateAudioState({ recordedUri: null });

        player.seekTo((speechStartOffsetMs ? speechStartOffsetMs - 500 : 0) / 1000);
        player.setPlaybackRate(AUDIO_CONFIG.PITCH_RATE, 'medium');
        player.play();
      } catch (error) {
        console.error('Playback error:', error);
        updateAudioState({ phase: AudioPhase.Monitoring });
      }
    };

    playVoice();
  }, [recordedUri, phase]);

  useEffect(() => {
    const resetToMonitoring = async () => {
      await delay(200);
      updateAudioState({ recordedUri: null, phase: AudioPhase.Monitoring });
    };

    if (status.didJustFinish) {
      resetToMonitoring();
    }
  }, [phase, status.didJustFinish]);

  return { isPlaying: status.playing };
};
