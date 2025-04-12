// src/pages/MyCourses.jsx
import React, { useEffect, useState } from "react";
import { getMyCourses } from "../../services/courses";
import { useNavigate } from "react-router-dom";
import "../../styles/manageAdmin.css";

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // getMyCourses => { courses, next }
        const { courses } = await getMyCourses();
        console.log("Fetched my courses:", courses);
        setMyCourses(courses);
      } catch (err) {
        console.error("Error fetching instructor courses:", err);
        setError("Failed to load your courses.");
        setMyCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  const handleEdit = (course) => {
    navigate("/courses/create", { state: { course } });
  };

  if (loading) {
    return <p>Loading your courses...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="my-courses-page">
      <h1>My Courses</h1>
      {myCourses.length === 0 ? (
        <p>You have not created any courses yet.</p>
      ) : (
        <table className="courses-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myCourses.map((course) => (
              <tr key={course.id}>
                <td>
                  {course.cover_image ? (
                    <img
                      src={course.cover_image}
                      alt={course.title}
                      className="table-cover"
                    />
                  ) : (
                    <div className="table-cover-placeholder"></div>
                  )}
                </td>
                <td>{course.title}</td>
                <td className="truncate">{course.description}</td>
                <td className="actions-cell">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => navigate(`/courses/${course.id}/manage`)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCourses;
