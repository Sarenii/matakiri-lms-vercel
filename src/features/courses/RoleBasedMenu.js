import React from 'react';
import { Link } from 'react-router-dom';

const RoleBasedMenu = ({ role }) => {
  return (
    <nav>
      <ul className="role-menu" style={{display:'flex', gap:'1rem'}}>
        {/* Common menu items */}
        <li><Link to="/courses">All Courses</Link></li>

        {role === 'STUDENT' && (
          <>
            <li><Link to="/courses/in-progress">In Progress</Link></li>
            <li><Link to="/courses/completed">Completed</Link></li>
          </>
        )}

        {role === 'INSTRUCTOR' && (
          <>
            <li><Link to="/courses/my-courses">My Courses</Link></li>
            <li><Link to="/courses/create">Create New Course</Link></li>
          </>
        )}

        {role === 'ADMIN' && (
          <>
            <li><Link to="/courses/manage">Manage Courses</Link></li>
            <li><Link to="/users/manage">Manage Users</Link></li>
          </>
        )}

        {/* Dropdown example (optional) */}
        <li className="dropdown" style={{position:'relative'}}>
          <span>More</span>
          <ul className="dropdown-menu" style={{position:'absolute', top:'20px', left:'0', background:'#fff', padding:'10px', border:'1px solid #ccc'}}>
            {role === 'admin' && <li><Link to="/settings">Admin Settings</Link></li>}
            {/* Add more conditional items here if needed */}
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default RoleBasedMenu;
