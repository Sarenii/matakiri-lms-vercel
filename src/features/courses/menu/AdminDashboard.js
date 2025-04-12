// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchAdminDashboard } from "../../../services/menu"; // <-- new import
import "../../../styles/main.css";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetchAdminDashboard(); // <-- call service
        setDashboardData(response.data);
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
        setError("Failed to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return <div className="page-container">Loading dashboard data...</div>;
  }
  if (error) {
    return <div className="page-container">{error}</div>;
  }
  if (!dashboardData) {
    return <div className="page-container">No data available.</div>;
  }

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>
      <ul className="data-list">
        <li>Total Users: {dashboardData.totalUsers}</li>
        <li>Active Users: {dashboardData.activeUsers}</li>
        <li>Pending Requests: {dashboardData.pendingRequests}</li>
        <li>Revenue: ${dashboardData.revenue}</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
