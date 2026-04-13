import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
} from "expo-audio";
import { useEffect } from 'react';
import { AudioPhase, useAudioStore } from './use-audio-store';

export const useAudioPermissions = () => {
  const { setPhase } = useAudioStore();
  useEffect(() => {
    const setup = async () => {

      const permissionsResult = await getRecordingPermissionsAsync()

      if (permissionsResult.granted) {
        setPhase(AudioPhase.Monitoring);

        return;
      }

      if (permissionsResult.canAskAgain) {
        const requestedResult = await requestRecordingPermissionsAsync();

        if (requestedResult.granted) {
          setPhase(AudioPhase.Monitoring);

          return;
        }

      }

      setPhase(AudioPhase.AskPermissions);
    }
   setup();
  }, []);
};

