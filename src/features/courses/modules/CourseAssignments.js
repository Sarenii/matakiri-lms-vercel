import React from 'react';

const CourseAssignments = ({ assignments, role }) => {
  return (
    <section>
      <h2>Assignments</h2>
      {role === 'instructor' && <button>Add Assignment</button>}
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>
            {assignment.title}
            {role === 'student' && <button>Submit</button>}
            {role === 'instructor' && <button>Edit</button>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CourseAssignments;
