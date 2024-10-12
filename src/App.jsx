import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";

import SignUpSide from "./components/authentication/SignUpSide";
import Store from "./store/Store";

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/sign-in" />} /> */}
          <Route exact path="/sign-up" element={<SignUpSide />} />

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
