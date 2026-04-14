import { create } from 'zustand';

export enum AudioPhase {
  AskPermissions, // 0
  Monitoring, // 1
  Recording, // 2
  Saving, // 3
  Playing, // 4
}

interface AudioStore {
  phase: AudioPhase;
  setPhase: (phase: AudioPhase) => void;

  getBearStatus: () => 'Check' | 'Hear' | 'Talk';

  recordedUri: string | null;
  setRecordedUri: (uri: string | null) => void;

  speechStartOffsetMs: number | null;
  setSpeechStartOffsetMs: (ms: number | null) => void;

  updateAudioState: (state: Partial<AudioStore>) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  phase: AudioPhase.AskPermissions,

  setPhase: (phase) => set({ phase }),

  setRecordedUri: (recordedUri) => set({ recordedUri }),
  recordedUri: null,

  speechStartOffsetMs: null,
  setSpeechStartOffsetMs: (speechStartOffsetMs) => set({ speechStartOffsetMs }),

  updateAudioState: (newState) => set((state) => ({ ...state, ...newState })),

  getBearStatus: () => {
    const phase = get().phase;
    switch (phase) {
      case AudioPhase.Recording:
        return 'Hear';
      case AudioPhase.Playing:
        return 'Talk';
      default:
        return 'Check';
    }
  },
}));
