// src/components/ProgressBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../../../styles/module.css'; // Create this CSS file

const ProgressBar = ({ progress }) => (
  <div className="progress-bar" aria-label={`Progress: ${progress}%`}>
    <div 
      className={`progress-fill ${progress === 100 ? 'completed' : ''}`} 
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
};

export default ProgressBar;
