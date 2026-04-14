import { RecordingPresets, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { useEffect, useRef } from 'react';

import { AUDIO_CONFIG } from '../constants';
import { AudioPhase, useAudioStore } from './use-audio-store';
import { delay, switchAudioRecording } from './utils';

export const useVoiceRecognition = () => {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const recorderState = useAudioRecorderState(recorder, AUDIO_CONFIG.METERING_POLL_INTERVAL);

  const { phase, setPhase, updateAudioState } = useAudioStore();
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = async () => {
    try {
      if (recorder.isRecording) return;
      await switchAudioRecording({ enable: true });
      await recorder.prepareToRecordAsync();

      if (!recorder.isRecording) recorder.record();
    } catch (e) {
      console.error('Failed to start recording:', e);

      setPhase(AudioPhase.Monitoring);
    }
  };

  const stop = async (publishUri = true) => {
    if (!recorder.isRecording) return;

    await recorder.pause();
    await recorder.stop();
    await delay(200);
    if (publishUri && recorder.uri) {
      updateAudioState({ recordedUri: recorder.uri, phase: AudioPhase.Saving });
    }
  };

  useEffect(() => {
    const runStart = async () => {
      await delay(300);
      start();
    };

    if (phase === AudioPhase.Monitoring) {
      runStart();
    }
  }, [phase]);

  useEffect(() => {
    if (!recorderState.isRecording) return;
    if (!recorderState.metering) return;
    if (phase === AudioPhase.Playing) return;
    if (phase === AudioPhase.Saving) return;

    const currentDb = recorderState.metering;
    const isLoudEnough = currentDb > AUDIO_CONFIG.LOUDNESS_THRESHOLD_DECIBELS;

    if (isLoudEnough) {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      if (phase !== AudioPhase.Recording) {
        updateAudioState({ speechStartOffsetMs: recorderState.durationMillis, phase: AudioPhase.Recording });
      }
    } else {
      if (phase === AudioPhase.Recording && !silenceTimeoutRef.current) {
        silenceTimeoutRef.current = setTimeout(async () => {
          await stop();
        }, AUDIO_CONFIG.MINIMUM_SILENCE_DURATION_MS);
      }
    }
  }, [recorderState.metering, recorderState.isRecording, phase]);

  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  return { uri: recorder.uri };
};
