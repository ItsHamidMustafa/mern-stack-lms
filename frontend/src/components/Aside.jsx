import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export const Aside = () => {
  const [mode, setMode] = useState("dark");
  const { user, loading } = useAuthContext();

  useEffect(() => {
    const savedMode = localStorage.getItem("mode") || "dark";
    setMode(savedMode);
    applyTheme(savedMode);
  }, []);

  const applyTheme = (selectedMode) => {
    const root = document.documentElement;
    if (selectedMode === "light") {
      root.style.setProperty("--primary", "#c7c7c7");
      root.style.setProperty("--primary-light", "#ffff");
      root.style.setProperty("--secondary", "#121212");
      root.style.setProperty("--secondary-light", "#000000");
      root.style.setProperty("--light", "#000000");
      root.style.setProperty("--dark", "#f5f5f5");
      root.style.setProperty("--light-dark", "#cacaca");
    } else {
      root.style.setProperty("--primary", "#000000");
      root.style.setProperty("--primary-light", "#121212");
      root.style.setProperty("--secondary", "#cacaca");
      root.style.setProperty("--secondary-light", "#f5f5f5");
      root.style.setProperty("--light", "#ffff");
      root.style.setProperty("--dark", "#211f20");
      root.style.setProperty("--light-dark", "#5f5c5b");
    }
  };

  const handleModeClick = (selectedMode) => {
    return () => {
      setMode(selectedMode);
      localStorage.setItem("mode", selectedMode);
      applyTheme(selectedMode);
    };
  };

  const location = useLocation();

  return (
    <>
      <div className="aside-bg"></div>
      <div className="aside">
        <Link to="/" className="aside-logo">
          {process.env.REACT_APP_INST_NAME}
        </Link>
        <div className="aside-center-align aside-links-container">
          <Link className={location.pathname === "/" ? "active" : ""} to="/">
            <span className="material-symbols-outlined">home</span>
            Home
          </Link>
          <Link
            className={location.pathname === "/schedule" ? "active" : ""}
            to="/schedule"
          >
            <span className="material-symbols-outlined">calendar_month</span>
            Schedule
          </Link>
          <Link
            className={location.pathname === "/courses" ? "active" : ""}
            to="/courses"
          >
            <span className="material-symbols-outlined">auto_stories</span>
            Courses
          </Link>
          <Link
            className={location.pathname === "/analytics" ? "active" : ""}
            to="/analytics"
          >
            <span className="material-symbols-outlined">monitoring</span>
            Analytics
          </Link>
          {!loading && user?.role !== 'admin' ?
            <Link
              className={location.pathname === "/assignments" ? "active" : ""}
              to="/assignments"
            >
              <span className="material-symbols-outlined">assignment</span>
              Assignments
            </Link>
            :
            <Link
              className={location.pathname === "/teachers" ? "active" : ""}
              to="/teachers"
            >
              <span className="material-symbols-outlined">school</span>
              Teachers
            </Link>
          }
          <Link
            className={location.pathname === "/messages" ? "active" : ""}
            to="/messages"
          >
            <span className="material-symbols-outlined">message</span>
            Messages
          </Link>
          <Link
            className={location.pathname === "/profile" ? "active" : ""}
            to="/profile"
          >
            <span className="material-symbols-outlined">account_circle</span>
            Profile
          </Link>
          <Link
            className={location.pathname === "/help" ? "active" : ""}
            to="/help"
          >
            <span className="material-symbols-outlined">help</span>
            Help
          </Link>
        </div>
        <div className="theme-buttons-container">
          <button
            onClick={handleModeClick("light")}
            className={`theme-button ${mode === "light" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">light_mode</span>
            Light
          </button>
          <button
            onClick={handleModeClick("dark")}
            className={`theme-button ${mode === "dark" ? "active" : ""}`}
          >
            <span className="material-symbols-outlined">dark_mode</span>
            Dark
          </button>
        </div>
      </div>
    </>
  );
};
