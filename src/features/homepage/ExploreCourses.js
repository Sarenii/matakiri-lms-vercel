// src/pages/ExploreCourses.jsx
import React, { useState, useEffect } from "react";
import { getCourses } from "../../services/courses";
import { enrollInCourse } from "../../services/enrollment"; // For the Enroll functionality
import "../../styles/exploreCourses.css"; // Ensure you import the CSS

function ExploreCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourses, setExpandedCourses] = useState([]);
  const [courses, setCourses] = useState([]);

  // Fetch courses on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Your service returns { courses, next }, not just an array
        const response = await getCourses();
        // Extract the array from `response.courses`
        if (Array.isArray(response.courses)) {
          setCourses(response.courses);
        } else {
          console.error("Unexpected response format:", response);
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setCourses([]);
      }
    };
    loadCourses();
  }, []);

  // Filter courses by search query
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle full description
  const toggleDescription = (courseId) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  // Handle enroll
  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId);
      alert("Enrolled successfully!");
    } catch (err) {
      alert("Failed to enroll.");
      console.error(err);
    }
  };

  return (
    <section className="explore-courses">
      <h2>Explore Our Courses</h2>

      {/* Search Input */}
      <div className="explore-courses__search">
        <div className="search-wrapper">
          <span className="search-icon">&#128269;</span>
          <input
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Courses List */}
      <div
        className="explore-courses__list"
        style={{
          // 1 column if exactly 1 result, otherwise a responsive auto-fit grid
          gridTemplateColumns:
            filteredCourses.length === 1
              ? "1fr"
              : "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isExpanded = expandedCourses.includes(course.id);
            return (
              <div
                key={course.id}
                className={`course-card ${isExpanded ? "show-description" : ""}`}
              >
                {/* Course Cover */}
                {course.cover_image ? (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="course-cover"
                  />
                ) : (
                  <div className="course-cover" />
                )}

                <div className="course-card-content">
                  <h3>{course.title}</h3>

                  {/* Brief description always shown (truncated via CSS) */}
                  <div className="brief-description">{course.description}</div>

                  {/* Full description (only shown if expanded) */}
                  {isExpanded && (
                    <div className="full-description">
                      <p>{course.description}</p>
                    </div>
                  )}

                  <div className="card-actions">
                    {/* Enroll Button (green) */}
                    <button
                      className="enroll-btn"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll
                    </button>

                    {/* Learn More as an underlined green link */}
                    <a
                      href="#"
                      className="learn-more-link"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent jump to top
                        toggleDescription(course.id);
                      }}
                    >
                      {isExpanded ? "Hide" : "Learn More"}
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="explore-courses__empty">No courses found.</p>
        )}
      </div>
    </section>
  );
}

export default ExploreCourses;
