import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect } from 'react';
import { AUDIO_CONFIG } from './constants';
import { AudioPhase, useAudioStore } from './use-audio-store';

export const useAudioSpeaker = () => {
  const { recordedUri, setRecordedUri, setPhase, setSpeechStartOffsetMs } =
    useAudioStore();
  
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    if (!recordedUri) return;

    const playVoice = async () => {
      try {
        setPhase(AudioPhase.Playing);

        player.replace({ uri: recordedUri });
        const skipMs = useAudioStore.getState().speechStartOffsetMs;
        if (skipMs != null && skipMs > 0) {
          await player.seekTo((skipMs - 1000) / 1000);
        }
        setSpeechStartOffsetMs(null);
        player.setPlaybackRate(AUDIO_CONFIG.PITCH_RATE, "medium");
        player.volume = AUDIO_CONFIG.VOLUME;
        player.play();
      } catch {
        setPhase(AudioPhase.Monitoring);
        setRecordedUri(null);
        setSpeechStartOffsetMs(null);
      }
    };

      playVoice();
  }, [recordedUri, player, setPhase, setRecordedUri, setSpeechStartOffsetMs]);

  useEffect(() => {
    if (status.didJustFinish) {
      setPhase(AudioPhase.Monitoring);
      setRecordedUri(null);
    }
  }, [status.didJustFinish, setPhase, setRecordedUri]);

  return {
    isPlaying: status.playing,
    duration: status.duration,
  };
};