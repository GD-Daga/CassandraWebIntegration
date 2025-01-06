import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FloatingIcon: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [firstName, setFirstName] = useState("Guest");
  const [lastName, setLastName] = useState("");
  const [isPopOutVisible, setIsPopOutVisible] = useState(false);

  const iconRef = useRef<HTMLDivElement>(null);
  const popOutRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const updateLoginState = () => {
      const storedFirstName = localStorage.getItem("firstName");
      const storedLastName = localStorage.getItem("lastName");
      const storedLoggedIn = localStorage.getItem("isLoggedIn");

      if (storedFirstName && storedLastName && storedLoggedIn === "true") {
        setFirstName(storedFirstName);
        setLastName(storedLastName);
        setIsLoggedIn(true);
      } else {
        setFirstName("Guest");
        setLastName("");
        setIsLoggedIn(false);
      }
    };

    updateLoginState();

    
    const handleStorageChange = () => {
      updateLoginState();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  
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

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleClick = () => setIsPopOutVisible(!isPopOutVisible);

  const handleSignOut = () => {
    
    localStorage.removeItem("username");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    setFirstName("Guest");
    setLastName("");
    console.log("User signed out");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
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
          {isLoggedIn ? `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}` : "JL"}
        </span>
      </div>

      {isPopOutVisible && (
        <div
          ref={popOutRef}
          className="fixed bottom-24 left-6 w-64 p-4 bg-white border rounded-md shadow-lg z-40"
        >
          <div className="text-sm text-black mb-4">
            {isLoggedIn ? (
              <p className="font-medium">
                Welcome, {firstName} {lastName} <br />
                <span className="text-xs text-gray-500">({firstName} {lastName})</span>
              </p>
            ) : (
              <p className="font-medium">Please log in</p>
            )}
          </div>
          <div className="flex justify-between">
            {isLoggedIn ? (
              <button className="text-sm text-red-600" onClick={handleSignOut}>
                Sign Out
              </button>
            ) : (
              <button
                className="text-sm text-blue-600"
                onClick={() => navigate("/login")}
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
