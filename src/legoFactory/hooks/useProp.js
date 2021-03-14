import useContext from "./useContext";
import useState from "./useState";
import useEffect from "./useEffect";
import WebcomponentContext from "../webComponent/webcomponentContext";

const useProp = (propName) => {
  const webcomponentContext = useContext(WebcomponentContext);
  const [prop, setProp] = useState(
    WebcomponentContext.getStateValue().getProp(propName)
  );

  useEffect(() => {
    const unregister = webcomponentContext.register(propName, (newProp) => {
      setProp(newProp);
    });
    return () => {
      unregister();
    };
  }, [propName, webcomponentContext]);

  return prop;
};

export default useProp;
