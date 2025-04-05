import { createContext, useContext, useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { socket } = useSocket();
  
  const [countdown, setCountdown] = useState(null);
  const [pot, setPot] = useState(null);
  const [lastdraw, setlastdraw] =useState(null);
  

  useEffect(() => {
    if (!socket) return;

    const handleCountdownUpdate = (newCountdown) => {
      setCountdown(newCountdown);
    };

    const handlePotUpdate = (data) => {
      console.log("Pot update received:", data);
      if (data && data.amount) {
        setPot(data.amount);
      }
    };

    const handleLastDraw = (data) => {
      // console.log("last draw recieved:", data);
      if (data && data.winning_num) {
        setlastdraw(data.winning_num);
      }
    };

   

    socket.on("countdownUpdate", handleCountdownUpdate);
    socket.on("Pot", handlePotUpdate);
    socket.on("Lastdraw", handleLastDraw);

    
    // Request initial data
    socket.emit("requestPot");
    requestLastDraw(); //magsesend ng token 
    

    return () => {
      socket.off("countdownUpdate", handleCountdownUpdate);
      socket.off("Pot", handlePotUpdate);
      socket.off("Lastdraw", handleLastDraw);
     
    };
  }, [socket]);

  const placeBet = (betNumber) => {
    const token = localStorage.getItem("token");
    socket.emit("requestBet", { betNumber, token }, (response) => {
      if (response?.success) {
        console.log("✅ Bet placed successfully:", response);
      } else {
        console.error("❌ Bet failed:", response?.message || "Unknown error");
      }
    });
  };

  const requestLastDraw = () => {
    if (!socket) return;
    const token = localStorage.getItem("token");
    // console.log("Requesting last draw with token...");
    socket.emit("requestdraw", { token });
  };
  

  return (
    <SocketContext.Provider value={{ countdown, pot, placeBet, lastdraw, requestLastDraw}}>
      {children}
    </SocketContext.Provider>
  );
}

// Custom hook to use countdown & betting context
export function useCountdown() {
  return useContext(SocketContext);
}
