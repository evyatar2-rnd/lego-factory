import useContext from "./useContext";
import useRef from "./useRef";
import WebcomponentContext from "../webComponent/webcomponentContext";

const useHost = () => {
  const webcomponentContext = useContext(WebcomponentContext);
  const refHost = useRef(WebcomponentContext.getStateValue().host);

  return refHost;
};

export default useHost;
