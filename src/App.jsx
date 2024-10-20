import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";

import SignInSide from "./components/authentication/SignInSide";
import SignUpSide from "./components/authentication/SignUpSide";
import Store from "./store/Store";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/authentication/ProfilePage";
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <Provider store={Store}>
      <Router>
        <ProtectedRoutes Component={Navbar} />
        <Routes>
          <Route path="/" element={<Navigate to="/sign-in" />} />
          <Route exact path="/sign-in" element={<SignInSide />} />
          <Route exact path="/sign-up" element={<SignUpSide />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoutes Component={Dashboard} />}
          />
          <Route
            path="/profile"
            element={<ProtectedRoutes Component={ProfilePage} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
