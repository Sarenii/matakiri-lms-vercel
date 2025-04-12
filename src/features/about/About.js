// src/features/about/About.jsx

import React, { useEffect } from 'react';
import '../../styles/about.css';
import {
  FaBullseye,
  FaEye,
  FaUsers,
  FaCogs,
  FaComments,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn
} from 'react-icons/fa';

// Optional: Intersection Observer to trigger animations on scroll
// (If you'd like to animate sections only when scrolled into view,
// you'll need additional hooks or a small custom logic.
// For simplicity, this code just triggers animations on mount.)

const About = () => {
  useEffect(() => {
    // Simple fade-in approach on mount (without scroll-based detection)
    const sections = document.querySelectorAll('.about-section');
    sections.forEach((section, idx) => {
      section.style.animationDelay = `${idx * 0.15}s`;
      section.classList.add('fade-up');
    });
  }, []);

  return (
    <div className="about-page">
      <div className="about-container">

        {/* Mission Section */}
        <section className="about-section mission">
          <FaBullseye className="section-icon" />
          <h2>Our Mission</h2>
          <p>
            To democratize education by providing accessible,
            high-quality online learning experiences to individuals worldwide.
          </p>
        </section>

        {/* Vision Section */}
        <section className="about-section vision">
          <FaEye className="section-icon" />
          <h2>Our Vision</h2>
          <p>
            To become the leading global platform for personalized
            and interactive learning, empowering learners to achieve
            their full potential.
          </p>
        </section>

        {/* Our Team Section */}
        <section className="about-section team">
          <FaUsers className="section-icon" />
          <h2>Meet the Team</h2>
          <div className="team-members">
            <div className="team-member">
              <img
                src="https://via.placeholder.com/150"
                alt="Jane Doe"
                className="member-photo"
              />
              <h3>Jane Doe</h3>
              <p>CEO &amp; Founder</p>
            </div>
            <div className="team-member">
              <img
                src="https://via.placeholder.com/150"
                alt="John Smith"
                className="member-photo"
              />
              <h3>John Smith</h3>
              <p>Chief Technology Officer</p>
            </div>
            <div className="team-member">
              <img
                src="https://via.placeholder.com/150"
                alt="Alice Johnson"
                className="member-photo"
              />
              <h3>Alice Johnson</h3>
              <p>Head of Product</p>
            </div>
            {/* Add more team members as needed */}
          </div>
        </section>

        {/* Features Section */}
        <section className="about-section features">
          <FaCogs className="section-icon" />
          <h2>Our Features</h2>
          <div className="features-list">
            <div className="feature-item">
              <h3>Interactive Courses</h3>
              <p>
                Engage with interactive content and hands-on projects
                designed to enhance learning.
              </p>
            </div>
            <div className="feature-item">
              <h3>Expert Instructors</h3>
              <p>
                Learn from industry experts and experienced educators
                committed to your success.
              </p>
            </div>
            <div className="feature-item">
              <h3>Flexible Learning</h3>
              <p>
                Access courses anytime, anywhere, and learn at your own pace.
              </p>
            </div>
            <div className="feature-item">
              <h3>Certification</h3>
              <p>
                Earn certificates to showcase your achievements
                and boost your career prospects.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="about-section testimonials">
          <FaComments className="section-icon" />
          <h2>What Our Users Say</h2>
          <div className="testimonials-list">
            <div className="testimonial-item">
              <p>
                {/* Replaced " with &ldquo; and &rdquo; */}
                &ldquo;This platform has transformed my learning experience.
                The courses are comprehensive and engaging.&rdquo;
              </p>
              <h4>- Michael Brown</h4>
            </div>
            <div className="testimonial-item">
              <p>
                {/* Replaced " with &ldquo; and &rdquo; */}
                &ldquo;I was able to advance my career thanks to the certifications
                I earned here.&rdquo;
              </p>
              <h4>- Sarah Lee</h4>
            </div>
            <div className="testimonial-item">
              <p>
                {/* Replaced " with &ldquo; and &rdquo; */}
                &ldquo;The flexibility of learning at my own pace made it easier
                to balance studies with my job.&rdquo;
              </p>
              <h4>- David Kim</h4>
            </div>
            {/* Add more testimonials as needed */}
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="about-section contact">
          <FaEnvelope className="section-icon" />
          <h2>Contact Us</h2>
          <p>
            {/* Replaced ' in We'd with &rsquo; */}
            We&rsquo;d love to hear from you! Reach out to us with
            any questions, feedback, or support needs.
          </p>
          <div className="contact-details">
            <p>Email: <a href="mailto:info@lms.com">info@lms.com</a></p>
            <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
            <p>Address: 123 Learning St, Knowledge City, Education Land</p>
          </div>
          <div className="social-media">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
            {/* Add more social media links as needed */}
          </div>
        </section>

      </div>
    </div>
  );
}

export default About;