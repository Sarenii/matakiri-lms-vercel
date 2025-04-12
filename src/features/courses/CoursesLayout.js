// src/pages/CoursesLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import Menu from '../courses/menu/Menu'; // The menu/hamburger component
import '../../styles/course.css'; // Ensure this file contains the necessary CSS

const CoursesLayout = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'STUDENT';
  const navigate = useNavigate();
  const location = useLocation();

  // Define sections based on role
  let sections = ['All Courses'];
  if (userRole === 'STUDENT') {
    sections = ['All Courses', 'In Progress', 'Completed'];
  } else if (userRole === 'INSTRUCTOR') {
    sections = ['All Courses', 'My Courses', 'Create New Course'];
  } else if (userRole === 'ADMIN') {
    sections = ['All Courses', 'Manage Courses', 'Manage Users'];
  }

  const [selectedSection, setSelectedSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Whenever the route changes, figure out which section (if any) should be active
  useEffect(() => {
    // A helper function that returns the matching section
    const getSectionFromPath = (path) => {
      if (path === '/courses') {
        return 'All Courses';
      } else if (path.startsWith('/courses/in-progress')) {
        return 'In Progress';
      } else if (path.startsWith('/courses/completed')) {
        return 'Completed';
      } else if (path.startsWith('/courses/my-courses')) {
        return 'My Courses';
      } else if (path.startsWith('/courses/create')) {
        return 'Create New Course';
      } else if (path.startsWith('/courses/manage-users')) {
        return 'Manage Users';
      } else if (path.startsWith('/courses/manage')) {
        return 'Manage Courses';
      } else {
        // For routes like /courses/admin/dashboard, /courses/student/analytics, etc.
        // we do NOT highlight any header button
        return null;
      }
    };

    const sectionName = getSectionFromPath(location.pathname);
    setSelectedSection(sectionName);
  }, [location]);

  // When a user clicks one of the header buttons, we navigate and let the effect above update the highlight
  const handleSectionClick = (section) => {
    switch (section) {
      case 'All Courses':
        navigate('/courses');
        break;
      case 'In Progress':
        navigate('/courses/in-progress');
        break;
      case 'Completed':
        navigate('/courses/completed');
        break;
      case 'My Courses':
        navigate('/courses/my-courses');
        break;
      case 'Create New Course':
        navigate('/courses/create');
        break;
      case 'Manage Courses':
        navigate('/courses/manage');
        break;
      case 'Manage Users':
        navigate('/courses/manage-users');
        break;
      default:
        navigate('/courses');
        break;
    }
  };

  return (
    <div className="courses-layout">
      <div className="courses-main">
        <div className="courses-topbar">
          {/* Sections Navigation */}
          <div className="courses-sections-nav">
            {sections.map((section) => (
              <button
                key={section}
                className={section === selectedSection ? 'active' : ''}
                onClick={() => handleSectionClick(section)}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Search Container */}
          <div className="search-container">
            <div className="search-wrapper">
              <span className="search-icon">&#128269;</span>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right Side: Menu and User Info */}
          <div className="topbar-right">
            <Menu />

            {user && (
              <div className="user-info" onClick={() => navigate('/profile')}>
                {user.profile_picture && (
                  <img
                    src={user.profile_picture}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                )}
                <div>
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                  <p>{userRole}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Provide searchQuery and selectedSection to child routes via context */}
        <Outlet context={{ searchQuery, selectedSection }} />
      </div>
    </div>
  );
};

export default CoursesLayout;
