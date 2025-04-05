import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animateError, setAnimateError] = useState(false);

  // Animation effect for username/password fields
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (error) {
      setAnimateError(true);
      const timer = setTimeout(() => setAnimateError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username/Email and Password are required.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:9000/v1/account/login",
        {
          username: username,
          password,
        },
        {
          headers: {
            apikey: "hotdog",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("API Response:", response.data);
      console.log("token", response.data.data.token);

      const token = response.data.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Logged in successfully, token:", token);

        // Success animation before redirect
        setTimeout(() => {
          navigate("/home");
        }, 800);
      } else {
        setError("Login failed. No token received.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError(
        error.response?.data?.message || "Invalid credentials or server error."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-900 bg-opacity-95 flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(45deg, rgba(9,9,45,1) 0%, rgba(15,15,40,1) 100%)",
        backgroundSize: "cover",
      }}
    >
      {/* Glowing orbs background effect */}
      <div className="absolute w-40 h-40 rounded-full bg-blue-500 blur-3xl opacity-20 top-20 left-20"></div>
      <div className="absolute w-48 h-48 rounded-full bg-purple-600 blur-3xl opacity-20 bottom-40 right-20"></div>
      <div className="absolute w-36 h-36 rounded-full bg-blue-400 blur-3xl opacity-10 bottom-20 left-40"></div>
      <div className="absolute w-44 h-44 rounded-full bg-fuchsia-600 blur-3xl opacity-15 top-40 right-40"></div>

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


      {/* Grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(75, 75, 155, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(75, 75, 155, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <form onSubmit={handleSubmit} className="z-10 w-full max-w-md">
        <div
          className={`p-8 rounded-lg border-2 border-cyan-700 bg-gray-800 bg-opacity-30 backdrop-blur-sm shadow-2xl transform transition-all duration-300 ${
            animateError ? "translate-x-2" : ""
          }`}
          style={{
            boxShadow: "0 0 20px rgba(8, 145, 178, 0.3)",
          }}
        >
          <div className="mb-8 text-center">
            <h2
              className="text-cyan-400 text-3xl font-light"
              style={{
                textShadow: "0 0 10px rgba(34, 211, 238, 0.7)",
              }}
            >
              Login to Your Account!
            </h2>
            <div className="h-1 w-20 bg-cyan-500 mx-auto mt-2 rounded"></div>
          </div>

          {error && (
            <div
              className={`mb-6 p-3 rounded-md bg-red-900 bg-opacity-30 border border-red-500 flex items-center gap-2 ${
                animateError ? "animate-pulse" : ""
              }`}
            >
              <AlertTriangle size={18} className="text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div
            className={`mb-6 relative transition-all duration-300 ${
              focusedField === "username" ? "scale-105" : ""
            }`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
              <Mail size={18} />
            </div>
            <input
              type="text"
              placeholder="Enter Username or Email"
              className={`w-full py-3 px-10 bg-black bg-opacity-50 border-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ${
                focusedField === "username"
                  ? "border-cyan-400"
                  : "border-gray-700"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusedField("username")}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div
            className={`mb-6 relative transition-all duration-300 ${
              focusedField === "password" ? "scale-105" : ""
            }`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className={`w-full py-3 px-10 bg-black bg-opacity-50 border-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 ${
                focusedField === "password"
                  ? "border-cyan-400"
                  : "border-gray-700"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4 bg-black border-2 border-cyan-700 rounded focus:ring-cyan-500 text-cyan-600"
            />
            <label
              htmlFor="showPassword"
              className="ml-2 text-gray-300 text-sm hover:text-cyan-300 transition-colors duration-300"
            >
              Show Password
            </label>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            <button
              type="submit"
              className="py-3 px-4 bg-transparent border-2 border-cyan-500 rounded-md font-bold tracking-wide hover:bg-cyan-900 hover:bg-opacity-30 transition-all transform hover:scale-105 text-cyan-400 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                textShadow: "0 0 5px rgba(34, 211, 238, 0.5)",
                boxShadow: "0 0 15px rgba(34, 211, 238, 0.2)",
              }}
              disabled={isLoading}
            >
              {isLoading ? "AUTHENTICATING..." : "LOGIN"}
              <ChevronRight
                size={18}
                className={isLoading ? "animate-pulse" : ""}
              />
            </button>

            <button
              type="button"
              className="py-3 px-4 bg-transparent border-2 border-fuchsia-500 rounded-md font-bold tracking-wide hover:bg-fuchsia-900 hover:bg-opacity-30 transition-all text-fuchsia-400"
              style={{
                textShadow: "0 0 5px rgba(192, 38, 211, 0.5)",
                boxShadow: "0 0 15px rgba(192, 38, 211, 0.2)",
              }}
            >
              FORGOT PASSWORD
            </button>
          </div>

          <p className="text-center text-gray-400">
            Don't have an access key?{" "}
            <Link
              to="/signup"
              className="text-cyan-400 hover:text-cyan-300 hover:underline transition-all"
            >
              REGISTER
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;