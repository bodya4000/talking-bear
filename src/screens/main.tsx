import { useAudioPermissions } from '@/src/hooks/use-permissions';
import { useAudioSpeaker } from '@/src/hooks/use-speaker';
import { useVoiceRecognition } from '@/src/hooks/use-voice-recognition';
import { useAudioStore } from '@/src/store/use-audio-store';
import RiveCharacter from '../components/rive-character';

export default function MainScreen() {
  const characterState = useAudioStore((s) => s.getRiveCharacterState());

  useAudioPermissions();
  useVoiceRecognition();
  useAudioSpeaker();

  return <RiveCharacter state={characterState} />;
}
