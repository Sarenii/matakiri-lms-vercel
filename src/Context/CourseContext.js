import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types'; // <-- 1. Import PropTypes
import { getCourses as fetchCourses } from "../services/courses"; // Renamed to avoid shadowing

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => { // <-- Component using 'children' (around Line 8)
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses on load
  useEffect(() => {
    const loadCourses = async () => { // Renamed function to avoid shadowing
      try {
        const courseData = await fetchCourses(); // Use the renamed function
        // Ensure courseData is an array or handle appropriately
        setCourses(Array.isArray(courseData) ? courseData : []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []); // Empty dependency array ensures this runs only once

  const value = {
    courses,
    loading,
    setCourses, // Exposing setCourses might be useful, but consider providing specific update functions instead if needed
  };

  return (
    <CourseContext.Provider value={value}>
      {/* Show loading indicator while fetching, then render children */}
      {loading ? <div>Loading courses...</div> : children}
    </CourseContext.Provider>
  );
};

// --- 2. Add propTypes validation ---
CourseProvider.propTypes = {
  // Validate that 'children' is a prop, it can be any renderable node,
  // and it is required for this component to function correctly.
  children: PropTypes.node.isRequired
};
// --- End propTypes validation ---

// No default export assumed