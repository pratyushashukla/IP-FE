// App.jsx
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
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./ProtectedRoutes";
import ProfilePage from "./components/authentication/ProfilePage";
import FormComponent from "./components/authentication/FormComponent";
import Tasks from "./components/taskManagement/Tasks";
import Visit from "./components/visit/Visit";
import Inmates from "./components/inmates/Inmates";

function App() {
  return (
    <Provider store={Store}>
      <Router>
        {/* Apply white background and full viewport height */}
        <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
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
            <Route path="/task" element={<ProtectedRoutes Component={Tasks} />} />
            <Route
              path="/inmate"
              element={<ProtectedRoutes Component={Inmates} />}
            />
            <Route
              path="/visit"
              element={<ProtectedRoutes Component={Visit} />}
            />
            <Route path="/form" element={<FormComponent />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
