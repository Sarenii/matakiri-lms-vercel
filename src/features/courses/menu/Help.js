// src/components/Help.jsx
import React, { useEffect, useState } from "react";
import { fetchHelpTopics } from "../../../services/menu"; // <-- new import
import "../../../styles/main.css";

const Help = () => {
  const [helpTopics, setHelpTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHelp = async () => {
      try {
        const response = await fetchHelpTopics(); // <-- call service
        if (Array.isArray(response.data)) {
          setHelpTopics(response.data);
        } else {
          setError("Unexpected help data format.");
        }
      } catch (err) {
        console.error("Failed to load help topics:", err);
        setError("Failed to load help topics.");
      } finally {
        setLoading(false);
      }
    };
    loadHelp();
  }, []);

  if (loading) {
    return <div className="page-container">Loading help topics...</div>;
  }
  if (error) {
    return <div className="page-container">{error}</div>;
  }
  if (helpTopics.length === 0) {
    return <div className="page-container">No help topics found.</div>;
  }

  return (
    <div className="page-container">
      <h1>Help & Support</h1>
      {helpTopics.map((topic) => (
        <div key={topic.id} className="help-topic">
          <h3>{topic.title}</h3>
          <p>{topic.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Help;
