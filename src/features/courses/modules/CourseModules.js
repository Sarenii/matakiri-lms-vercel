import React from 'react';

const CourseModules = ({ modules, role }) => {
  return (
    <section>
      <h2>Modules</h2>
      {role === 'instructor' && <button>Add Module</button>}
      <ul>
        {modules.map(module => (
          <li key={module.id}>
            {module.title}
            {role === 'instructor' && <button>Edit</button>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CourseModules;
