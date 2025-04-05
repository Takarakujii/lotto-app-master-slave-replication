import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Home, User, Clock, HelpCircle, LogOut } from "lucide-react";
import useAccountForm from "../service/FetchAccount";
import { topUpAccount } from "../service/TopupService";

const AccountProfilePage = () => {
  const [isHovered, setIsHovered] = useState({
    placeBet: false,
    cancel: false,
    minus: false,
    plus: false,
  });

  const [topUpAmount, setTopUpAmount] = useState(0);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Use the custom hook
  const {
    balance,
    username,
    email,
    birthdate,
    error: accountError,
    handleAccountForm,
  } = useAccountForm();

  // Fetch account data when the component mounts
  useEffect(() => {
    handleAccountForm();
  }, [handleAccountForm]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleHover = (button, isHovering) => {
    setIsHovered((prev) => ({ ...prev, [button]: isHovering }));
  };

  const handleIncrement = () => {
    setTopUpAmount((prev) => prev + 100);
  };

  const handleDecrement = () => {
    if (topUpAmount >= 100) {
      setTopUpAmount((prev) => prev - 100);
    }
  };

  const handleTopUp = async () => {
    try {
      const response = await topUpAccount(topUpAmount);
      if (response.success) {
        setTopUpAmount(0);
        handleAccountForm();
      } else {
        setError("Top-up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during top-up:", error);
      setError(error.message);
    }
  };

  const handleNavigation = (path) => {
    if (path === "/signin") {
      localStorage.removeItem("token");
    }
    navigate(path);
  };

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

  // NavItem component
  const NavItem = ({ item, isExpanded, isActive, onClick }) => (
    <div
      className={`flex items-center p-3 m-1 cursor-pointer transition-all duration-300 ease-in-out rounded-lg group ${
        isExpanded ? "hover:bg-gray-700/50" : "hover:bg-gray-700/30"
      } ${isActive ? "bg-purple-800/50" : ""}`}
      onClick={onClick}
    >
      <div
        className={`flex items-center ${isExpanded ? "mr-3" : ""} ${
          item.hoverColor
        } transition-all duration-300`}
      >
        {React.cloneElement(item.icon, {
          className:
            "transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:opacity-90",
          size: 24,
        })}
      </div>
      {isExpanded && (
        <span
          className={`text-sm font-bold transition-all duration-300 ease-in-out ${item.hoverColor}`}
        >
          {item.label}
        </span>
      )}
    </div>
  );

  // Mobile version - bottom navbar
  const MobileNavbar = () => (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 py-2 px-4 flex justify-around items-center transition-all duration-300"
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
          className={`flex flex-col items-center p-2 cursor-pointer rounded-lg transition-all duration-300 ease-in-out ${
            location.pathname === item.path
              ? "bg-purple-800/50"
              : "hover:bg-gray-700/30"
          }`}
          onClick={() => handleNavigation(item.path)}
        >
          {React.cloneElement(item.icon, {
            className: `transition-all duration-300 ease-in-out hover:scale-110 ${item.hoverColor}`,
            size: 24,
          })}
        </div>
      ))}
    </div>
  );

  // Desktop/Tablet version - left sidebar
  const DesktopNavbar = () => (
    <div
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-500 ease-in-out ${
        isExpanded ? (isTablet ? "w-40" : "w-48") : isTablet ? "w-14" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
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

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a001a 0%, #1f0040 100%)",
      }}
    >
      {/* Render appropriate navbar based on screen size */}
      {isMobile ? <MobileNavbar /> : <DesktopNavbar />}

      {/* Neon grid lines in background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div
          className="absolute w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(32, 216, 255, 0.3) 25%, rgba(32, 216, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(32, 216, 255, 0.3) 75%, rgba(32, 216, 255, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(32, 216, 255, 0.3) 25%, rgba(32, 216, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(32, 216, 255, 0.3) 75%, rgba(32, 216, 255, 0.3) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating neon orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full blur-lg"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background:
                index % 2 === 0
                  ? "rgba(255, 0, 255, 0.2)"
                  : "rgba(0, 255, 255, 0.2)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${
                Math.random() * 10 + 10
              }s infinite ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div
        className={`relative z-10 ${
          isMobile
            ? ""
            : isExpanded
            ? isTablet
              ? "ml-40"
              : "ml-48"
            : isTablet
            ? "ml-14"
            : "ml-16"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header className="p-5 flex justify-between items-center">
          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily: "'Futura', sans-serif",
              color: "#ff0044",
              textShadow: "0 0 5px #ff0044, 0 0 10px #ff0044",
            }}
          >
            TAKARAKUJI
          </h1>
        </header>

        {/* Main content */}
        <main className="px-4 py-8 flex flex-col md:flex-row justify-between gap-8">
          {/* Left column - Account Profile */}
          <div
            className="flex-1 p-6 rounded-lg"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              boxShadow:
                "0 0 15px rgba(255, 0, 255, 0.5), inset 0 0 10px rgba(255, 0, 255, 0.2)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 0, 255, 0.3)",
            }}
          >
            <h2
              className="text-3xl mb-8"
              style={{
                color: "#ff00ff",
                textShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff",
                letterSpacing: "2px",
              }}
            >
              Account Profile
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label
                  className="text-xl"
                  style={{ color: "#00ffff", textShadow: "0 0 3px #00ffff" }}
                >
                  Username:
                </label>
                <input
                  type="text"
                  readOnly
                  value={username}
                  className="p-4 rounded-md w-full"
                  style={{
                    background: "rgba(30, 30, 50, 0.7)",
                    border: "1px solid rgba(0, 255, 255, 0.5)",
                    boxShadow:
                      "0 0 5px rgba(0, 255, 255, 0.5), inset 0 0 5px rgba(0, 255, 255, 0.2)",
                    color: "#ffffff",
                    textShadow: "0 0 2px #ffffff",
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label
                  className="text-xl"
                  style={{ color: "#00ffff", textShadow: "0 0 3px #00ffff" }}
                >
                  Birthdate:
                </label>
                <input
                  type="text"
                  readOnly
                  value={birthdate}
                  className="p-4 rounded-md w-full"
                  style={{
                    background: "rgba(30, 30, 50, 0.7)",
                    border: "1px solid rgba(0, 255, 255, 0.5)",
                    boxShadow:
                      "0 0 5px rgba(0, 255, 255, 0.5), inset 0 0 5px rgba(0, 255, 255, 0.2)",
                    color: "#ffffff",
                    textShadow: "0 0 2px #ffffff",
                  }}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label
                  className="text-xl"
                  style={{ color: "#00ffff", textShadow: "0 0 3px #00ffff" }}
                >
                  Email:
                </label>
                <input
                  type="email"
                  readOnly
                  value={email}
                  className="p-4 rounded-md w-full"
                  style={{
                    background: "rgba(30, 30, 50, 0.7)",
                    border: "1px solid rgba(0, 255, 255, 0.5)",
                    boxShadow:
                      "0 0 5px rgba(0, 255, 255, 0.5), inset 0 0 5px rgba(0, 255, 255, 0.2)",
                    color: "#ffffff",
                    textShadow: "0 0 2px #ffffff",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right column - Balance */}
          <div className="flex-1 flex flex-col gap-8">
            <div
              className="p-6 rounded-lg"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                boxShadow:
                  "0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2)",
                borderRadius: "10px",
                border: "1px solid rgba(0, 255, 255, 0.3)",
              }}
            >
              <h2
                className="text-3xl mb-4"
                style={{
                  color: "#00ffff",
                  textShadow: "0 0 5px #00ffff, 0 0 10px #00ffff",
                  letterSpacing: "2px",
                }}
              >
                Balance
              </h2>

              <div
                className="p-4 rounded-md mb-2"
                style={{
                  background: "rgba(30, 30, 50, 0.7)",
                  border: "1px solid rgba(0, 255, 255, 0.5)",
                }}
              >
                <p
                  className="text-lg mb-2"
                  style={{ color: "#00ffff", textShadow: "0 0 3px #00ffff" }}
                >
                  Account Balance
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{ color: "#ffffff", textShadow: "0 0 5px #ffffff" }}
                >
                  ₱{balance.toFixed(2)}
                </p>
              </div>
            </div>

            <div
              className="p-6 rounded-lg"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                boxShadow:
                  "0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 10px rgba(0, 255, 255, 0.2)",
                borderRadius: "10px",
                border: "1px solid rgba(0, 255, 255, 0.3)",
              }}
            >
              <h2
                className="text-3xl mb-4"
                style={{
                  color: "#00ffff",
                  textShadow: "0 0 5px #00ffff, 0 0 10px #00ffff",
                  letterSpacing: "2px",
                }}
              >
                Top Up
              </h2>

              <div
                className="p-4 rounded-md flex justify-between items-center mb-6"
                style={{
                  background: "rgba(30, 30, 50, 0.7)",
                  border: "1px solid rgba(0, 255, 255, 0.5)",
                }}
              >
                <p
                  className="text-4xl font-bold"
                  style={{ color: "#ffffff", textShadow: "0 0 5px #ffffff" }}
                >
                  ₱{topUpAmount.toFixed(2)}
                </p>
              </div>

              <div className="flex justify-center gap-8 mb-8">
                <button
                  className="w-16 h-16 rounded-md flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "rgba(0, 0, 0, 0.7)",
                    border: "2px solid #ff0000",
                    boxShadow: isHovered.minus
                      ? "0 0 15px #ff0000, 0 0 25px #ff0000"
                      : "0 0 8px #ff0000",
                    color: "#ff0000",
                    textShadow: "0 0 5px #ff0000",
                    fontSize: "32px",
                  }}
                  onMouseEnter={() => handleHover("minus", true)}
                  onMouseLeave={() => handleHover("minus", false)}
                  onClick={handleDecrement}
                >
                  -
                </button>

                <button
                  className="w-16 h-16 rounded-md flex items-center justify-center transition-all duration-300"
                  style={{
                    background: "rgba(0, 0, 0, 0.7)",
                    border: "2px solid #00ff00",
                    boxShadow: isHovered.plus
                      ? "0 0 15px #00ff00, 0 0 25px #00ff00"
                      : "0 0 8px #00ff00",
                    color: "#00ff00",
                    textShadow: "0 0 5px #00ff00",
                    fontSize: "32px",
                  }}
                  onMouseEnter={() => handleHover("plus", true)}
                  onMouseLeave={() => handleHover("plus", false)}
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  className="flex-1 py-4 rounded-md text-lg font-bold transition-all duration-300"
                  style={{
                    background: "rgba(0, 0, 0, 0.7)",
                    border: "2px solid #00ffff",
                    boxShadow: isHovered.placeBet
                      ? "0 0 15px #00ffff, 0 0 25px #00ffff"
                      : "0 0 8px #00ffff",
                    color: "#00ffff",
                    textShadow: "0 0 5px #00ffff",
                  }}
                  onMouseEnter={() => handleHover("placeBet", true)}
                  onMouseLeave={() => handleHover("placeBet", false)}
                  onClick={handleTopUp}
                >
                  Confirm
                </button>

                <button
                  className="flex-1 py-4 rounded-md text-lg font-bold transition-all duration-300"
                  style={{
                    background: "rgba(0, 0, 0, 0.7)",
                    border: "2px solid #cccccc",
                    boxShadow: isHovered.cancel
                      ? "0 0 15px #cccccc, 0 0 25px #cccccc"
                      : "0 0 8px #cccccc",
                    color: "#cccccc",
                    textShadow: "0 0 5px #cccccc",
                  }}
                  onMouseEnter={() => handleHover("cancel", true)}
                  onMouseLeave={() => handleHover("cancel", false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CSS for floating animation */}
      <style jsx="true">{`
        @keyframes float {
          0% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0px) translateX(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default AccountProfilePage;
