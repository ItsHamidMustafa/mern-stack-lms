import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Aside } from "./components/Aside";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { CoursesPage } from "./pages/CoursesPage";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Schedule } from "./pages/Schedule";
import { Assignments } from "./pages/Assignments";
import { Analytics } from "./pages/Analytics";
import { Messages } from "./pages/Messages";
import { Profile } from "./pages/Profile";
import { Help } from "./pages/Help";
import { Error } from "./pages/Error";
import { Teachers } from "./pages/Teachers";
import { Teacher } from "./pages/Teacher";
import { Programs } from "./pages/Programs";
import {Departments} from "./pages/Departments";

function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching user
  }

  return (
    <div className="app">
      <BrowserRouter>
        {user && <Aside />}
        <div className="main-container">
          <Navbar />
          <Routes>
            <Route path="/" element={user ? <Home /> : <Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/courses" element={user ? <CoursesPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/schedule"
              element={user ? <Schedule /> : <Navigate to="/login" />}
            />
            <Route
              path="/assignments"
              element={user ? <Assignments /> : <Navigate to="/login" />}
            />
            <Route
              path="/teachers"
              element={user?.role === 'admin' ? <Teachers /> : <Navigate to="/" />}
            />
            <Route
              path="/programs"
              element={user?.role === 'admin' ? <Programs /> : <Navigate to="/" />}
            />
            <Route
              path="/departments"
              element={user?.role === 'admin' ? <Departments /> : <Navigate to="/" />}
            />
            <Route
              path="/teacher/:id"
              element={<Teacher />}
            />
            <Route
              path="/analytics"
              element={user ? <Analytics /> : <Navigate to="/login" />}
            />
            <Route
              path="/messages"
              element={user ? <Messages /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/login" />}
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