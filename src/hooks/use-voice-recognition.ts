import { RecordingPresets, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';

import { APP_CONFIG } from '../constants';
import { useAudioStore } from '../store/use-audio-store';
import { AudioState } from '../types';
import { switchAudioRecording } from '../utils';

export const useVoiceRecognition = () => {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const recorderState = useAudioRecorderState(recorder, APP_CONFIG.METERING_POLL_INTERVAL);

  const { state, speechStartOffsetMs, updateAudioState } = useAudioStore();

  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = async () => {
    try {
      if (recorder.isRecording) return;

      await switchAudioRecording({ enable: true });
      await recorder.prepareToRecordAsync();

      if (!recorder.isRecording) recorder.record();
    } catch (e) {
      Alert.alert('Failed to start recording');
    }
  };

  const stop = async (publishUri = true) => {
    if (!recorder.isRecording) return;

    recorder.pause();
    await recorder.stop();

    if (publishUri && recorder.uri) {
      updateAudioState({ recordedUri: recorder.uri });
    }
  };

  useEffect(() => {
    if (state === AudioState.Monitoring) {
      start();
    }
  }, [state]);

  useEffect(() => {
    if (!recorderState.isRecording || state === AudioState.Playing) return;

    if (!recorderState.metering || !recorderState.isRecording) return;

    const currentDb = recorderState.metering;
    const isLoudEnough = currentDb > APP_CONFIG.LOUDNESS_THRESHOLD_DECIBELS;

    if (isLoudEnough) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      if (state !== AudioState.Recording) {
        updateAudioState({
          state: AudioState.Recording,
          speechStartOffsetMs: speechStartOffsetMs === null ? recorderState.durationMillis : speechStartOffsetMs
        });
      }
    } else {
      if (state === AudioState.Recording && !silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          stop();
          silenceTimerRef.current = null;
        }, APP_CONFIG.SILENCE_DURATION_MS);
      }
    }
  }, [recorderState.metering, recorderState.isRecording, state]);

  return { uri: recorder.uri };
};
