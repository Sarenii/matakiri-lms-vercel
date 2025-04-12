// src/routes/AppRoutes.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/HomePage";
import Header from "../components/Header";
import Footer from "../components/Footer";
import About from "../features/about/About";
import Signup from "../components/Auths/Signup";
import Login from "../components/Auths/Login";
import ForgotPassword from "../components/Auths/ForgotPassword";
import ProfilePage from "../pages/ProfilePage";
import ContactPage from "../pages/ContactPage";

// Courses and Layout
import CoursesLayout from "../features/courses/CoursesLayout";
import CoursesPage from "../pages/CoursePage";
import CreateCoursePage from "../features/courses/CourseForm";
import ManageCoursesPage from "../features/courses/ManageCoursesPage";
import ModulesList from "../features/courses/modules/ModulesList";

// Student/Instructor Course routes
import InProgressCourses from "../features/courses/InProgressCourses";
import CompletedCourses from "../features/courses/CompletedCourses";
import MyCourses from "../features/courses/MyCourses";
import ManageUsers from "../features/courses/ManageUsers";

// Menu pages
import AdminDashboard from "../features/courses/menu/AdminDashboard";
import InstructorAnalytics from "../features/courses/menu/InstructorAnalytics";
import StudentAnalytics from "../features/courses/menu/StudentAnalytics";
import Settings from "../features/courses/menu/Settings";
import Notifications from "../features/courses/menu/Notifications";
import Help from "../features/courses/menu/Help";
import Wishlist from "../features/courses/menu/Wishlist";

function AppRoutes() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* We nest everything under /courses with the same CoursesLayout */}
          <Route path="/courses" element={<CoursesLayout />}>
            {/* Default course listing */}
            <Route index element={<CoursesPage />} />

            {/* Course management */}
            <Route path="create" element={<CreateCoursePage />} />
            <Route path="manage" element={<ManageCoursesPage />} />
            <Route path=":courseId/modules" element={<ModulesList />} />

            {/* Student/Instructor Course routes */}
            <Route path="in-progress" element={<InProgressCourses />} />
            <Route path="completed" element={<CompletedCourses />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="manage-users" element={<ManageUsers />} />

            {/* Menu Pages (all under /courses) */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="instructor/analytics" element={<InstructorAnalytics />} />
            <Route path="student/analytics" element={<StudentAnalytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="help" element={<Help />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default AppRoutes;
