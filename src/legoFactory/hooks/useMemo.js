import { EMPTY_HOOK_STATE } from "../consts";
import { isSimilar } from "../utils";
import hookState, { getFiber } from "./hookState";

const useMemo = (calbk, deps) => {
  const fiber = getFiber();
  const [depsState, setDepsState] = hookState(fiber, EMPTY_HOOK_STATE);
  const [calbkResaultState, setCalbkResaultState] = hookState(
    fiber,
    EMPTY_HOOK_STATE
  );

  if (depsState === EMPTY_HOOK_STATE) {
    const resault = calbk();
    setDepsState(deps);
    setCalbkResaultState(resault);

    return resault;
  }

  if (isSimilar(deps, depsState)) {
    return calbkResaultState;
  } else {
    const resault = calbk();
    setDepsState(deps);
    setCalbkResaultState(resault);

    return resault;
  }
};

export default useMemo;
