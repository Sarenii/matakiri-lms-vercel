// src/components/StudentAnalytics.jsx
import React, { useEffect, useState } from "react";
import { fetchStudentAnalytics } from "../../../services/menu"; // <-- new import
import "../../../styles/main.css";

const StudentAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetchStudentAnalytics(); // <-- call service
        setAnalyticsData(response.data);
      } catch (err) {
        console.error("Failed to load student analytics:", err);
        setError("Failed to load student analytics.");
      } finally {
        setLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="page-container">Loading analytics data...</div>;
  }
  if (error) {
    return <div className="page-container">{error}</div>;
  }
  if (!analyticsData) {
    return <div className="page-container">No analytics data available.</div>;
  }

  return (
    <div className="page-container">
      <h1>Student Analytics</h1>
      <ul className="data-list">
        <li>Courses Enrolled: {analyticsData.coursesEnrolled}</li>
        <li>Completed Courses: {analyticsData.completedCourses}</li>
        <li>Progress: {analyticsData.progressPercentage}%</li>
      </ul>
    </div>
  );
};

export default StudentAnalytics;
