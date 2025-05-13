import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const AvatarButtonTray = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { logout } = useLogout();

  const toggleTray = () => {
    if (isOpen) {
      setIsAnimating(false);
      setTimeout(() => {
        setIsOpen(false);
      }, 400);
    } else {
      setIsOpen(true);
    }
  };

  const handleLogoutClick = () => {
    logout();
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimating(true), 0);
    }
  }, [isOpen]);

  return (
    <div className="avatar-tray-container">
      <button className="avatar-button" onClick={toggleTray}>
        <img
          src="https://res.cloudinary.com/diif6yk75/image/upload/v1725088423/avatar/zshwvxso0qm9l10u1tb8.jpg"
          alt="User Avatar"
          className="avatar-image"
        />
      </button>
      {isOpen && (
        <div
          className={`tray-menu ${
            isAnimating ? "tray-opening" : "tray-closing"
          }`}
        >
          <Link className="tray-item" to="/profile">
            <span className="material-symbols-outlined">account_circle</span>
            Profile
          </Link>
          <button
            className="tray-item"
            onClick={() => console.log("Suggestions")}
          >
            <span className="material-symbols-outlined">emoji_objects</span>
            Suggestions
          </button>
          <button className="tray-item" onClick={handleLogoutClick}>
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarButtonTray;
