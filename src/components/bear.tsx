import { useEffect } from "react";
import Rive, { Alignment, useRive } from "rive-react-native";

const DEFAULT_STATE_MACHINE = "State Machine 1";

export type BearStatus = "Talk" | "Hear" | "Check";

export enum BearLook {
  Check = 0,
  Hear = 1,
  Talk = 2,
}

const BEAR_LOOK: Record<BearStatus, BearLook> = {
  Check: BearLook.Check,
  Hear: BearLook.Hear,
  Talk: BearLook.Talk,
};

interface BearProps {
  status: BearStatus;
  stateMachineName?: string;
}

export default function Bear({
  status,
  stateMachineName = DEFAULT_STATE_MACHINE,
}: BearProps) {
  const [setRiveRef, riveRef] = useRive();

  useEffect(() => {
    if (!riveRef) return;
    riveRef.setInputState(stateMachineName, "Talk", status === "Talk");
    riveRef.setInputState(stateMachineName, "Hear", status === "Hear");
    riveRef.setInputState(stateMachineName, "Check", status === "Check");
    riveRef.setInputState(stateMachineName, "Look", BEAR_LOOK[status]);
  }, [riveRef, stateMachineName, status]);

  return (
      <Rive
        ref={setRiveRef}
        source={require("../../assets/riv/bear.riv")}
        alignment={Alignment.BottomCenter}
        stateMachineName={stateMachineName}
        autoplay
      />
  );
}