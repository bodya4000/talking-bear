import { create } from 'zustand';

import { AudioState, type RiveCharacterState } from '../types';

interface AudioStore {
  state: AudioState;
  recordedUri: string | null;
  speechStartOffsetMs: number | null;

  updateAudioState: (state: Partial<AudioStore>) => void;
  getRiveCharacterState: () => RiveCharacterState;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  state: AudioState.AskPermissions,
  recordedUri: null,
  speechStartOffsetMs: null,

  updateAudioState: (newState) => set((state) => ({ ...state, ...newState })),

  getRiveCharacterState: () => {
    const state = get().state;

    switch (state) {
      case AudioState.Playing:
        return 'Talk';
      case AudioState.Recording:
        return 'Hear';
      default:
        return 'Check';
    }
  }
}));
