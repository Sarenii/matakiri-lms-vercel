// src/pages/MyCourses.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/myCourses.css'; // Create and style as needed
import { getInstructorCourses } from '../services/courses';
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    const fetchMyCourses = async () => {
      const courses = await getInstructorCourses();
      setMyCourses(courses);
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="my-courses-page">
      <h2>My Courses</h2>
      {myCourses.length === 0 ? (
        <p>You have not created any courses yet.</p>
      ) : (
        <ul className="my-courses-list">
          {myCourses.map((course) => (
            <li key={course.id} className="my-course-item">
              <Link to={`/courses/${course.id}/manage`} className="my-course-link">
                {course.title}
              </Link>
              <span className="course-status">{course.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCourses;
