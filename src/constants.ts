import { Platform } from 'react-native';

export const AUDIO_CONFIG = {
  LOUDNESS_THRESHOLD_DECIBELS: Platform.OS === 'ios' ? -32 : -25,
  MINIMUM_SILENCE_DURATION_MS: 300,

  METERING_POLL_INTERVAL: 500,
  MAX_RECORDING_DURATION_MS: 300_000,

  PITCH_RATE: 1,
  VOLUME: 1,

  BACKGROUND_COLOR: '#d6e1ea',
} as const;
