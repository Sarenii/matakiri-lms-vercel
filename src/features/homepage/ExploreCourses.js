// src/pages/ExploreCourses.jsx
import React, { useState, useEffect } from "react";
import { getCourses } from "../../services/courses";
import { enrollInCourse } from "../../services/enrollment"; // Optionally add enrollment
import "../../styles/exploreCourses.css";
import "../../styles/coursesCard.css";

function ExploreCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourses, setExpandedCourses] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses();
        if (Array.isArray(response)) {
          setCourses(response);
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

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDescription = (courseId) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

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
      <div
        className="explore-courses__list"
        style={{
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
                {course.cover_image ? (
                  <img
                    src={course.cover_image}
                    alt={course.title}
                    className="course-cover"
                  />
                ) : (
                  <div className="course-cover"></div>
                )}
                <div className="course-card-content">
                  <h3>{course.title}</h3>
                  <div className="brief-description">{course.description}</div>
                  {isExpanded && (
                    <div className="full-description">
                      <p>{course.description}</p>
                    </div>
                  )}
                  <div className="card-actions">
                    <button
                      className="enroll-btn"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll
                    </button>
                    <button
                      className="learn-more-btn"
                      onClick={() => toggleDescription(course.id)}
                    >
                      {isExpanded ? "Hide" : "Learn More"}
                    </button>
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
