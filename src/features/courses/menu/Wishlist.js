// src/components/Wishlist.jsx
import React, { useState, useEffect } from "react";
import {
  getWishlist,
  removeWishlistItem,
  // addWishlistItem, // Removed as handleAdd is removed
} from "../../../services/wishlist";
import "../../../styles/course.css"; // Reuse the same styling

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist items from the backend on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await getWishlist();
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Remove wishlist item
  const handleRemove = async (wishlistId) => {
    try {
      await removeWishlistItem(wishlistId);
      setWishlist((prev) => prev.filter((item) => item.id !== wishlistId));
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  /*
  // Removed the unused handleAdd function:
  // Example function to add a course to wishlist
  // (Usually you'd do this from a "courses" page, not from the wishlist page.)
  const handleAdd = async (courseId) => {
    try {
      const newItem = await addWishlistItem(courseId); // No longer used
      setWishlist((prev) => [...prev, newItem]);
    } catch (error) {
      console.error("Error adding wishlist item:", error);
    }
  };
  */

  const handleEnrollment = (courseId) => {
    // Call your enrollment logic here
    alert(`Enroll in course ID = ${courseId} (example only)`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Wishlist</h1>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="course-list">
          {wishlist.map((item) => {
            const course = item.course; // The nested course object
            return (
              <div
                key={item.id}
                className="course-card"
                onClick={() =>
                  (window.location.href = `/courses/${course.id}/modules`)
                }
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.location.href = `/courses/${course.id}/modules`;
                  }
                }}
                aria-label={`View modules for ${course.title}`}
              >
                <div className="course-card-content">
                  <div
                    className="course-cover-container"
                    onClick={(e) => e.stopPropagation()}
                    role="button"
                    tabIndex={0}
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
                      ? `${course.description.substring(0, 100)}...`
                      : course.description}
                  </div>
                </div>
                <div
                  className="card-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Example: "Enroll" or "View Modules" button */}
                  <span
                    className="enroll-link"
                    onClick={() => handleEnrollment(course.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Enroll in ${course.title}`}
                  >
                    Enroll
                  </span>
                  <span
                    className="remove-button"
                    onClick={() => handleRemove(item.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Remove ${course.title} from wishlist`}
                    style={{ marginLeft: "1rem" }}
                  >
                    Remove
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;