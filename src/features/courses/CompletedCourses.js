// src/pages/CompletedCourses.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompletedCourses } from "../../services/courses";
import "../../styles/course.css"; // Reuse your existing course styles

const CompletedCourses = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        // 'getCompletedCourses' now returns an array
        const data = await getCompletedCourses();
        setCompletedCourses(data);
      } catch (err) {
        console.error("Failed to load completed courses:", err);
        setError("Failed to load completed courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  if (loading) {
    return (
      <section className="course-sections">
        <h2>Completed Courses</h2>
        <div className="course-list">
          <div className="loading-message">Loading completed courses...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="course-sections">
        <h2>Completed Courses</h2>
        <div className="course-list">
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  // If no courses
  if (!Array.isArray(completedCourses) || completedCourses.length === 0) {
    return (
      <section className="course-sections">
        <h2>Completed Courses</h2>
        <div className="course-list no-courses">
          <div className="no-courses-message">
            {/* Replaced ' in haven't with &rsquo; */}
            You haven&rsquo;t completed any courses yet.
          </div>
        </div>
      </section>
    );
  }

  // Otherwise, display the list of completed courses in cards
  return (
    <section className="course-sections">
      <h2>Completed Courses</h2>
      <div className="course-list">
        {completedCourses.map((course) => (
          <div
            key={course.id}
            className="course-card"
            onClick={() => navigate(`/courses/${course.id}/modules`)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate(`/courses/${course.id}/modules`);
              }
            }}
            aria-label={`View modules for ${course.title}`}
          >
            <div className="course-card-content">
              <div className="course-cover-container">
                {course.cover_image ? (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="course-cover"
                  />
                ) : (
                  <div className="course-cover placeholder">No Image</div>
                )}
              </div>
              <h3>{course.title}</h3>
              <p>
                {course.description && course.description.length > 100
                  ? course.description.substring(0, 100) + "..."
                  : course.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CompletedCourses;