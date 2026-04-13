import {
  RecordingPresets,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useRef } from "react";
import { AUDIO_CONFIG } from "./constants";
import { AudioPhase, useAudioStore } from "./use-audio-store";

export const useVoiceRecognition = () => {
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });
  const recorderState = useAudioRecorderState(
    recorder,
    AUDIO_CONFIG.METERING_POLL_INTERVAL
  );

  const { phase, setPhase, setRecordedUri, setSpeechStartOffsetMs } =
    useAudioStore();
  const silenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const monitorRotateRef = useRef(false);

  const start = async () => {
    if (recorder.isRecording) return;

    await recorder.prepareToRecordAsync();

    recorder.record();
  };

  const stop = async (publishUri = true) => {
    await recorder.stop();
    if (publishUri && recorder.uri) setRecordedUri(recorder.uri);
  };

  useEffect(() => {
    if (
      phase === AudioPhase.AskPermissions ||
      phase === AudioPhase.Playing
    ) {
      return;
    }
    void start();
  }, [phase]);

  useEffect(() => {
    if (phase !== AudioPhase.Monitoring) return;
    if (!recorderState.isRecording) return;
    if (
      recorderState.durationMillis < AUDIO_CONFIG.MAX_RECORDING_DURATION_MS
    ) {
      monitorRotateRef.current = false;
      return;
    }
    if (monitorRotateRef.current) return;
    monitorRotateRef.current = true;
    void (async () => {
      try {
        await stop(false);
        await start();
      } finally {
        monitorRotateRef.current = false;
      }
    })();
  }, [phase, recorderState.durationMillis, recorderState.isRecording]);

  useEffect(() => {
    if (!recorderState.isRecording) return;

    const currentDb = recorderState.metering ?? -160;
    const isLoudEnough =
      currentDb > AUDIO_CONFIG.LOUDNESS_THRESHOLD_DECIBELS;

    if (isLoudEnough) {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      if (phase !== AudioPhase.Recording) {
        setSpeechStartOffsetMs(recorderState.durationMillis);
        setPhase(AudioPhase.Recording);
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
