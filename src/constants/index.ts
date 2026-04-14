import { Platform } from 'react-native';

export const APP_CONFIG = {
  LOUDNESS_THRESHOLD_DECIBELS: Platform.OS === 'ios' ? -32 : -25,
  MINIMUM_SILENCE_DURATION_MS: 300,

  METERING_POLL_INTERVAL: 600,
  MAX_RECORDING_DURATION_MS: 300_000,

  PITCH_RATE: 1,
  VOLUME: 1,

  BACKGROUND_COLOR: '#d6e1ea',
  STATE_MACHINE_NAME: 'State Machine 1'
} as const;
