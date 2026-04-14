import { useEffect, useRef } from 'react';
import Rive, { Alignment, useRive } from 'rive-react-native';

import type { RiveCharacterState } from '../types';

const STATE_MACHINE_NAME = 'State Machine 1';

interface RiveCharacterProps {
  state: RiveCharacterState;
}

export default function RiveCharacter({ state }: RiveCharacterProps) {
  const [setRiveRef, riveRef] = useRive();

  const lastState = useRef<RiveCharacterState | null>(null);

  useEffect(() => {
    if (!riveRef || lastState.current === state) return;

    const updateRive = async () => {
      riveRef.setInputState(STATE_MACHINE_NAME, 'Talk', state === 'Talk');
      riveRef.setInputState(STATE_MACHINE_NAME, 'Hear', state === 'Hear');
      riveRef.setInputState(STATE_MACHINE_NAME, 'Check', state === 'Check');

      lastState.current = state;
    };

    updateRive();
  }, [riveRef, state]);

  return (
    <Rive
      ref={setRiveRef}
      source={require('../../assets/riv/bear.riv')}
      alignment={Alignment.BottomCenter}
      stateMachineName={STATE_MACHINE_NAME}
      autoplay
    />
  );
}
