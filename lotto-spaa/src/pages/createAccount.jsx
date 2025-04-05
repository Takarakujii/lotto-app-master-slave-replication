import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Calendar,
  Lock,
  AlertTriangle,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateError, setAnimateError] = useState(false);

  // Form validation
  const [validations, setValidations] = useState({
    username: null,
    email: null,
    password: null,
    birthdate: null,
  });

  // Animation effect for form fields
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState(0);
  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return "Weak";
    if (passwordStrength === 1) return "Medium";
    if (passwordStrength === 2) return "Strong";
    return "";
  };

  useEffect(() => {
    // Check password strength
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    if (error) {
      setAnimateError(true);
      const timer = setTimeout(() => setAnimateError(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Validate form fields
  const validateField = (field, value) => {
    let isValid = true;
    let message = "";

    switch (field) {
      case "username":
        if (!value) {
          isValid = false;
          message = "Username is required";
        } else if (value.length < 3) {
          isValid = false;
          message = "Username must be at least 3 characters";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          message = "Email is required";
        } else if (!emailRegex.test(value)) {
          isValid = false;
          message = "Please enter a valid email";
        }
        break;
      case "password":
        if (!value) {
          isValid = false;
          message = "Password is required";
        } else if (value.length < 6) {
          isValid = false;
          message = "Password must be at least 6 characters";
        }
        break;
      case "birthdate":
        if (!value) {
          isValid = false;
          message = "Birthdate is required";
        }
        // Add age verification if needed
        break;
      default:
        break;
    }

    setValidations((prev) => ({
      ...prev,
      [field]: { isValid, message },
    }));

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate all fields
    const isUsernameValid = validateField("username", username);
    const isEmailValid = validateField("email", email);
    const isPasswordValid = validateField("password", password);
    const isBirthdateValid = validateField("birthdate", birthdate);

    if (
      !isUsernameValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isBirthdateValid
    ) {
      setError("Please fix the errors in the form.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:9000/v1/account/",
        {
          username,
          email,
          password,
          birthdate,
        },
        {
          headers: {
            apikey: "hotdog",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Account created successfully:", response.data);
      setSuccess(true);

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setBirthdate("");

      // Redirect after delay
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      console.error("Error creating account:", error);
      setError(
        error.response?.data?.message ||
          "Error creating account. Please try again."
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
      <div className="absolute w-40 h-40 rounded-full bg-purple-500 blur-3xl opacity-20 top-20 left-20"></div>
      <div className="absolute w-48 h-48 rounded-full bg-blue-600 blur-3xl opacity-20 bottom-40 right-20"></div>
      <div className="absolute w-36 h-36 rounded-full bg-fuchsia-400 blur-3xl opacity-10 bottom-20 left-40"></div>
      <div className="absolute w-44 h-44 rounded-full bg-cyan-600 blur-3xl opacity-15 top-40 right-40"></div>

      
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
          className={`p-8 rounded-lg border-2 border-fuchsia-700 bg-gray-800 bg-opacity-30 backdrop-blur-sm shadow-2xl transform transition-all duration-300 ${
            animateError ? "translate-x-2" : ""
          }`}
          style={{
            boxShadow: "0 0 20px rgba(192, 38, 211, 0.3)",
          }}
        >
          <div className="mb-8 text-center">
            <h2
              className="text-fuchsia-400 text-3xl font-light"
              style={{
                textShadow: "0 0 10px rgba(192, 38, 211, 0.7)",
              }}
            >
              Create your First Account!
            </h2>
            <div className="h-1 w-20 bg-fuchsia-500 mx-auto mt-2 rounded"></div>
          </div>

          {success && (
            <div className="mb-6 p-3 rounded-md bg-green-900 bg-opacity-30 border border-green-500 flex items-center gap-2 animate-pulse">
              <CheckCircle size={18} className="text-green-400" />
              <p className="text-green-300 text-sm">
                Account created successfully! Redirecting...
              </p>
            </div>
          )}

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

          {/* Username field */}
          <div
            className={`mb-5 relative transition-all duration-300 ${
              focusedField === "username" ? "scale-105" : ""
            }`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fuchsia-400">
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="Enter Username"
              className={`w-full py-3 px-10 bg-black bg-opacity-50 border-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                validations.username?.isValid === false
                  ? "border-red-500 focus:ring-red-500"
                  : focusedField === "username"
                  ? "border-fuchsia-400 focus:ring-fuchsia-500"
                  : "border-gray-700"
              }`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                validateField("username", e.target.value);
              }}
              onFocus={() => setFocusedField("username")}
              onBlur={() => {
                setFocusedField(null);
                validateField("username", username);
              }}
            />
            {validations.username?.isValid === false && (
              <p className="text-red-400 text-xs mt-1 ml-2">
                {validations.username.message}
              </p>
            )}
          </div>

          {/* Email field */}
          <div
            className={`mb-5 relative transition-all duration-300 ${
              focusedField === "email" ? "scale-105" : ""
            }`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fuchsia-400">
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="Enter Email"
              className={`w-full py-3 px-10 bg-black bg-opacity-50 border-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                validations.email?.isValid === false
                  ? "border-red-500 focus:ring-red-500"
                  : focusedField === "email"
                  ? "border-fuchsia-400 focus:ring-fuchsia-500"
                  : "border-gray-700"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateField("email", e.target.value);
              }}
              onFocus={() => setFocusedField("email")}
              onBlur={() => {
                setFocusedField(null);
                validateField("email", email);
              }}
            />
            {validations.email?.isValid === false && (
              <p className="text-red-400 text-xs mt-1 ml-2">
                {validations.email.message}
              </p>
            )}
          </div>

          {/* Birthdate field */}
          <div
            className={`mb-5 relative transition-all duration-300 ${
              focusedField === "birthdate" ? "scale-105" : ""
            }`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fuchsia-400">
              <Calendar size={18} />
            </div>
            <input
              type="date"
              placeholder="Enter Birthdate"
              className={`w-full py-3 px-10 bg-black bg-opacity-50 border-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                validations.birthdate?.isValid === false
                  ? "border-red-500 focus:ring-red-500"
                  : focusedField === "birthdate"
                  ? "border-fuchsia-400 focus:ring-fuchsia-500"
                  : "border-gray-700"
              }`}
              value={birthdate}
              onChange={(e) => {
                setBirthdate(e.target.value);
                validateField("birthdate", e.target.value);
              }}
              onFocus={() => setFocusedField("birthdate")}
              onBlur={() => {
                setFocusedField(null);
                validateField("birthdate", birthdate);
              }}
            />
            {validations.birthdate?.isValid === false && (
              <p className="text-red-400 text-xs mt-1 ml-2">
                {validations.birthdate.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div
            className={`mb-3 relative transition-all duration-300 ${
              focusedField === "password" ? "scale-105" : ""
            }`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-fuchsia-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className={`w-full py-3 px-10 bg-black bg-opacity-50 border-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                validations.password?.isValid === false
                  ? "border-red-500 focus:ring-red-500"
                  : focusedField === "password"
                  ? "border-fuchsia-400 focus:ring-fuchsia-500"
                  : "border-gray-700"
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validateField("password", e.target.value);
              }}
              onFocus={() => setFocusedField("password")}
              onBlur={() => {
                setFocusedField(null);
                validateField("password", password);
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-fuchsia-400 transition-colors duration-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

            {validations.password?.isValid === false && (
              <p className="text-red-400 text-xs mt-1 ml-2">
                {validations.password.message}
              </p>
            )}
          </div>

          {/* Password strength indicator */}
          {password && (
            <div className="mb-5">
              <div className="flex items-center space-x-2 mb-1">
                <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      passwordStrength === 0
                        ? "bg-red-500 w-1/3"
                        : passwordStrength === 1
                        ? "bg-yellow-500 w-2/3"
                        : "bg-green-500 w-full"
                    } transition-all duration-300`}
                  ></div>
                </div>
                <span
                  className={`text-xs ${
                    passwordStrength === 0
                      ? "text-red-400"
                      : passwordStrength === 1
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {getPasswordStrengthLabel()}
                </span>
              </div>
              <p className="text-gray-500 text-xs">
                Use 8+ characters with a mix of letters, numbers & symbols
              </p>
            </div>
          )}

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4 bg-black border-2 border-fuchsia-700 rounded focus:ring-fuchsia-500 text-fuchsia-600"
            />
            <label
              htmlFor="showPassword"
              className="ml-2 text-gray-300 text-sm hover:text-fuchsia-300 transition-colors duration-300"
            >
              Show Password
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 mb-6 bg-transparent border-2 border-fuchsia-500 rounded-md font-bold tracking-wide hover:bg-fuchsia-900 hover:bg-opacity-30 transition-all transform hover:scale-105 text-fuchsia-400 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              textShadow: "0 0 5px rgba(192, 38, 211, 0.5)",
              boxShadow: "0 0 15px rgba(192, 38, 211, 0.2)",
            }}
            disabled={isLoading}
          >
            {isLoading ? "CREATING USER..." : "CREATE ACCOUNT"}
            <ChevronRight
              size={18}
              className={isLoading ? "animate-pulse" : ""}
            />
          </button>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-fuchsia-400 hover:text-fuchsia-300 hover:underline transition-all"
            >
              LOGIN
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
