import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { enrollInCourse } from "../../services/enrollment";
import { getInProgressCourses } from "../../services/courses"; // returns { courses, next }
import "../../styles/course.css";

const InProgressCoursesPage = () => {
  const navigate = useNavigate();
  // For storing the list of in-progress courses
  const [courses, setCourses] = useState([]);
  // For the "Learn More" modal
  const [selectedCourse, setSelectedCourse] = useState(null);
  // For a small success/fail modal
  const [messageModal, setMessageModal] = useState({ visible: false, text: "" });
  // For local wishlist toggling (if you need it)
  const [wishlist, setWishlist] = useState(new Set());

  const closeMessageModal = () => setMessageModal({ visible: false, text: "" });

  useEffect(() => {
    const loadInProgress = async () => {
      try {
        // Since 'getInProgressCourses' returns { courses, next }, destructure:
        const { courses } = await getInProgressCourses();
        console.log("In-progress courses loaded:", courses);

        setCourses(courses);
      } catch (err) {
        console.error("Error fetching in-progress courses:", err);
        // fallback to empty
        setCourses([]);
      }
    };
    loadInProgress();
  }, []);

  // Enrollment
  const handleEnrollment = async (courseId) => {
    try {
      await enrollInCourse(courseId);

      // Mark locally as is_enrolled:
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...course, is_enrolled: true } : course
        )
      );

      setMessageModal({
        visible: true,
        text: "Enrolled successfully!",
      });
    } catch (err) {
      console.error("Enrollment error:", err);
      setMessageModal({
        visible: true,
        text: "Failed to enroll. Please try again.",
      });
    }
  };

  // Example local wishlist toggling
  const toggleWishlist = (courseId) => {
    setWishlist((prev) => {
      const copy = new Set(prev);
      if (copy.has(courseId)) {
        copy.delete(courseId);
        setMessageModal({ visible: true, text: "Course removed from wishlist." });
      } else {
        copy.add(courseId);
        setMessageModal({ visible: true, text: "Course added to wishlist!" });
      }
      return copy;
    });
  };

  const openModal = (course) => setSelectedCourse(course);
  const closeModal = () => setSelectedCourse(null);

  const handleCardClick = (courseId) => {
    navigate(`/courses/${courseId}/modules`);
  };

  // If no courses, show a message
  if (!courses || courses.length === 0) {
    return (
      <section className="course-sections">
        <div className="course-list">
          <p>No in-progress courses available.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="course-sections">
        {/* If there's a success/failure message modal */}
        {messageModal.visible && (
          <div className="custom-message-modal-overlay">
            <div className="custom-message-modal">
              <p>{messageModal.text}</p>
              <button className="ok-button" onClick={closeMessageModal}>
                OK
              </button>
            </div>
          </div>
        )}

        <div className="course-list">
          {courses.map((course) => {
            const isEnrolled = course.is_enrolled === true;
            const isWishlisted = wishlist.has(course.id);

            return (
              <div
                key={course.id}
                className="course-card"
                onClick={() => handleCardClick(course.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCardClick(course.id);
                  }
                }}
                aria-label={`View modules for ${course.title}`}
              >
                {/* Wishlist Icon */}
                <span
                  className="wishlist-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(course.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      toggleWishlist(course.id);
                    }
                  }}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  aria-label="Toggle wishlist"
                >
                  <FaHeart
                    style={{
                      color: isWishlisted ? "#3fa74a" : "#ccc",
                      fontSize: "1.2rem",
                    }}
                  />
                </span>

                {/* Card content */}
                <div className="course-card-content">
                  <div
                    className="course-cover-container"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(course);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        openModal(course);
                      }
                    }}
                    aria-label={`Learn more about ${course.title}`}
                  >
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
                  <div className="brief-description">
                    {course.description?.length > 100
                      ? course.description.substring(0, 100) + "..."
                      : course.description}
                  </div>
                </div>

                <div
                  className="card-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!isEnrolled ? (
                    <span
                      className="enroll-link"
                      onClick={() => handleEnrollment(course.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Enroll in ${course.title}`}
                    >
                      Enroll
                    </span>
                  ) : (
                    <span
                      className="enroll-link"
                      style={{ cursor: "default", backgroundColor: "#bbb" }}
                    >
                      Enrolled
                    </span>
                  )}

                  <span
                    className="learn-more-link"
                    onClick={() => openModal(course)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Learn more about ${course.title}`}
                  >
                    Learn More
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* "Learn More" Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <button
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Close Modal"
            >
              &times;
            </button>
            <img
              src={selectedCourse.cover_image || "https://via.placeholder.com/300"}
              alt={selectedCourse.title}
              className="modal-course-cover"
            />
            <h2 id="modal-title">{selectedCourse.title}</h2>
            <p>{selectedCourse.description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default InProgressCoursesPage;
