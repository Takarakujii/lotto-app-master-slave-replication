import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import useAccountForm from "../service/FetchAccount";
import { useCountdown } from "../service/CountdownContext";
import WinningNotification from '../components/DisplayWinningNotification';
import { generateNewDraw } from "../service/DrawService";
import Navbar from "../components/Navbar";
import { useWindowSize } from "../hooks/useWindowSize";

const DrawPage = () => {
  const [selectedNumbers, setSelectedNumbers] = useState(Array(6).fill(null));
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const { countdown, pot, placeBet, lastdraw, requestLastDraw} = useCountdown();
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [error, setError] = useState(null);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [lastDrawNumbers, setLastDrawNumbers] = useState([0, 0, 0, 0, 0, 0]);
  const windowSize = useWindowSize();
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);

  const [winStatus, setWinStatus] = useState(null); // Track win status
  

  // Device detection with specific laptop breakpoints
  const isMobile = windowSize.width <= 768;
  const isSmallLaptop = windowSize.width > 768 && windowSize.width <= 900;
  const isLargeLaptop = windowSize.width > 900 && windowSize.width <= 1024;
  const isDesktop = windowSize.width > 1024;

  // Responsive utility functions
  const getContainerPadding = () => {
    if (isMobile) return "px-4";
    if (isSmallLaptop) return isNavExpanded ? "pl-32 pr-4" : "pl-12 pr-4";
    if (isLargeLaptop) return isNavExpanded ? "pl-36 pr-4" : "pl-14 pr-4";
    return isNavExpanded ? "pl-48 pr-6" : "pl-16 pr-6";
  };

  const getGridLayout = () => {
    if (isMobile) return "grid-cols-1";
    if (isSmallLaptop) return "grid-cols-1";
    return "grid-cols-1 lg:grid-cols-2";
  };

  const getNumberBoxSize = () => {
    if (isMobile) return "w-10 h-10 sm:w-12 sm:h-12";
    if (isSmallLaptop) return "w-12 h-12";
    if (isLargeLaptop) return "w-14 h-14";
    return "w-16 h-16";
  };

  const { balance, handleAccountForm } = useAccountForm();
  const navigate = useNavigate();

  // // Socket connection and event listeners
  // useEffect(() => {
  //   if (!isConnected || !socket) {
  //     console.log("Waiting for socket connection...");
  //     return;
  //   }

  //   console.log("Socket connected, setting up listeners");

  //   const handlePotUpdate = (data) => {
  //     // console.log("Pot update received:", data);
  //     if (data && data.amount) {
  //       setPotMoney(data.amount);
  //     }
  //   };

  //   socket.on("Pot", handlePotUpdate);

    
  //   return () => {
  //     if (socket) {
  //       console.log("Cleaning up socket listeners");
  //       socket.off("Pot", handlePotUpdate);
  //     }
  //   };
  // }, [isConnected, socket]);

  useEffect(() => {
    handleAccountForm();
  }, [handleAccountForm]);

  useEffect(() => {
    const newMinutes = Math.floor(countdown / 60);
    const newSeconds = countdown % 60;
    setMinutes(newMinutes);
    setSeconds(newSeconds);

    if (countdown === 0) {
      setAnimate(true);
      handleGenerateNewDraw();
     

      setTimeout(() => {
        setAnimate(false);
      }, 3000);
    }
  // }, [countdown, pot]);
  }, [countdown]);

  
  useEffect(() => {
    // console.log("Requesting last draw data...");
    if (requestLastDraw) {
      requestLastDraw();
    }
  }, [requestLastDraw]);

  // Process lastdraw data when it arrives
  useEffect(() => {
    if (lastdraw) {
      try {
        // Handle the string format (e.g., "01-02-03-04-05-06")
        const numbers = lastdraw.split('-').map(Number);
        console.log("Parsed numbers:", numbers);
        if (numbers.length === 6) {
          setLastDrawNumbers(numbers);
          checkWin(numbers);
        }
      } catch (err) {
        console.error("Error processing lastdraw:", err);
      }
    }
  }, [lastdraw]);

  const handleGenerateNewDraw = async () => {
    try {
      const response = await generateNewDraw();
      if (response.success) {
        console.log("New draw generated:", response);
        requestLastDraw();
      } else {
        setError(response.message || "Failed to generate a new draw.");
      }
    } catch (error) {
      console.error("Error generating new draw:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while generating a new draw."
      );
    }
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleButtonClick = (text) => {
    if (text === "Top Up") {
      navigate("/profile");
    } else if (text === "History") {
      navigate("/history");
    } else if (text === "Logout") {
      navigate("/signin");
    }
  };

  const handleOpenModal = (index) => {
    setActiveModalIndex(index);
    setError(null);
    setInsufficientFunds(false);
  };

  const handleCloseModal = () => {
    setActiveModalIndex(null);
  };

  const handleSelectNumber = (number) => {
    if (selectedNumbers.includes(number)) {
      setError(
        "This number is already selected. Please choose a different number."
      );
      return;
    }

    const newSelectedNumbers = [...selectedNumbers];
    newSelectedNumbers[activeModalIndex] = number;
    setSelectedNumbers(newSelectedNumbers);
    setActiveModalIndex(null);
    setError(null);
  };

  const handleReset = () => {
    setSelectedNumbers(Array(6).fill(null));
    setError(null);
    setInsufficientFunds(false);
  };

  const numberOptions = Array.from({ length: 45 }, (_, i) => i + 1);

  const handleBet = async () => {
    setError(null);
    setInsufficientFunds(false);

    if (selectedNumbers.includes(null)) {
      setError("Please select all 6 numbers before placing a bet.");
      return;
    }

    if (balance < 50) {
      setError("Insufficient funds to place bet. Please top up your account.");
      setInsufficientFunds(true);
      return;
    }

    const formattedBetNumber = selectedNumbers.map((num) => String(num).padStart(2, "0")).join("-");
    placeBet(formattedBetNumber); // Using WebSocket-based placeBet function
    // console.log("📩 Sending bet:", placeBet);
  };

  //   const formattedBetNumber = selectedNumbers
  //     .map((num) => String(num).padStart(2, "0"))
  //     .join("-");

  //   try {
  //     const response = await placeBet(formattedBetNumber);
  //     if (response.success) {
  //       console.log(response);
  //       handleAccountForm();
  //     } else {
  //       setError(response.message || "Bet failed. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error during bet", error);
  //     setError(
  //       error.response?.data?.message ||
  //         "An error occurred while placing your bet."
  //     );

  //     if (error.response?.data?.message?.includes("insufficient")) {
  //       setInsufficientFunds(true);
  //     }
  //   }
  // };

  const isNumberSelected = (number) => {
    return selectedNumbers.includes(number);
  };

  const formatLargeNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };


  const checkWin = (winningNumbers) => {
    if (selectedNumbers.every(num => num !== null)) {
      const isWin = selectedNumbers.every(num => winningNumbers.includes(num));
      if (isWin) {
        setWinStatus({
          isWinner: true,
          message: "Congratulations! You've won the jackpot!",
        });
        setShowWinPopup(true); // Show the winning popup
      } else {
        setWinStatus({
          isWinner: false,
          message: "Sorry, you didn't win this time. Try again!",
        });
      }
    }
  };

 
  useEffect(() => {
    setWinStatus(null);
  }, [selectedNumbers]);

  return (
    <div
      className="min-h-screen bg-gray-900 bg-opacity-95 relative overflow-hidden flex flex-col items-center"
      style={{
        backgroundImage:
          "linear-gradient(45deg, rgba(9,9,45,1) 0%, rgba(15,15,40,1) 100%)",
        backgroundSize: "cover",
      }}
    >
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

      {/* Background elements */}
      <div className="absolute w-40 h-40 rounded-full bg-blue-500 blur-3xl opacity-20 top-20 left-20"></div>
      <div className="absolute w-48 h-48 rounded-full bg-purple-600 blur-3xl opacity-20 bottom-40 right-20"></div>
      <div className="absolute w-36 h-36 rounded-full bg-blue-400 blur-3xl opacity-10 bottom-20 left-40"></div>
      <div className="absolute w-44 h-44 rounded-full bg-fuchsia-600 blur-3xl opacity-15 top-40 right-40"></div>

      <Navbar onExpandChange={setIsNavExpanded} />

      {/* main container */}
      <div
        className={`w-full max-w-[1800px] px-4 py-6 mx-auto flex flex-col items-center ${getContainerPadding()}`}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(75, 75, 155, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(75, 75, 155, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>

        {/* Pot Money */}
        <div
          className={`w-full max-w-[2000px] ${
            isMobile ? "mb-6 px-3 py-3" : "mb-8 px-4 py-4"
          } rounded-lg border-2 border-yellow-500 bg-gray-800 bg-opacity-30 backdrop-blur-sm text-center`}
        >
          <p
            className={`text-yellow-400 ${
              isMobile ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            } mb-1 sm:mb-2 tracking-wider uppercase font-light`}
          >
            CURRENT JACKPOT
          </p>
          <div
            className={`${
              isMobile
                ? "text-2xl sm:text-3xl"
                : isSmallLaptop
                ? "text-3xl sm:text-4xl"
                : "text-4xl sm:text-5xl"
            } font-bold`}
            style={{
              color: "#ffdd00",
              textShadow: "0 0 10px #ffdd00, 0 0 15px #ffdd00",
            }}
          >
            ₱{formatLargeNumber(pot || 0)}
          </div>
          <p className="text-yellow-200 text-xs mt-1 sm:mt-2 italic">
            Match all 6 numbers to win the grand prize!
          </p>
        </div>

        {/* Main content */}
        <div
          className={`w-full grid ${getGridLayout()} ${
            isMobile ? "gap-6" : "gap-8 sm:gap-10"
          }`}
        >
          {/* Left column - Ticket Section */}
          <div className={`space-y-${isMobile ? "6" : "6 sm:8"}`}>
            {/* Draw Ticket Section */}
            <div>
              <h2
                className={`text-yellow-400 ${
                  isMobile
                    ? "text-lg"
                    : isSmallLaptop
                    ? "text-lg sm:text-xl"
                    : "text-xl sm:text-2xl"
                } mb-2 sm:mb-3 font-light`}
              >
                DRAW TICKET
              </h2>
              <div
                className={`p-2 sm:p-3 rounded-lg border-2 border-gray-700 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex items-center justify-around ${
                  isMobile ? "h-[120px]" : "h-[150px]"
                }`}
              >
                {selectedNumbers.map((number, index) => (
                  <div
                    key={index}
                    className={`${getNumberBoxSize()} rounded-md flex items-center justify-center cursor-pointer transition-all hover:shadow-lg ${
                      number === null
                        ? "bg-gray-300"
                        : insufficientFunds
                        ? "bg-red-300 text-gray-900 font-bold hover:shadow-red-500/50"
                        : "bg-green-300 text-gray-900 font-bold hover:shadow-green-500/50"
                    } ${isMobile ? "text-lg" : "text-xl"}`}
                    onClick={() => handleOpenModal(index)}
                  >
                    {number !== null && number}
                  </div>
                ))}
              </div>

              {error && (
                <div
                  className={`mt-2 p-2 rounded-md text-center ${
                    insufficientFunds
                      ? "bg-red-900 bg-opacity-30 text-red-300"
                      : "bg-yellow-900 bg-opacity-30 text-yellow-300"
                  } ${isMobile ? "text-xs" : "text-sm"}`}
                >
                  {error}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div
              className={`flex ${
                isMobile ? "space-x-3" : "space-x-4 sm:space-x-6"
              } justify-center`}
            >
              <button
                className={`${
                  isMobile
                    ? "px-6 py-2 text-sm"
                    : isSmallLaptop
                    ? "px-8 py-2 text-sm sm:text-base"
                    : "px-8 sm:px-12 py-2 sm:py-3 text-base sm:text-lg"
                } border-2 border-fuchsia-500 rounded-md text-fuchsia-400 font-bold tracking-widest hover:bg-cyan-900 hover:bg-opacity-30 transition-all transform hover:scale-105`}
                style={{
                  textShadow: "0 0 10px #ff00ff, 0 0 10px #ff00ff",
                  boxShadow: "0 0 10px rgba(255, 0, 255, 0.5)",
                }}
                onClick={handleReset}
              >
                Reset
              </button>
              <button
                className={`${
                  isMobile
                    ? "px-6 py-2 text-sm"
                    : isSmallLaptop
                    ? "px-8 py-2 text-sm sm:text-base"
                    : "px-8 sm:px-12 py-2 sm:py-3 text-base sm:text-lg"
                } border-2 rounded-md font-bold tracking-widest hover:bg-opacity-30 transition-all transform hover:scale-105 ${
                  insufficientFunds
                    ? "border-red-500 text-red-400 hover:bg-red-900"
                    : "border-cyan-500 text-cyan-400 hover:bg-cyan-900"
                }`}
                style={{
                  textShadow: insufficientFunds
                    ? "0 0 10px rgba(248, 113, 113, 0.5)"
                    : "0 0 10px rgba(34, 211, 238, 0.5)",
                  boxShadow: insufficientFunds
                    ? "0 0 15px rgba(248, 113, 113, 0.3)"
                    : "0 0 15px rgba(34, 211, 238, 0.3)",
                }}
                onClick={handleBet}
              >
                Place Bet
              </button>
            </div>

            {/* Account Info */}
            <div
              className={`grid grid-cols-1 ${
                isMobile ? "gap-4" : "md:grid-cols-2 gap-4 sm:gap-5"
              }`}
            >
              {/* Account Balance Container */}
              <div
                className={`p-2 sm:p-3 rounded-lg border-2 bg-gray-800 bg-opacity-30 backdrop-blur-sm ${
                  isMobile ? "h-36" : isSmallLaptop ? "h-40" : "h-48 sm:h-56"
                } ${insufficientFunds ? "border-red-700" : "border-cyan-700"}`}
                style={{
                  boxShadow: insufficientFunds
                    ? "0 0 15px rgba(178, 8, 8, 0.2) inset"
                    : "0 0 15px rgba(8, 145, 178, 0.2) inset",
                }}
              >
                <div className="p-2 sm:p-3 rounded-lg bg-black bg-opacity-50 mb-1 sm:mb-2 border border-cyan-800 h-full flex flex-col justify-between">
                  <div>
                    <p
                      className={`mb-1 font-mono uppercase tracking-wider ${
                        insufficientFunds ? "text-red-400" : "text-cyan-400"
                      } ${isMobile ? "text-xs" : "text-xs sm:text-sm"}`}
                    >
                      ACCOUNT BALANCE
                    </p>
                    <p
                      className={`${
                        isMobile
                          ? "text-xl"
                          : isSmallLaptop
                          ? "text-xl sm:text-2xl"
                          : "text-xl sm:text-3xl"
                      } font-bold ${
                        insufficientFunds ? "text-red-300" : "text-white"
                      }`}
                      style={{
                        textShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      ₱{balance.toFixed(2)}
                    </p>

                    {insufficientFunds && (
                      <p
                        className={`text-red-400 ${
                          isMobile ? "text-xs" : "text-xs sm:text-sm"
                        } mt-1 sm:mt-2`}
                      >
                        Insufficient balance for ₱50 bet
                      </p>
                    )}
                  </div>
                  <div className="pt-1 sm:pt-2 border-t border-cyan-900">
                    <p
                      className={`text-cyan-200 ${
                        isMobile ? "text-xxs" : "text-xs"
                      } font-mono`}
                    >
                      Last transaction:{" "}
                      <span className="text-yellow-400">-₱50.00</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Container */}
              <div
                className={`p-2 sm:p-3 rounded-lg border-2 border-fuchsia-900 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex flex-col justify-between ${
                  isMobile ? "h-36" : isSmallLaptop ? "h-40" : "h-48 sm:h-56"
                }`}
                style={{
                  boxShadow: "0 0 15px rgba(112, 26, 117, 0.2) inset",
                }}
              >
                {["History", "Top Up", "Logout"].map((text, index) => (
                  <button
                    key={index}
                    className={`${
                      isMobile
                        ? "py-2 px-3 text-xs"
                        : isSmallLaptop
                        ? "py-2.5 px-4 text-sm"
                        : "py-3 px-4 text-sm sm:text-base"
                    } bg-transparent border rounded-md font-mono tracking-wide hover:bg-opacity-20 transition-all transform hover:scale-[1.02] flex justify-between items-center ${
                      text === "History"
                        ? "border-yellow-500 text-yellow-400"
                        : text === "Logout"
                        ? "border-red-500 text-red-400"
                        : insufficientFunds
                        ? "border-green-500 text-green-400 animate-pulse"
                        : "border-green-500 text-green-400"
                    }`}
                    style={{
                      textShadow: `0 0 5px ${
                        text === "History"
                          ? "rgba(250, 204, 21, 0.5)"
                          : text === "Logout"
                          ? "rgba(248, 113, 113, 0.5)"
                          : "rgba(74, 222, 128, 0.5)"
                      }`,
                    }}
                    onClick={() => handleButtonClick(text)}
                  >
                    <span className="whitespace-nowrap">{text}</span>
                    <span className={`${isMobile ? "text-xs" : "text-sm"}`}>
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Draw Info (hidden on small laptops) */}
          {!isSmallLaptop && (
            <div className={`space-y-${isMobile ? "4" : "4 sm:6"}`}>
              {/* Last Draw */}
              <div>
                <h2
                  className={`text-yellow-400 ${
                    isMobile
                      ? "text-lg"
                      : isLargeLaptop
                      ? "text-lg sm:text-xl"
                      : "text-xl sm:text-2xl"
                  } mb-2 sm:mb-3 font-light`}
                >
                  LAST DRAW
                </h2>
                <div
                  className={`p-2 sm:p-3 rounded-lg border-2 border-cyan-900 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex items-center justify-around h-[150px]`}
                >
                  {lastDrawNumbers.map((num, index) => (
                    <div
                      key={index}
                      className={`${getNumberBoxSize()} rounded-full bg-gray-900 flex items-center justify-center text-cyan-400 font-bold border border-cyan-800 ${
                        isMobile ? "text-xs" : "text-sm sm:text-base"
                      }`}
                      style={{
                        boxShadow: "0 0 10px rgba(34, 211, 238, 0.3)",
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>

              {/* Draw Countdown */}
              <div>
                <h2
                  className={`text-yellow-400 ${
                    isMobile
                      ? "text-lg"
                      : isLargeLaptop
                      ? "text-lg sm:text-xl"
                      : "text-xl sm:text-2xl"
                  } mb-2 sm:mb-3 font-light ${
                    isMobile ? "pt-4" : "pt-4 sm:pt-6"
                  } mt-6 sm:mt-8`}
                >
                  DRAW COUNTDOWN
                </h2>
                <div
                  className={`p-2 sm:p-3 rounded-lg border-2 border-fuchsia-900 bg-gray-800 bg-opacity-30 backdrop-blur-sm ${
                    isMobile
                      ? "h-36"
                      : isLargeLaptop
                      ? "h-40 sm:h-48"
                      : "h-48 sm:h-56"
                  } flex items-center justify-center`}
                  style={{
                    boxShadow: "0 0 15px rgba(112, 26, 117, 0.2) inset",
                  }}
                >
                  <div
                    className={`flex justify-center ${
                      isMobile ? "space-x-2" : "space-x-2 sm:space-x-3"
                    }`}
                  >
                    <div
                      className={`${
                        isMobile
                          ? "w-16 h-16"
                          : isLargeLaptop
                          ? "w-16 h-16 sm:w-20 sm:h-20"
                          : "w-20 h-20 sm:w-24 sm:h-24"
                      }`}
                    >
                      <div
                        className="w-full h-full bg-black border-2 border-fuchsia-500 rounded-md flex items-center justify-center font-bold"
                        style={{
                          color: "#ff1493",
                          textShadow: "0 0 10px rgba(255, 20, 147, 0.7)",
                          fontSize: isMobile
                            ? "1.75rem"
                            : isLargeLaptop
                            ? "2rem"
                            : "2.25rem",
                        }}
                      >
                        {formatTime(minutes)}
                      </div>
                      <p
                        className={`text-center text-gray-400 mt-1 ${
                          isMobile ? "text-xxs" : "text-xs sm:text-sm"
                        }`}
                      >
                        MINUTES
                      </p>
                    </div>

                    <div
                      className={`${
                        isMobile
                          ? "w-16 h-16"
                          : isLargeLaptop
                          ? "w-16 h-16 sm:w-20 sm:h-20"
                          : "w-20 h-20 sm:w-24 sm:h-24"
                      }`}
                    >
                      <div
                        className="w-full h-full bg-black border-2 border-fuchsia-500 rounded-md flex items-center justify-center font-bold"
                        style={{
                          color: "#ff1493",
                          textShadow: "0 0 10px rgba(255, 20, 147, 0.7)",
                          fontSize: isMobile
                            ? "1.75rem"
                            : isLargeLaptop
                            ? "2rem"
                            : "2.25rem",
                        }}
                      >
                        {formatTime(seconds)}
                      </div>
                      <p
                        className={`text-center text-gray-400 mt-1 ${
                          isMobile ? "text-xxs" : "text-xs sm:text-sm"
                        }`}
                      >
                        SECONDS
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Number Selection Modal */}
      {activeModalIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 sm:p-4">
          <div
            className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-4 w-full max-w-xs sm:max-w-md md:max-w-lg relative mx-2"
            style={{
              boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-cyan-400 text-lg sm:text-xl font-bold">
                Select Number
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white p-1"
              >
                <X size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {error && (
              <div className="mb-2 sm:mb-3 p-2 bg-red-900 bg-opacity-30 text-red-300 rounded-md text-center text-xs sm:text-sm">
                {error}
              </div>
            )}

            <div
              className="grid grid-cols-5 gap-2 sm:gap-3"
              style={{
                gridAutoRows: "minmax(0, 1fr)",
              }}
            >
              {numberOptions.map((num) => (
                <button
                  key={num}
                  className={`
              aspect-square w-full min-h-[2.5rem] sm:min-h-[3rem]
              rounded-md flex items-center justify-center 
              text-white font-bold transition-all transform hover:scale-105 
              text-sm sm:text-base
              ${
                isNumberSelected(num)
                  ? "bg-green-600 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-cyan-700"
              }`}
                  onClick={() => handleSelectNumber(num)}
                  disabled={isNumberSelected(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

{showWinPopup && (
  <WinningNotification 
    onClose={() => setShowWinPopup(false)}
  />
)}
    </div>
  );
};

export default DrawPage;
