import { useEffect, useRef } from 'react';
import Rive, { Alignment, useRive } from 'rive-react-native';

const STATE_MACHINE_NAME = 'State Machine 1';
export type BearStatus = 'Talk' | 'Hear' | 'Check';

interface BearProps {
  status: BearStatus;
}

export default function Bear({ status }: BearProps) {
  const [setRiveRef, riveRef] = useRive();

  const lastStatus = useRef<BearStatus | null>(null);

  useEffect(() => {
    if (!riveRef || lastStatus.current === status) return;

    const updateRive = async () => {
      riveRef.setInputState(STATE_MACHINE_NAME, 'Talk', status === 'Talk');
      riveRef.setInputState(STATE_MACHINE_NAME, 'Hear', status === 'Hear');
      riveRef.setInputState(STATE_MACHINE_NAME, 'Check', status === 'Check');

      lastStatus.current = status;
    };

    updateRive();
  }, [riveRef, status]);

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
