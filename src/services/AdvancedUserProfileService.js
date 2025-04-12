// src/services/profileService.js
import api from './api'; // Your configured Axios instance

/**
 * Fetch the user profile from the backend
 * Endpoint: GET /auth/profile/
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile/');
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error; 
  }
};

/**
 * Update the user profile details (first_name, last_name, email, etc.)
 * Endpoint: PUT /auth/profile/update/
 */
export const updateUserProfile = async (profileData) => {
  try {
    // Send JSON data with 'application/json' content type
    const response = await api.put('/auth/profile/update/', profileData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; 
  }
};

/**
 * (Optional) Update the user’s profile picture
 * Endpoint: PUT /auth/profile/update-picture/
 * 
 * If you’re uploading an actual file, you’ll likely need FormData:
 *   const formData = new FormData();
 *   formData.append('profile_picture', file);
 * Then call updateProfilePicture(formData).
 */
export const updateProfilePicture = async (pictureData) => {
  try {
    // Ensure we're sending multipart/form-data for file uploads
    const response = await api.put('/auth/profile/update-picture/', pictureData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

/**
 * Example for logging out user (if needed)
 * Adjust or remove if your backend uses a different logout route.
 */
export const logoutUser = async () => {
  try {
    // If you have a specific logout endpoint, call it here (e.g., /auth/logout/).
    // For example:
    // const response = await api.post('/auth/logout/');
    
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Redirect to login
    window.location.href = '/login'; 
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
