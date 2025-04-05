import { useEffect, useState } from "react";
import TakarakujiLoader from "./pages/loader";
import AppRoutes from "./routes/Approutes";
import useSocket from "./hooks/useSocket";
import { SocketProvider } from "./service/CountdownContext"; // Wrap with provider

function App() {
  const { isConnected } = useSocket();
  const [loading, setLoading] = useState(true);
  const [hasShownIntro, setHasShownIntro] = useState(false);

  useEffect(() => {
    const introShown = sessionStorage.getItem("takarakujiIntroShown");

    if (introShown === "true") {
      setHasShownIntro(true);
      setLoading(false);
      return;
    }

    if (isConnected && !hasShownIntro) {
      const loadingTimeout = setTimeout(() => {
        setLoading(false);
        setHasShownIntro(true);
        sessionStorage.setItem("takarakujiIntroShown", "true");
      }, 5000); // 5-second intro

      return () => clearTimeout(loadingTimeout);
    }
  }, [isConnected, hasShownIntro]);

  useEffect(() => {
    if (!isConnected) {
      setLoading(true);
    }
  }, [isConnected]);

  return (
    <SocketProvider>
      <div className="app-container">
        {loading && !hasShownIntro ? (
          <TakarakujiLoader
            onComplete={() => {
              setLoading(false);
              setHasShownIntro(true);
              sessionStorage.setItem("takarakujiIntroShown", "true");
            }}
          />
        ) : (
          <AppRoutes />
        )}
      </div>
    </SocketProvider>
  );
}

export default App;
