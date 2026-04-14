import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { Alert, AppState, Linking } from 'react-native';

import { useAudioStore } from '../store/use-audio-store';
import { AudioState } from '../types';

export const useAudioPermissions = () => {
  const { updateAudioState } = useAudioStore();
  const blockedSettingsAlertShownRef = useRef(false);
  const evaluateInFlightRef = useRef(false);

  const showMicSettingsAlert = () => {
    Alert.alert('Microphone access needed', 'Turn on the microphone for this app in Settings to continue.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: Linking.openSettings }
    ]);
  };

  useEffect(() => {
    const evaluate = async () => {
      if (evaluateInFlightRef.current) return;

      evaluateInFlightRef.current = true;

      try {
        const initial = await getRecordingPermissionsAsync();

        if (initial.granted) {
          blockedSettingsAlertShownRef.current = false;
          updateAudioState({ state: AudioState.Monitoring });

          return;
        }

        if (initial.canAskAgain) {
          const requested = await requestRecordingPermissionsAsync();

          if (requested.granted) {
            blockedSettingsAlertShownRef.current = false;
            updateAudioState({ state: AudioState.Monitoring });

            return;
          }

          if (!requested.canAskAgain) {
            updateAudioState({ state: AudioState.AskPermissions });

            if (!blockedSettingsAlertShownRef.current) {
              blockedSettingsAlertShownRef.current = true;
              showMicSettingsAlert();
            }

            return;
          }

          updateAudioState({ state: AudioState.AskPermissions });

          return;
        }

        updateAudioState({ state: AudioState.AskPermissions });

        if (!blockedSettingsAlertShownRef.current) {
          blockedSettingsAlertShownRef.current = true;
          showMicSettingsAlert();
        }
      } finally {
        evaluateInFlightRef.current = false;
      }
    };

    evaluate();

    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        evaluate();
      }

      if (next === 'background') {
        blockedSettingsAlertShownRef.current = false;
      }
    });

    return () => sub.remove();
  }, []);
};
