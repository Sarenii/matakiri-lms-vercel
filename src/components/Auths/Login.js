import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext"; // Import AuthContext
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import visibility icons
import "../../styles/Login.css"; // Assuming this path is correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state to prevent multiple clicks
  const navigate = useNavigate();
  const { login } = useAuth(); // Access login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password); // Call the login function from AuthContext
      navigate("/courses"); // Redirect to the dashboard or appropriate page
    } catch (err) {
      // Improve error message handling - check if err.response exists for API errors
      const errorMessage = err.response?.data?.message || err.message || "Invalid email or password. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <h1>Login</h1>
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group"> {/* Added form-group for better structure/styling */}
              <label htmlFor="email">Email:</label> {/* Use htmlFor */}
              <input
                type="email"
                id="email" // Add id matching htmlFor
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true" // Accessibility
              />
            </div>
            <div className="form-group"> {/* Added form-group */}
              <label htmlFor="password">Password:</label> {/* Use htmlFor */}
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password" // Add id matching htmlFor
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true" // Accessibility
                />
                <span
                  className="toggle-password-icon"
                  onClick={togglePasswordVisibility} // Use handler function
                  role="button" // Accessibility
                  aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                  tabIndex={0} // Make it focusable
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') togglePasswordVisibility(); }} // Keyboard accessibility
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            {error && <p className="error-message" role="alert">{error}</p>} {/* Add role="alert" */}
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="forgot-password-link"> {/* Added class for styling */}
            Forgot your password? <a href="/forgot-password">Reset it here</a>
          </p>
        </div>

        <div className="login-poster">
          <h2>New here?</h2>
          <p>
            {/* Corrected 'haven't' to 'haven&apos;t' */}
            If you haven&apos;t created an account yet, you can easily sign up and
            start exploring our features.
          </p>
          {/* Consider using Link from react-router-dom for internal navigation */}
          <a href="/signup" className="signup-link">
            Sign Up Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;