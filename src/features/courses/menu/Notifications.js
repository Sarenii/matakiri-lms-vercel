// src/components/Notifications.jsx
import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../../../services/menu"; // <-- new import
import "../../../styles/main.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchNotifications(); // <-- call service
        if (Array.isArray(response.data)) {
          setNotifications(response.data);
        } else {
          setError("Unexpected notifications format.");
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
        setError("Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  if (loading) {
    return <div className="page-container">Loading notifications...</div>;
  }
  if (error) {
    return <div className="page-container">{error}</div>;
  }
  if (notifications.length === 0) {
    return <div className="page-container">No notifications found.</div>;
  }

  return (
    <div className="page-container">
      <h1>Notifications</h1>
      <ul className="data-list">
        {notifications.map((note) => (
          <li key={note.id}>{note.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
