// src/services/enrollment.js
import api from "./api";

/**
 * Enroll in a course with an optional status.
 * @param {number} courseId - The ID of the course to enroll in.
 * @param {string} status - Optional. The status of the enrollment (e.g., "active", "pending").
 * @returns {Promise} - A promise resolving with the enrollment data.
 */
export const enrollInCourse = async (courseId, status = "active") => {
  const payload = {
    course: courseId,
    status: status, // Allows setting the status dynamically if needed
  };

  try {
    const response = await api.post("/courses/enrollments/", payload);
    return response.data;
  } catch (error) {
    console.error("Error during enrollment:", error.response?.data || error.message);
    throw error;
  }
};
