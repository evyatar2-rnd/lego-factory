import useMemo from "./useMemo";

const useCallback = (calbk, deps) => useMemo(() => calbk, deps);

export default useCallback;
