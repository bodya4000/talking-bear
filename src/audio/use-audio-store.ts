import { create } from 'zustand';

export enum AudioPhase {
  AskPermissions, // 0
  Monitoring,     // 1
  Recording,     // 2
  Playing,       // 3
}

interface AudioStore {
  phase: AudioPhase;
  setPhase: (phase: AudioPhase) => void;
  
  getBearStatus: () => 'Check' | 'Hear' | 'Talk';

  recordedUri: string | null;
  setRecordedUri: (uri: string | null) => void;

  speechStartOffsetMs: number | null;
  setSpeechStartOffsetMs: (ms: number | null) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  phase: AudioPhase.AskPermissions,
  
  setPhase: (phase) => set({ phase }),

  setRecordedUri: (recordedUri) => set({ recordedUri }),
  recordedUri: null,

  speechStartOffsetMs: null,
  setSpeechStartOffsetMs: (speechStartOffsetMs) => set({ speechStartOffsetMs }),

  getBearStatus: () => {
    const phase = get().phase;
    if (phase === AudioPhase.Recording) return 'Hear';
    if (phase === AudioPhase.Playing) return 'Talk';
    return 'Check';
  },
}));