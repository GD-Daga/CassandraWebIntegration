import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const FloatingIcon: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const [isPopOutVisible, setIsPopOutVisible] = useState(false);

  const iconRef = useRef<HTMLDivElement>(null);
  const popOutRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();  // Initialize navigate function

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (iconRef.current && !iconRef.current.contains(event.target as Node)) &&
        (popOutRef.current && !popOutRef.current.contains(event.target as Node))
      ) {
        setIsPopOutVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    setIsPopOutVisible(!isPopOutVisible);
  };

  return (
    <div className="relative">
      <div
        ref={iconRef}
        className={`fixed bottom-6 left-6 flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 z-50 transition-all ${
          isHovered ? "w-14 h-14" : "w-10 h-10"
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isHovered ? "pointer" : "default" }}
        onClick={handleClick}
      >
        <span className="font-medium text-gray-600 dark:text-gray-300">
          {isLoggedIn ? username : "JL"}
        </span>
      </div>

      {isPopOutVisible && (
        <div
          ref={popOutRef}
          className="fixed bottom-24 left-6 w-64 p-4 bg-white border rounded-md shadow-lg z-40"
        >
          <div className="text-sm text-black mb-4">
            {isLoggedIn ? (
              <p className="font-medium">Welcome, {username}</p>
            ) : (
              <p className="font-medium">Please log in</p>
            )}
          </div>
          <div className="flex justify-between">
            {isLoggedIn ? (
              <button
                className="text-sm text-red-600"
                onClick={() => {
                  setIsLoggedIn(false);
                  console.log("User signed out");
                  // Backend sign-out logic
                }}
              >
                Sign Out
              </button>
            ) : (
              <button
                className="text-sm text-blue-600"
                onClick={() => {
                  navigate("/login");  // Redirect to the login page
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingIcon;