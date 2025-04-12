// src/services/users.js
import api from "./api";

/**
 * Fetch all users (admin only).
 */
export const getUsers = async () => {
  try {
    // This corresponds to your backend endpoint at /auth/users/
    const response = await api.get("/auth/users/");
    // If paginated, might be response.data.results
    // If non-paginated, just response.data
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Update a user (e.g., change role). Requires admin privileges.
 * @param {number|string} userId - The ID of the user to update.
 * @param {object} payload - An object containing the fields to update, e.g. { role: "ADMIN" }.
 *   Valid roles (based on your model) are "STUDENT", "INSTRUCTOR", or "ADMIN".
 */
export const updateUser = async (userId, payload) => {
  try {
    // Endpoint: /auth/users/:id/ (PATCH for partial update)
    const response = await api.patch(
      `/auth/users/${userId}/`,
      payload,
      {
        headers: { "Content-Type": "application/json" }, // Ensures JSON content
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating user (ID: ${userId}):`, error);
    throw error.response?.data || error.message;
  }
};

/**
 * Delete a user. Requires admin privileges.
 * @param {number|string} userId - The ID of the user to delete.
 */
export const deleteUser = async (userId) => {
  try {
    // Endpoint: /auth/users/:id/
    const response = await api.delete(`/auth/users/${userId}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user (ID: ${userId}):`, error);
    throw error.response?.data || error.message;
  }
};
