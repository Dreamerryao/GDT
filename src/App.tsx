import { useDataContext } from "./contexts/DataProvider";
import Example from "./Example";
import UploadPage from "./Upload";
const App = () => {
  const { data } = useDataContext();
  return data ? <Example /> : <UploadPage />;
};

export default App;
