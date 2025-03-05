import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Aside } from "./components/Aside";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { CoursesPage } from "./pages/CoursesPage";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Schedule } from "./pages/Schedule";
import { Assignments } from "./pages/Assignments";
import { Analytics } from "./pages/Analytics";
import { Messages } from "./pages/Messages";
import { Settings } from "./pages/Settings";
import { Help } from "./pages/Help";
import { Error } from "./pages/Error";

function App() {
  const { student } = useAuthContext();
  return (
    <div className="app">
      <BrowserRouter>
        {student && <Aside />}
        <div className="main-container">
          <Navbar />
          <Routes>
            <Route path="/" element={student ? <Home /> : <Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/profile"
              element={
                student ? (
                  <Profile student={student} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/signup"
              element={!student ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!student ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/courses"
              element={student ? <CoursesPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/schedule"
              element={student ? <Schedule /> : <Navigate to="/login" />}
            />
            <Route
              path="/assignments"
              element={student ? <Assignments /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={student ? <Analytics /> : <Navigate to="/login" />}
            />
            <Route
              path="/messages"
              element={student ? <Messages /> : <Navigate to="/login" />}
            />
            <Route
              path="/settings"
              element={student ? <Settings /> : <Navigate to="/login" />}
            />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
