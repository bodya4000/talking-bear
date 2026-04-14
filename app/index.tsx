import { useAudioStore } from '@/src/audio/use-audio-store';
import { useAudioPermissions } from '@/src/audio/use-permissions';
import { useAudioSpeaker } from '@/src/audio/use-speaker';
import { useVoiceRecognition } from '@/src/audio/use-voice-recognition';
import Bear from '../src/components/bear';

export default function Index() {
  const bearStatus = useAudioStore((s) => s.getBearStatus());

  useAudioPermissions();
  useVoiceRecognition();
  useAudioSpeaker();

  return <Bear status={bearStatus} />;
}
