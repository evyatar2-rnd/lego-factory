import hookState, { getFiber } from "./hookState";

const useRef = (initialValue) => {
  const fiber = getFiber();
  const [ref] = hookState(fiber, { current: initialValue });
  return ref;
};

export default useRef;
