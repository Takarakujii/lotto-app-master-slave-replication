import React, { useState, useEffect } from "react";


const TakarakujiLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 500); // Small delay after reaching 100%
          return 100;
        }
        return oldProgress + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full"
          style={{
            backgroundColor: "#09091D",
            backgroundSize: "cover", // 
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      {/* Takarakuji text and loading bar */}
      <div className="z-10 flex flex-col items-center space-y-6">
        <h1
          className="text-white text-5xl font-bold tracking-wider"
          style={{
            fontFamily: "The Last Shuriken",
            letterSpacing: "0.2em",
            background: "linear-gradient(45deg, #CE1326, #FF6A11)",
            WebkitBackgroundClip: "text", // Clips the background to the text
            color: "transparent", // Makes the text color transparent so the gradient shows through
          }}
        >
          TAKARAKUJI
        </h1>

        <div className="w-64 relative rounded-lg overflow-hidden">
          <div className="h-1 w-full bg-gray-700"></div>
          <div
            className="h-1 bg-white absolute top-0 left-0 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="text-white text-xs font-bold tracking-wide">
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default TakarakujiLoader;