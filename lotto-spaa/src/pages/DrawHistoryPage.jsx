import React, { useState, useEffect } from "react";
import { Hash, Trophy, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchWinners } from "../service/FetchWinners";

const DrawHistoryPage = () => {
  const [navExpanded, setNavExpanded] = useState(false);
  const [drawHistory, setDrawHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch winners data on component mount
  useEffect(() => {
    const getWinnersData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchWinners();
        console.log("Winners data:", response);
        
        if (response.success && response.winners) {
          const formattedData = response.winners.map(winner => ({
            id: winner.id || Math.random().toString(36).substr(2, 9),
            drawNumber: winner.draw_number || `Draw-${winner.id}`,
            date: winner.draw_date || new Date().toISOString().split('T')[0],
            numbers: winner.winning_number ? winner.winning_number.split('-').map(Number) : [0, 0, 0, 0, 0, 0],
            jackpot: `₱${winner.winning_prize ? winner.winning_prize.toLocaleString() : '0'}`,
            username: winner.username || "Anonymous"
          }));
          
          setDrawHistory(formattedData);
        } else {
          setDrawHistory([
            {
              id: 1,
              drawNumber: "D-2023-001",
              date: "2023-10-01",
              numbers: [7, 14, 21, 28, 35, 42],
              jackpot: "₱10,000,000",
              username: "CyberPlayer88"
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching winners:", err);
        setError("Failed to load winners data");
        // Set fallback data in case of error
        setDrawHistory([
          {
            id: 1,
            drawNumber: "D-2023-001",
            date: "2023-10-01",
            numbers: [7, 14, 21, 28, 35, 42],
            jackpot: "₱10,000,000",
            username: "CyberPlayer88"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    getWinnersData();
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a001a 0%, #1f0040 100%)",
      }}
    >
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

      {/* Navbar component */}
      <Navbar onExpandChange={(expanded) => setNavExpanded(expanded)} />

      {/* Wrapper div for header and draw history */}
      <div
        className={`relative z-10 transition-all duration-300 ${
          navExpanded ? "pl-48" : "pl-16"
        }`}
      >
        {/* Header */}
        <header className="p-5">
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

        {/* Main content - Draw History */}
        <main className="container mx-auto px-4 py-8">
          <div
            className="p-6 rounded-lg"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              boxShadow:
                "0 0 15px rgba(255, 0, 255, 0.5), inset 0 0 10px rgba(255, 0, 255, 0.2)",
              borderRadius: "10px",
              border: "1px solid rgba(255, 0, 255, 0.3)",
            }}
          >
            <h2
              className="text-3xl mb-8 flex items-center gap-3"
              style={{
                color: "#ff00ff",
                textShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff",
                letterSpacing: "2px",
              }}
            >
              <Calendar size={32} />
              Draw History
            </h2>

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-red-400 text-center py-8">
                {error}
              </div>
            )}

            {/* Draw history table */}
            {!isLoading && !error && (
              <div className="space-y-6">
                {drawHistory.length === 0 ? (
                  <div className="text-cyan-400 text-center py-8">
                    No draw history available
                  </div>
                ) : (
                  drawHistory.map((draw) => (
                    <div
                      key={draw.id}
                      className="p-6 rounded-lg"
                      style={{
                        background: "rgba(30, 30, 50, 0.7)",
                        border: "1px solid rgba(0, 255, 255, 0.5)",
                        boxShadow:
                          "0 0 10px rgba(0, 255, 255, 0.3), inset 0 0 5px rgba(0, 255, 255, 0.2)",
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-lg text-cyan-400 mb-1">Draw Date</p>
                          <p className="text-xl font-medium text-white">
                            {draw.date}
                          </p>
                        </div>

                        <div>
                          <p className="text-lg text-cyan-400 mb-1">Username</p>
                          <p className="text-xl font-medium text-white flex items-center">
                            <User size={18} className="mr-2 text-blue-400" />
                            <span className="text-blue-300">{draw.username}</span>
                          </p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-lg text-cyan-400 mb-2">
                          Winning Numbers
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {draw.numbers.map((number, index) => (
                            <div
                              key={index}
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{
                                background: "rgba(255, 0, 255, 0.3)",
                                border: "1px solid rgba(255, 0, 255, 0.7)",
                                boxShadow: "0 0 8px rgba(255, 0, 255, 0.5)",
                                color: "#ffffff",
                                textShadow: "0 0 5px #ffffff",
                              }}
                            >
                              <Hash size={16} className="mr-1" />
                              {number}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-lg text-cyan-400 mb-1">
                          Jackpot Prize
                        </p>
                        <p className="text-2xl font-bold text-yellow-400 flex items-center">
                          <Trophy size={24} className="mr-2" />
                          {draw.jackpot}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
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

export default DrawHistoryPage;
