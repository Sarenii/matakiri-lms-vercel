import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types'; // <-- Import PropTypes
import {
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserProfilePicture,
  changeUserPassword,
  refreshToken,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../services/auth"; // Assuming this path is correct relative to AuthContext.js

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          const userProfile = await getUserProfile();
          console.log("Fetched User Profile:", userProfile); // Debugging log
          setUser(userProfile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // Consider refreshing token here if it's an auth error before logging out
          logout(); // Clear tokens if fetching profile fails
        }
      }

      setLoading(false);
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Added eslint-disable to address potential missing dependency 'logout' if needed, or add 'logout' to dependencies

  // Login function
  const login = async (email, password) => {
    try {
      const { user: userProfile } = await loginUser(email, password);
      console.log("User logged in:", userProfile); // Debugging log
      setUser(userProfile);
      // No need to throw error here if handled by caller, depends on desired behavior
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw error to be handled by the calling component (e.g., Login form)
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    logoutUser(); // This function should handle clearing tokens and redirecting
  };

  // Update user profile details
  const updateProfile = async (profileData) => {
    try {
      const updatedProfile = await updateUserProfile(profileData);
      console.log("Updated User Profile:", updatedProfile); // Debugging log
      // Ensure the response structure matches how you update state
      setUser((prevUser) => ({ ...prevUser, ...updatedProfile }));
      return "Profile updated successfully."; // Or return updatedProfile if needed
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Update profile picture
  const updateProfilePicture = async (profilePicture) => {
    try {
      // Ensure the service function returns the expected structure
      const updatedPicture = await updateUserProfilePicture(profilePicture);
      console.log("Updated Profile Picture:", updatedPicture); // Debugging log
      // Make sure updatedPicture.profile_picture exists in the response
      if (updatedPicture && updatedPicture.profile_picture) {
         setUser((prevUser) => ({ ...prevUser, profile_picture: updatedPicture.profile_picture }));
      } else {
         // Handle case where picture URL might not be directly in response
         // Maybe refetch profile?
         console.warn("Profile picture URL not found in response, consider refetching user profile.");
         // Optionally refetch profile:
         // const userProfile = await getUserProfile();
         // setUser(userProfile);
      }
      return "Profile picture updated successfully.";
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  };

  // Change user password
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await changeUserPassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      console.log("Password changed successfully."); // Debugging log
      return response.message; // Ensure service returns { message: "..." }
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  // Forgot Password - Send OTP
  const initiateForgotPassword = async (email) => {
    try {
      const response = await forgotPassword(email);
      console.log("Forgot Password OTP sent:", response.message); // Debugging log
      return response.message;
    } catch (error) {
      console.error("Forgot Password error:", error);
      throw error;
    }
  };

  // Forgot Password - Verify OTP
  const verifyForgotPasswordOtp = async (email, otp) => {
    try {
      const response = await verifyResetOtp(email, otp);
      console.log("Forgot Password OTP verified:", response.message); // Debugging log
      return response.message;
    } catch (error) {
      console.error("OTP Verification error:", error);
      throw error;
    }
  };

  // Forgot Password - Reset Password
  const resetUserPassword = async (email, newPassword) => {
    try {
      const response = await resetPassword(email, newPassword);
      console.log("Password reset successfully:", response.message); // Debugging log
      return response.message;
    } catch (error) {
      console.error("Reset Password error:", error);
      throw error;
    }
  };

  // Refresh tokens periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (refreshTokenValue && !!user) { // Only refresh if logged in
        try {
          console.log("Attempting to refresh token..."); // Debug log
          await refreshToken(refreshTokenValue); // Assumes this updates localStorage internally
          console.log("Access token refreshed."); // Debugging log
        } catch (error) {
          console.error("Error refreshing token:", error);
          logout(); // Logout user if refresh fails (e.g., refresh token expired)
        }
      }
    }, 10 * 60 * 1000); // Refresh every 10 minutes (adjust interval as needed)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Re-run if user state changes (e.g., on login/logout), added 'user' dependency


  const value = {
    user,
    loading, // Expose loading state
    login,
    logout,
    updateProfile,
    updateProfilePicture,
    changePassword,
    initiateForgotPassword,
    verifyForgotPasswordOtp,
    resetUserPassword,
    isAuthenticated: !!user, // Derived state based on user object
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Conditional rendering based on loading state */}
      {!loading ? children : <div>Loading Authentication...</div>}
    </AuthContext.Provider>
  );
};

// --- Add propTypes validation ---
AuthProvider.propTypes = {
  // Validate that 'children' is a prop, it can be any renderable node,
  // and it is required for this component to function correctly.
  children: PropTypes.node.isRequired
};
// --- End propTypes validation ---

// No default export, assuming named exports are used throughout the app