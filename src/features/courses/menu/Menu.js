// src/components/Menu.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/menu.css'; // or adjust your relative path
import { useAuth } from '../../../Context/AuthContext';
import {
  FaCog,
  FaBell,
  FaChartBar,
  // FaSignOutAlt, <-- Removed this unused import
  FaUserGraduate,
  FaHeart,
  FaBook,
  FaQuestionCircle,
  FaCompass,
  FaDoorOpen,
  FaPlusCircle,
  FaBars
} from 'react-icons/fa';

function Menu() {
  const { user, unreadNotifications, logout } = useAuth();
  const userRole = user?.role || 'STUDENT';
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
  const menuRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Define menu items based on role
  const getMenuItems = () => {
    // Common menu items: now prefix with /courses to match your new route structure
    const commonItems = [
      { name: 'Settings', path: '/courses/settings', icon: <FaCog /> },
      {
        name: 'Notifications',
        path: '/courses/notifications',
        icon: <FaBell />,
        badge: unreadNotifications
      },
      { name: 'Navigation Assistant', path: '/courses/assistant', icon: <FaCompass /> },
      { name: 'Help Center', path: '/courses/help', icon: <FaQuestionCircle /> },
      // Logout remains top-level /logout, or define your own path
      { name: 'Logout', path: '/logout', icon: <FaDoorOpen /> }, // Using FaDoorOpen here
    ];

    let roleSpecificItems = [];

    switch (userRole) {
      case 'ADMIN':
        roleSpecificItems = [
          // Admin analytics now at /courses/admin/dashboard
          { name: 'Analytics', path: '/courses/admin/dashboard', icon: <FaChartBar /> },
          { name: 'Manage Courses', path: '/courses/manage', icon: <FaBook /> },
          { name: 'Manage Users', path: '/courses/manage-users', icon: <FaUserGraduate /> },
        ];
        break;

      case 'INSTRUCTOR':
        roleSpecificItems = [
          { name: 'My Courses', path: '/courses/my-courses', icon: <FaBook /> },
          { name: 'Create New Course', path: '/courses/create', icon: <FaPlusCircle /> },
          { name: 'Analytics', path: '/courses/instructor/analytics', icon: <FaChartBar /> },
        ];
        break;

      case 'STUDENT':
      default:
        roleSpecificItems = [
          { name: 'InProgress Courses', path: '/courses/in-progress', icon: <FaBook /> },
          { name: 'Wishlist', path: '/courses/wishlist', icon: <FaHeart /> },
          { name: 'Analytics', path: '/courses/student/analytics', icon: <FaChartBar /> },
        ];
        break;
    }

    return [...roleSpecificItems, ...commonItems];
  };

  const menuItems = getMenuItems();

  const handleMenuItemClick = (path) => {
    setIsOpen(false);

    // If path is "/logout", trigger the logout flow
    if (path === '/logout') {
      setShowLogoutDialog(true);
    } else {
      navigate(path);
    }
  };

  const confirmLogout = () => {
    if (logout) {
      logout();
    }
    setShowLogoutSuccess(true);
    setShowLogoutDialog(false);
    setTimeout(() => {
      setShowLogoutSuccess(false);
      navigate('/login');
    }, 1500);
  };

  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  return (
    <div className="menu-container" ref={menuRef}>
      <div
        className="menu-icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
        title="Menu"
      >
        <FaBars size={24} color="#071527" />
      </div>
      {isOpen && (
        <div className="menu-dropdown">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="menu-item"
              onClick={() => handleMenuItemClick(item.path)}
            >
              <span className="menu-icon-text">{item.icon}</span>
              <span className="menu-item-text">
                {item.name}
                {item.badge > 0 && (
                  <span className="notification-badge">{item.badge}</span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {showLogoutDialog && (
        <div className="logout-dialog-overlay">
          <div className="logout-dialog">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to logout?</p>
            <div className="dialog-buttons">
              <button onClick={confirmLogout} className="confirm-button">
                Yes
              </button>
              <button onClick={cancelLogout} className="cancel-button">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutSuccess && (
        <div className="logout-success-overlay">
          <p>Logout successful!</p>
        </div>
      )}
    </div>
  );
}

export default Menu;