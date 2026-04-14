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
  recordedUri: string | null;
  speechStartOffsetMs: number | null;

  updateAudioState: (state: Partial<AudioStore>) => void;
  getBearStatus: () => 'Check' | 'Hear' | 'Talk';

}

export const useAudioStore = create<AudioStore>((set, get) => ({
  phase: AudioPhase.AskPermissions,
  recordedUri: null,
  speechStartOffsetMs: null,

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
