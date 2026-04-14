import { RecordingPresets, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { useEffect } from 'react';
import { Alert } from 'react-native';

import { APP_CONFIG } from '../constants';
import { useAudioStore } from '../store/use-audio-store';
import { AudioState } from '../types';
import { switchAudioRecording } from '../utils';

export const useVoiceRecognition = () => {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const recorderState = useAudioRecorderState(recorder, APP_CONFIG.METERING_POLL_INTERVAL);

  const { state, speechStartOffsetMs, updateAudioState } = useAudioStore();

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
    if (!recorderState.isRecording || !recorderState.metering) return;

    if (state === AudioState.Playing) return;

    const currentDb = recorderState.metering;
    const isLoudEnough = currentDb > APP_CONFIG.LOUDNESS_THRESHOLD_DECIBELS;

    if (isLoudEnough) {
      speechStartOffsetMs === null
        ? updateAudioState({ state: AudioState.Recording, speechStartOffsetMs: recorderState.durationMillis })
        : updateAudioState({ state: AudioState.Recording });
    } else {
      if (state === AudioState.Recording) {
        stop();
      }
    }
  }, [recorderState.metering, recorderState.isRecording, state]);

  return { uri: recorder.uri };
};
