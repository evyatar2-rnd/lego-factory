import { isFunction } from "../utils";
import hookState, { getFiber } from "./hookState";

const useState = (initialValue) => {
  const fiber = getFiber();
  const [state, setState] = hookState(fiber, initialValue);

  return [
    state,
    (arg) => {
      setState(isFunction(arg) ? arg(state) : arg, true);
    },
  ];
};

export default useState;
