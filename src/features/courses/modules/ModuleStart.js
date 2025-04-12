// src/features/courses/ModuleStart.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModuleDetails } from '../../services/modules';
import { updateUserModuleProgress } from '../../services/progress';
import '../../styles/moduleStart.css'; 
import Spinner from '../../components/Spinner'; // if you have one

const ModuleStart = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const moduleData = await getModuleDetails(moduleId);
        setModule(moduleData);
        setError('');
      } catch (err) {
        console.error('Failed to fetch module details:', err);
        setError('Failed to load module.');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  const handleCompleteModule = async () => {
    try {
      // Note: Pass both courseId and moduleId to update progress
      await updateUserModuleProgress(courseId, moduleId, 100);
      navigate(`/courses/${courseId}/modules/${moduleId}/view`);
    } catch (err) {
      console.error('Failed to update module progress:', err);
      alert('Failed to mark module as completed.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!module) {
    return <div className="error-message">Module not found.</div>;
  }

  return (
    <div className="module-start-container">
      <h2>{module.title}</h2>
      <p>{module.description}</p>
      {/* Display module contents or interactive elements here */}
      <button className="complete-module-btn" onClick={handleCompleteModule}>
        Mark as Completed
      </button>
    </div>
  );
};

export default ModuleStart;
