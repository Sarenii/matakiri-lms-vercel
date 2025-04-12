import React from 'react';

const CourseQuizzes = ({ quizzes, role }) => {
  return (
    <section>
      <h2>Quizzes</h2>
      {role === 'instructor' && <button>Add Quiz</button>}
      <ul>
        {quizzes.map(quiz => (
          <li key={quiz.id}>
            {quiz.title}
            {role === 'student' && <button>Attempt Quiz</button>}
            {role === 'instructor' && <button>Edit</button>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CourseQuizzes;
