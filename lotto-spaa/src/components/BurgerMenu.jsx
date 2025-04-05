import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      {/* Burger Icon */}
      <div
        className="cursor-pointer transition-all duration-300"
        onClick={toggleMenu}
        style={{
          color: isOpen ? "#ff00ff" : "#00ffff",
          textShadow: isOpen
            ? "0 0 5px #ff00ff, 0 0 10px #ff00ff"
            : "0 0 5px #00ffff, 0 0 10px #00ffff",
          transform: isOpen ? "rotate(90deg)" : "rotate(0)",
          fontSize: "2rem",
        }}
      >
        ☰
      </div>

      {/* Menu Panel */}
      <div
        className={`absolute right-0 mt-2 py-2 w-64 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "rgba(10, 0, 26, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 0 15px rgba(255, 0, 255, 0.5), inset 0 0 10px rgba(255, 0, 255, 0.2)",
          borderRadius: "10px",
          border: "1px solid rgba(255, 0, 255, 0.3)",
          zIndex: 1000,
        }}
      >
        {/* Menu Header */}
        <div className="px-6 py-3 border-b border-purple-500 mb-2">
          <h3
            className="text-xl font-bold"
            style={{
              color: "#ff00ff",
              textShadow: "0 0 5px #ff00ff",
              letterSpacing: "1px",
            }}
          >
            SYSTEM MENU
          </h3>
        </div>

        {/* Menu Items */}
        <div>
          {[
            { name: "HOME", path: "/home", icon: "🏠", color: "#00ffff" },
            { name: "PROFILE", path: "/profile", icon: "👤", color: "#ff00ff" },
            {
              name: "DRAW HISTORY",
              path: "/history",
              icon: "📜",
              color: "#ffcc00",
            },
          ].map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              name={item.name}
              color={item.color}
              onClick={() => handleNavigation(item.path)}
            />
          ))}

          <div className="my-2 border-t border-purple-800"></div>

          <MenuItem
            icon="❓"
            name="HELP"
            color="#ffffff"
            onClick={() => handleNavigation("/help")}
          />

          <MenuItem
            icon="⚠️"
            name="LOGOUT"
            color="#ff0044"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};


const MenuItem = ({ icon, name, color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="px-6 py-3 flex items-center cursor-pointer transition-all duration-300"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered ? "rgba(255, 255, 255, 0.1)" : "transparent",
        transform: isHovered ? "translateX(5px)" : "translateX(0)",
      }}
    >
      <div className="mr-3 text-xl" style={{ opacity: isHovered ? 1 : 0.8 }}>
        {icon}
      </div>
      <div
        className="font-bold tracking-wider"
        style={{
          color: color,
          textShadow: isHovered
            ? `0 0 8px ${color}, 0 0 12px ${color}`
            : `0 0 5px ${color}`,
          opacity: isHovered ? 1 : 0.8,
        }}
      >
        {name}
      </div>
    </div>
  );
};

export default BurgerMenu;