// src/services/modules.js
import api from './api';

/**
 * Fetch modules for a specific course.
 * This returns an array of modules, each with:
 *   - chapters: an array
 *   - assignments, etc. if you want
 */
export const getCourseModules = async (courseId) => {
  try {
    const response = await api.get(`/courses/courses/${courseId}/modules/`);
    // If DRF pagination is used, might be { results: [..], count, next }
    if (response.data.results) {
      return response.data.results;
    }
    // otherwise assume direct array
    return response.data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
};
