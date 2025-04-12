// src/services/progress.js

import api from "./api";

/**
 * Fetch a user's progress for a specific module within a specific course.
 * GET /courses/<courseId>/modules/<moduleId>/progress/
 * (This is the "list" endpoint; might return an array or single object depending on your serializer.)
 */
export const getUserModuleProgress = async (courseId, moduleId) => {
  try {
    const response = await api.get(`/courses/courses/${courseId}/modules/${moduleId}/progress/`);
    // If your server returns something like [{progress: 50}] or a single object {progress: 50},
    // adjust the below line accordingly. For example, if it's a single object:
    // return response.data.progress ?? 0;
    return response.data.progress ?? 0;
  } catch (error) {
    console.error("Error fetching module progress:", error);
    return 0; 
  }
};

/**
 * Update or "upsert" a user's module progress using your custom action:
 * PATCH /courses/<courseId>/modules/<moduleId>/progress/patch_progress/
 *
 * The backend code in ModuleProgressViewSet.patch_progress() will do get_or_create
 * and update the record's progress field.
 */
export const updateUserModuleProgress = async (courseId, moduleId, progress) => {
  try {
    const response = await api.patch(
      `/courses/courses/${courseId}/modules/${moduleId}/progress/patch_progress/`,
      { progress }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating module progress:", error);
    throw error;
  }
};
