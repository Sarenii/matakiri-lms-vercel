// src/services/courses.js
import api from "./api";

/**
 * getCourses
 * If DRF pagination is used, the server returns { count, next, previous, results }
 */
export const getCourses = async (url = null) => {
  // If url is null, default to "/courses/courses/"
  const endpoint = url || "/courses/courses/";
  const response = await api.get(endpoint);

  // If DRF pagination is used:
  const { results, next } = response.data;
  const courses = Array.isArray(results) ? results : [];
  return { courses, next }; // Return an object
};

export const getMyCourses = async () => {
  const response = await api.get("/courses/courses/my_courses/");
  const courses = Array.isArray(response.data) ? response.data : [];
  return { courses, next: null };
};

/**
 * getInProgressCourses
 */
export const getInProgressCourses = async () => {
  const response = await api.get("/courses/courses/in_progress_courses/");
  const courses = Array.isArray(response.data) ? response.data : [];
  return { courses, next: null };
};

/**
 * getCompletedCourses
 */
export const getCompletedCourses = async (url = null) => {
  const endpoint = url || "/courses/courses/completed_courses/";
  const response = await api.get(endpoint);

  // We handle both scenarios:
  // 1) The server directly returns an array of courses
  // 2) The server returns a DRF-style object with {results: [...], next, ...}

  let courses = [];
  if (Array.isArray(response.data)) {
    // The server returned a plain array
    courses = response.data;
  } else {
    // The server returned an object, so look for "results"
    const { results } = response.data;
    courses = Array.isArray(results) ? results : [];
  }

  // Return just the array, since your component expects an array
  return courses;
};

/**
 * Fetch a specific course by ID
 */
export const getCourseById = async (id) => {
  try {
    const response = await api.get(`/courses/courses/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new course (instructor only).
 */
export const createCourse = async (courseData) => {
  try {
    const response = await api.post("/courses/courses/", courseData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

/**
 * Update an existing course.
 */
export const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/courses/courses/${id}/`, courseData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating course ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a course
 */
export const deleteCourse = async (id) => {
  try {
    const response = await api.delete(`/courses/courses/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting course ${id}:`, error);
    throw error;
  }
};
