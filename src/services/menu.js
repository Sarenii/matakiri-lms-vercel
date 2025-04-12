// src/services/menu.js
import api from "./api";

/** Admin Dashboard */
export const fetchAdminDashboard = async () => {
  // GET /menu/admin/dashboard/
  return api.get("/menu/menu/admin/dashboard/");
};

/** Help Topics */
export const fetchHelpTopics = async () => {
  // GET /menu/help/
  return api.get("/menu/menu/help/");
};

/** Instructor Analytics */
export const fetchInstructorAnalytics = async () => {
  // GET /menu/analytics/instructor/
  return api.get("/menu/menu/analytics/instructor/");
};

/** Notifications */
export const fetchNotifications = async () => {
  // GET /menu/notifications/
  return api.get("/menu/menu/notifications/");
};

/** Student Analytics */
export const fetchStudentAnalytics = async () => {
  // GET /menu/analytics/student/
  return api.get("/menu/menu/analytics/student/");
};

/** Settings (Fetch) */
export const fetchSettings = async () => {
  // GET /menu/settings/
  return api.get("/menu/menu/settings/");
};

/** Settings (Update) */
export const updateSettings = async (settingsData) => {
  // POST /menu/settings/
  return api.post("/menu/menu/settings/", settingsData);
};
