export type RiveCharacterState = 'Talk' | 'Hear' | 'Check';

export enum AudioState {
  AskPermissions, // 0
  Monitoring, // 1
  Recording, // 2
  Playing // 3
}
