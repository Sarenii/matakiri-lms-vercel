import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./../styles/header.css";

function Header() {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="container">
                {/* Logo */}
                <div className="header__logo">
                    <img 
                        src="assets/images/logo.png" 
                        alt="SomaNet Logo" 
                        className="header__logo-img" 
                    />
                    <span className="header__logo-text">SomaNet</span>
                </div>

                {/* Navigation */}
                <nav className="header__nav">
                    <ul className="header__nav-links">
                        <li>
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/about" 
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/courses" 
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                Courses
                            </NavLink>
                        </li>
                        <li>
                            <NavLink 
                                to="/contact" 
                                className={({ isActive }) => (isActive ? "active" : "")}
                            >
                                Contact
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* CTA Button / Logout */}
                <div className="header__cta">
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="btn btn-logout">
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Get Started
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
