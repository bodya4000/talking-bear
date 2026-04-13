import { useAudioPermissions } from "@/src/audio/use-permissions";
import { useAudioSpeaker } from "@/src/audio/use-speaker";
import { useVoiceRecognition } from "@/src/audio/use-voice-recognition";
import { useAudioStore } from "@/src/audio/use-audio-store";
import { StyleSheet, View } from "react-native";
import Bear from "../src/components/bear";

export default function Index() {
  const bearStatus = useAudioStore((s) => s.getBearStatus());

  useAudioPermissions();
  useVoiceRecognition();
  useAudioSpeaker();

  return (
    <View style={styles.container}>
      <Bear status={bearStatus} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d6e1ea",
  },
});
