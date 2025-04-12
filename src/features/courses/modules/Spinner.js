// src/features/courses/modules/Spinner.jsx
import React from 'react';
import { ClipLoader } from 'react-spinners';
import '../../../styles/Spinner.css'; // Import CSS for styling

const Spinner = () => {
  return (
    <div className="spinner-container" role="status" aria-label="Loading">
      <ClipLoader size={50} color="#123abc" loading={true} />
    </div>
  );
};

export default Spinner;
