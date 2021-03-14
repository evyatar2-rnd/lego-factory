import useHost from "./useHost";

const useEvent = (eventName, { bubbles, isCustomEvent = true } = {}) => {
  const host = useHost();

  return (detail) => {
    const event = isCustomEvent
      ? new CustomEvent(eventName, { detail })
      : new Event(eventName, detail);

    host.current.dispatchEvent(event);
  };
};

export default useEvent;
