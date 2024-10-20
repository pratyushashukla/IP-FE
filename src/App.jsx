import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";

import SignInSide from "./components/authentication/SignInSide";
import SignUpSide from "./components/authentication/SignUpSide";
import Store from "./store/Store";
import Dashboard from "./components/Dashboard";
import useAutoLogout from "./hooks/useAutoLogout";

function App() {
  
  return (
    <Provider store={Store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" />} />
          <Route exact path="/sign-in" element={<SignInSide />} />
          <Route exact path="/sign-up" element={<SignUpSide />} />
          <Route exact path="/dashboard" element={<Dashboard />} />

        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
