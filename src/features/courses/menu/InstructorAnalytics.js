// src/components/InstructorAnalytics.jsx
import React, { useEffect, useState } from "react";
import { fetchInstructorAnalytics } from "../../../services/menu"; // <-- new import
import "../../../styles/main.css";

const InstructorAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await fetchInstructorAnalytics(); // <-- call service
        setAnalyticsData(response.data);
      } catch (err) {
        console.error("Failed to load instructor analytics:", err);
        setError("Failed to load instructor analytics.");
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
      <h1>Instructor Analytics</h1>
      <ul className="data-list">
        <li>Total Courses: {analyticsData.totalCourses}</li>
        <li>Total Students: {analyticsData.totalStudents}</li>
        <li>Average Rating: {analyticsData.averageRating}</li>
      </ul>
    </div>
  );
};

export default InstructorAnalytics;
