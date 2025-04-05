import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, User, Clock, HelpCircle, LogOut } from "lucide-react";

const Navbar = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      onExpandChange(isExpanded && !(width <= 768));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded, onExpandChange]);

  // Nav items configuration
  const topNavItems = [
    {
      icon: <Home />,
      label: "HOME",
      path: "/home",
      hoverColor: "text-cyan-400 hover:text-cyan-200",
    },
    {
      icon: <Clock />,
      label: "HISTORY",
      path: "/history",
      hoverColor: "text-yellow-400 hover:text-yellow-200",
    },
    {
      icon: <HelpCircle />,
      label: "HELP",
      path: "/help",
      hoverColor: "text-white hover:text-gray-200",
    },
  ];

  const bottomNavItems = [
    {
      icon: <User />,
      label: "PROFILE",
      path: "/profile",
      hoverColor: "text-fuchsia-400 hover:text-fuchsia-200",
    },
    {
      icon: <LogOut />,
      label: "LOGOUT",
      path: "/signin",
      hoverColor: "text-red-400 hover:text-red-200",
    },
  ];

  const handleNavigation = (path) => {
    if (path === "/signin") {
      localStorage.removeItem("token");
    }
    navigate(path);
  };

  // Mobile version - bottom navbar
  if (isMobile) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-50 py-2 px-4 flex justify-around items-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,20,40,0.9) 0%, rgba(30,30,60,0.9) 100%)",
          boxShadow:
            "0 0 20px rgba(100,0,255,0.3), inset 0 0 15px rgba(50,0,100,0.5)",
          borderTop: "2px solid rgba(0,255,255,0.3)",
        }}
      >
        {[...topNavItems, ...bottomNavItems].map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-2 cursor-pointer rounded-lg ${
              location.pathname === item.path ? "bg-purple-800/50" : ""
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            {React.cloneElement(item.icon, {
              className: `transition-all duration-300 ${item.hoverColor}`,
              size: 24,
            })}
          </div>
        ))}
      </div>
    );
  }

  // Desktop/Tablet version - left sidebar
  return (
    <div
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${
        isExpanded ? (isTablet ? "w-40" : "w-48") : isTablet ? "w-14" : "w-16"
      }`}
      onMouseEnter={() => {
        setIsExpanded(true);
        onExpandChange(true);
      }}
      onMouseLeave={() => {
        setIsExpanded(false);
        onExpandChange(false);
      }}
      style={{
        background:
          "linear-gradient(135deg, rgba(20,20,40,0.9) 0%, rgba(30,30,60,0.9) 100%)",
        boxShadow:
          "0 0 20px rgba(100,0,255,0.3), inset 0 0 15px rgba(50,0,100,0.5)",
        borderRight: "2px solid rgba(0,255,255,0.3)",
      }}
    >
      <div className="h-full flex flex-col justify-between p-2">
        {/* Top section */}
        <div>
          {topNavItems.map((item, index) => (
            <NavItem
              key={`top-${index}`}
              item={item}
              isExpanded={isExpanded}
              isActive={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </div>

        {/* Bottom section */}
        <div>
          {bottomNavItems.map((item, index) => (
            <NavItem
              key={`bottom-${index}`}
              item={item}
              isExpanded={isExpanded}
              isActive={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// NavItem component for cleaner code
const NavItem = ({ item, isExpanded, isActive, onClick }) => (
  <div
    className={`flex items-center p-3 m-1 cursor-pointer transition-all duration-300 rounded-lg group ${
      isExpanded ? "hover:bg-gray-700/50" : ""
    } ${isActive ? "bg-purple-800/50" : ""}`}
    onClick={onClick}
  >
    <div
      className={`flex items-center ${isExpanded ? "mr-3" : ""} ${
        item.hoverColor
      }`}
    >
      {React.cloneElement(item.icon, {
        className: "transition-all duration-300 group-hover:scale-110",
        size: 24,
      })}
    </div>
    {isExpanded && (
      <span
        className={`text-sm font-bold transition-all duration-300 ${item.hoverColor}`}
      >
        {item.label}
      </span>
    )}
  </div>
);

export default Navbar;
