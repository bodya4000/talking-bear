import { RecordingPresets, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { useEffect } from 'react';
import { Alert } from 'react-native';

import { AUDIO_CONFIG } from '../constants';
import { AudioPhase, useAudioStore } from './use-audio-store';
import { switchAudioRecording } from './utils';

export const useVoiceRecognition = () => {
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true });
  const recorderState = useAudioRecorderState(recorder, AUDIO_CONFIG.METERING_POLL_INTERVAL);

  const { phase, updateAudioState } = useAudioStore();

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
    if (phase === AudioPhase.Monitoring) {
      start();
    }
  }, [phase]);

  useEffect(() => {
    if (!recorderState.isRecording || !recorderState.metering) return;
    if (phase === AudioPhase.Playing) return;

    const currentDb = recorderState.metering;
    const isLoudEnough = currentDb > AUDIO_CONFIG.LOUDNESS_THRESHOLD_DECIBELS;

    if (isLoudEnough) {
      phase === AudioPhase.Recording
        ? updateAudioState({ phase: AudioPhase.Recording })
        : updateAudioState({ phase: AudioPhase.Recording, speechStartOffsetMs: recorderState.durationMillis });
    } else {
      if (phase === AudioPhase.Recording) {
        stop();
      }
    }
  }, [recorderState.metering, recorderState.isRecording, phase]);

  return { uri: recorder.uri };
};
