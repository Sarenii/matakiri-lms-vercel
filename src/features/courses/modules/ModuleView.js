// src/features/courses/ModuleView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getModuleDetails } from '../../services/modules'; // Create this service if not existing
import '../../styles/moduleView.css'; // Create and style as needed
import Spinner from '../../components/Spinner'; // If created

const ModuleView = () => {
  const { courseId, moduleId } = useParams();
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
    <div className="module-view-container">
      <h2>{module.title}</h2>
      <p>{module.description}</p>
      {/* Display module contents here */}
      {module.contents && module.contents.length > 0 ? (
        module.contents.map((content) => (
          <div key={content.id} className="module-content">
            <h4>{content.content_title}</h4>
            <p>Type: {content.content_type}</p>
            {content.text && <p>{content.text}</p>}
            {content.video_url && (
              <video controls width="100%">
                <source src={content.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {content.file && (
              <a href={content.file} target="_blank" rel="noopener noreferrer" className="download-link">
                Download File
              </a>
            )}
          </div>
        ))
      ) : (
        <p>No contents available for this module.</p>
      )}
    </div>
  );
};

export default ModuleView;
