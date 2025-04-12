// src/pages/CourseDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { getCourseById } from "../services/courses";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const userRole = user?.role || "student";
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
      } catch (err) {
        console.error("Error fetching course:", err);
        if (err.response?.status === 403) {
          setError("You are not enrolled in this course.");
        } else {
          setError("Failed to fetch course data.");
        }
      }
    };
    fetchCourse();
  }, [courseId]);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <h2>Modules</h2>
      <ul>
        {course.modules.map((m) => (
          <li key={m.id}>
            {m.title}
            {userRole === "instructor" && (
              <button style={{ marginLeft: "10px" }}>Edit Module</button>
            )}
          </li>
        ))}
      </ul>

      <h2>Assignments</h2>
      <ul>
        {course.assignments.map((a) => (
          <li key={a.id}>
            {a.title}
            {userRole === "student" && (
              <button style={{ marginLeft: "10px" }}>Submit</button>
            )}
            {userRole === "instructor" && (
              <button style={{ marginLeft: "10px" }}>Edit Assignment</button>
            )}
          </li>
        ))}
      </ul>

      <h2>Quizzes</h2>
      <ul>
        {course.quizzes.map((q) => (
          <li key={q.id}>
            {q.title}
            {userRole === "student" && (
              <button style={{ marginLeft: "10px" }}>Attempt Quiz</button>
            )}
            {userRole === "instructor" && (
              <button style={{ marginLeft: "10px" }}>Edit Quiz</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetailPage;
