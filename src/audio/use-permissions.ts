import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync } from 'expo-audio';
import { useEffect, useRef } from 'react';
import { Alert, AppState, Linking } from 'react-native';

import { AudioPhase, useAudioStore } from './use-audio-store';

const showMicSettingsAlert = () => {
  Alert.alert('Microphone access needed', 'Turn on the microphone for this app in Settings to continue.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Open Settings', onPress: Linking.openSettings },
  ]);
};

export const useAudioPermissions = () => {
  const { updateAudioState } = useAudioStore();
  const blockedSettingsAlertShownRef = useRef(false);
  const evaluateInFlightRef = useRef(false);

  useEffect(() => {
    const evaluate = async () => {
      if (evaluateInFlightRef.current) return;
      evaluateInFlightRef.current = true;
      try {
        const initial = await getRecordingPermissionsAsync();

        if (initial.granted) {
          blockedSettingsAlertShownRef.current = false;
          console.log('useAudioPermissions: doint phase change');
          updateAudioState({ phase: AudioPhase.Monitoring });
          return;
        }

        if (initial.canAskAgain) {
          const requested = await requestRecordingPermissionsAsync();
          if (requested.granted) {
            blockedSettingsAlertShownRef.current = false;
            console.log('useAudioPermissions: doint phase change');
            updateAudioState({ phase: AudioPhase.Monitoring });
            return;
          }
          if (!requested.canAskAgain) {
            updateAudioState({ phase: AudioPhase.AskPermissions });
            if (!blockedSettingsAlertShownRef.current) {
              blockedSettingsAlertShownRef.current = true;
              showMicSettingsAlert();
            }
            return;
          }
          updateAudioState({ phase: AudioPhase.AskPermissions });
          return;
        }

        updateAudioState({ phase: AudioPhase.AskPermissions });
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
