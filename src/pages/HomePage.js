import React from "react";
import HeroSection from "../components/HeroSection";
import ExploreCourses from "../features/homepage/ExploreCourses";
import { useAuth } from '../Context/AuthContext'; // Ensure the path is correct

function HomePage() {
    const { isAuthenticated } = useAuth(); // Use the authentication status

    return (
        <div>
            {/* Hero Section */}
            <HeroSection/>

            {/* Explore Courses Section - Always shown, but could adapt based on auth status */}
            <ExploreCourses isAuthenticated={isAuthenticated} />
            
        </div>
    );
}

export default HomePage;
