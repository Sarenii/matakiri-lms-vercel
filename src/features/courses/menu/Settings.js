// src/components/Settings.jsx
import React, { useEffect, useState } from "react";
import { fetchSettings, updateSettings } from "../../../services/menu"; // <-- new
import "../../../styles/main.css";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    theme: "",
    notifications: false,
    language: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetchSettings(); // <-- call service
        if (response.data) {
          setSettings(response.data);
          setFormData(response.data);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        setError("Failed to load settings.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateSettings(formData); // <-- call service
      setMessage(response.data.message);
      setSettings(response.data.settings);
    } catch (err) {
      console.error("Failed to update settings:", err);
      setError("Failed to update settings.");
    }
  };

  if (loading) {
    return <div className="page-container">Loading settings...</div>;
  }
  if (error) {
    return <div className="page-container">{error}</div>;
  }
  if (!settings) {
    return <div className="page-container">No settings found.</div>;
  }

  return (
    <div className="page-container">
      <h1>Settings</h1>
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label>
            Theme:
            <select name="theme" value={formData.theme} onChange={handleChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Notifications:
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Language:
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </label>
        </div>
        <button type="submit" className="submit-button">
          Update Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
