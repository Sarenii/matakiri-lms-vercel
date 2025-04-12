// src/pages/CoursesPage.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { enrollInCourse } from "../services/enrollment";
import {
  getCourses,
  getMyCourses,
  getInProgressCourses,
  getCompletedCourses,
} from "../services/courses";
import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
} from "../services/wishlist";
import { FaHeart } from "react-icons/fa";
import "../styles/course.css";

const CoursesPage = () => {
  const { searchQuery, selectedSection } = useOutletContext() || {};
  const [courses, setCourses] = useState([]);
  const [nextUrl, setNextUrl] = useState(null); // track pagination next page
  const [loading, setLoading] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [messageModal, setMessageModal] = useState({ visible: false, text: "" });
  // const [enrolledIds, setEnrolledIds] = useState(new Set()); // Removed unused state
  const [wishlistMap, setWishlistMap] = useState({});

  const navigate = useNavigate();
  const closeMessageModal = () => setMessageModal({ visible: false, text: "" });

  // Decide which fetch function to call
  const fetchCoursesBySection = async (section, pageUrl = null) => {
    // If pageUrl is provided, we fetch that instead of the default endpoint
    // Because we have to handle the "next" URL for pagination
    switch (section) {
      case "My Courses":
        return getMyCourses(pageUrl);
      case "In Progress":
        return getInProgressCourses(pageUrl);
      case "Completed":
        return getCompletedCourses(pageUrl);
      default:
        return getCourses(pageUrl);
    }
  };

  // Helper: load the first page of courses
  const loadInitialCourses = async () => {
    setLoading(true);
    try {
      const response = await fetchCoursesBySection(selectedSection, null);
      setCourses(response.courses);
      setNextUrl(response.next); // store the next page url

      /* Removed logic for unused enrolledIds state
      // Build local set from is_enrolled
      const enrollSet = new Set(
        response.courses
          .filter((course) => course.is_enrolled === true)
          .map((c) => c.id)
      );
      setEnrolledIds(enrollSet);
      */

      // Now fetch the wishlist
      const wishlistItems = await getWishlist();
      const wmap = {};
      wishlistItems.forEach((item) => {
        wmap[item.course.id] = item.id;
      });
      setWishlistMap(wmap);
    } catch (err) {
      console.error("Error loading initial courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper: load the next page
  const loadMoreCourses = async () => {
    if (!nextUrl) return; // no more pages
    setLoading(true);
    try {
      const response = await fetchCoursesBySection(selectedSection, nextUrl);
      // Merge new results
      setCourses((prev) => [...prev, ...response.courses]);
      setNextUrl(response.next);

      /* Removed logic for unused enrolledIds state
      // For enrollment set
      const newlyEnrolled = new Set(
        response.courses
          .filter((course) => course.is_enrolled)
          .map((c) => c.id)
      );
      setEnrolledIds((prev) => new Set([...prev, ...newlyEnrolled]));
      */
    } catch (err) {
      console.error("Error loading more courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect that fires on selectedSection change
  useEffect(() => {
    loadInitialCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection]); // Assuming loadInitialCourses doesn't need dependencies listed if defined inside

  // Filter by search
  let displayedCourses = [...courses];
  if (searchQuery?.trim()) {
    displayedCourses = displayedCourses.filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const handleEnrollment = async (courseId) => {
    try {
      await enrollInCourse(courseId);

      // setEnrolledIds((prev) => new Set([...prev, courseId])); // Removed logic for unused enrolledIds state

      // Update the is_enrolled status directly on the course object in state
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId
            ? { ...course, is_enrolled: true }
            : course
        )
      );

      setMessageModal({
        visible: true,
        text: "Course has been enrolled successfully. Enjoy your journey! \u{1F60A}",
      });
    } catch (error) {
      console.error("Enrollment failed:", error);
      setMessageModal({
        visible: true,
        text: "Failed to enroll. Please try again.",
      });
    }
  };

  const toggleWishlist = async (courseId) => {
    const wishlistItemId = wishlistMap[courseId];
    if (wishlistItemId) {
      // Remove
      try {
        await removeWishlistItem(wishlistItemId);
        setWishlistMap((prev) => {
          const copy = { ...prev };
          delete copy[courseId];
          return copy;
        });
        setMessageModal({
          visible: true,
          text: "Course removed from wishlist.",
        });
      } catch (err) {
        console.error("Remove wishlist error:", err);
        setMessageModal({
          visible: true,
          text: "Failed to remove from wishlist. Please try again.",
        });
      }
    } else {
      // Add
      try {
        const newItem = await addWishlistItem(courseId);
        setWishlistMap((prev) => ({
          ...prev,
          [newItem.course.id]: newItem.id,
        }));
        setMessageModal({
          visible: true,
          text: "Course added to wishlist successfully!",
        });
      } catch (err) {
        console.error("Add wishlist error:", err);
        setMessageModal({
          visible: true,
          text: "Failed to add to wishlist. Please try again.",
        });
      }
    }
  };

  const handleCardClick = (courseId) => {
    navigate(`/courses/${courseId}/modules`);
  };

  const openModal = (course) => setSelectedCourse(course);
  const closeModal = () => setSelectedCourse(null);

  return (
    <>
      <section className="course-sections">
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
          {displayedCourses.length === 0 ? (
            <p>No courses available</p>
          ) : (
            displayedCourses.map((course) => {
              // Rely on the is_enrolled flag from the course object
              const isEnrolled = course.is_enrolled === true;
              const isWishlisted = !!wishlistMap[course.id];

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
                    title={
                      isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                    }
                    aria-label="Toggle wishlist"
                  >
                    <FaHeart
                      style={{
                        color: isWishlisted ? "#3fa74a" : "#ccc",
                        fontSize: "1.2rem",
                      }}
                    />
                  </span>
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
                        <div className="course-cover placeholder">
                          No Image
                        </div>
                      )}
                    </div>
                    <h3>{course.title}</h3>
                    <div className="brief-description">
                      {course.description && course.description.length > 100
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
            })
          )}
        </div>

        {/* If there's more pages, show a "Load More" button */}
        {nextUrl && (
          <div style={{ textAlign: "center", margin: "1rem" }}>
            <button onClick={loadMoreCourses} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
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

export default CoursesPage;