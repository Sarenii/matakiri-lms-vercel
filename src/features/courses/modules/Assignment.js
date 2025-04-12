// src/features/courses/AssignmentsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getModuleAssignments } from '../../services/assignments'; // Create this service
import '../../styles/assignmentsPage.css'; // Create and style as needed
import Spinner from '../../components/Spinner'; // If created

const AssignmentsPage = () => {
  const { courseId, moduleId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const fetchedAssignments = await getModuleAssignments(moduleId);
        setAssignments(fetchedAssignments);
        setError('');
      } catch (err) {
        console.error('Failed to fetch assignments:', err);
        setError('Failed to fetch assignments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [moduleId]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="assignments-container">
      <h2>Assignments for Module {moduleId} in Course {courseId}</h2>
      {assignments.length === 0 ? (
        <p>No assignments available for this module.</p>
      ) : (
        <ul className="assignments-list">
          {assignments.map((assignment) => (
            <li key={assignment.id} className="assignment-item">
              <h3>{assignment.title}</h3>
              <p>{assignment.description}</p>
              <p>Due Date: {new Date(assignment.due_date).toLocaleDateString()}</p>
              {/* Add more details or actions as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentsPage;
