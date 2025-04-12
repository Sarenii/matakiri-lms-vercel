import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, verifyOtp } from "../../services/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import visibility icons
import "../../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "STUDENT", // Added default role
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Signup payload:", formData); // Debugging payload
      await registerUser(formData);
      setStep(2); // Proceed to OTP verification step
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await verifyOtp(formData.email, otp);
      setSuccess(true);
      setStep(3);
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 3 && success) {
    return (
      <div className="signup-success">
        <h1>Welcome to Lab4GPS!</h1>
        <p>Your account has been verified successfully. You can now log in.</p>
        <button onClick={() => navigate("/login")} className="go-login">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        {step === 1 && (
          <div className="signup-form-container">
            <h1>Create Your Account</h1>
            <form onSubmit={handleSignup} className="signup-form">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label>Password:</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="toggle-password-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <label>First Name:</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              <label>Last Name:</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              {/* Hidden Role Input */}
              <input type="hidden" name="role" value="student" />

              {error && <p className="error-message">{error}</p>}
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="otp-verification-container">
            <h1>Verify Your Account</h1>
            <form onSubmit={handleVerifyOtp} className="otp-form">
              <label>Enter OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        )}

        <div className="signup-poster">
          <h2>{step === 1 ? "Welcome Back!" : "Almost There!"}</h2>
          <p>
            {step === 1
              ? "If you already have an account, log in to explore Lab4GPS features."
              : "Please verify your account to complete the signup process."}
          </p>
          {step === 1 && (
            <a href="/login" className="login-link">
              Log In
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
