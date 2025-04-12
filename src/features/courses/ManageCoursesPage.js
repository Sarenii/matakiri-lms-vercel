// src/pages/ManageCoursesPage.jsx
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types'; // Step 1: Import PropTypes
import { getCourses, deleteCourse } from "../../services/courses";
import { useNavigate } from "react-router-dom";
import "../../styles/manageAdmin.css";

// Confirm Dialog Component
const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button className="dialog-btn confirm" onClick={onConfirm}>
            Yes
          </button>
          <button className="dialog-btn cancel" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 2: Add propTypes validation for ConfirmDialog
ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


// Info Dialog Component
const InfoDialog = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-box info-box">
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button className="dialog-btn info" onClick={onClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Add propTypes validation for InfoDialog
InfoDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};


// Main Manage Courses Page Component
const ManageCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogError, setDialogError] = useState("");

  // For deletion confirmation
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState("");

  // Info dialog
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoDialogTitle, setInfoDialogTitle] = useState("");
  const [infoDialogMessage, setInfoDialogMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // 'getCourses()' returns { courses, next }
        const { courses } = await getCourses();
        setCourses(courses);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleEdit = (course) => {
    navigate("/courses/create", { state: { course } });
  };

  const handleDeleteClick = (id) => {
    setCourseToDelete(id);
    setConfirmDialogMessage("Are you sure you want to delete this course?");
    setConfirmDialogOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse(courseToDelete);
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete));
      setInfoDialogTitle("Course Deleted");
      setInfoDialogMessage("The course was deleted successfully.");
      setInfoDialogOpen(true);
    } catch (err) {
      console.error("Error deleting course:", err);
      setDialogError("Failed to delete course. Check console for details.");
    } finally {
      setConfirmDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const cancelDeleteCourse = () => {
    setConfirmDialogOpen(false);
    setCourseToDelete(null);
  };

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
    setInfoDialogTitle("");
    setInfoDialogMessage("");
  };

  return (
    <div className="manage-courses-page">
      <h1>Manage Courses</h1>
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses available.</p>
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
            {courses.map((course) => (
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
                  <button className="edit-btn" onClick={() => handleEdit(course)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(course.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {dialogError && <p className="error-msg">{dialogError}</p>}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        message={confirmDialogMessage}
        onConfirm={confirmDeleteCourse}
        onCancel={cancelDeleteCourse}
      />

      {/* Info Dialog */}
      <InfoDialog
        isOpen={infoDialogOpen}
        title={infoDialogTitle}
        message={infoDialogMessage}
        onClose={closeInfoDialog}
      />
    </div>
  );
};

export default ManageCoursesPage;