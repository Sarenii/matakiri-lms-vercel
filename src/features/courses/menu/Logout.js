// src/pages/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout(); // Assuming logout is an async function
      navigate('/login'); // Redirect to login page after logout
    };
    performLogout();
  }, [logout, navigate]);

  return (
    <div className="logout-page">
      <h2>Logging out...</h2>
    </div>
  );
};

export default Logout;
