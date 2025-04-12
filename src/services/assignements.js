// src/services/assignments.js
import api from './api';

/**
 * Fetch assignments for a specific module.
 * @param {number|string} moduleId - The ID of the module.
 * @returns {Promise<Array>} - A promise resolving to an array of assignments.
 */
export const getModuleAssignments = async (moduleId) => {
  try {
    const response = await api.get(`/modules/${moduleId}/assignments/`);
    return response.data; // Assuming the response is an array of assignments
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};
