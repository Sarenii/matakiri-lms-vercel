import React from "react";
import "./../styles/footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer">
            {/* Newsletter Section */}
            <div className="footer__newsletter">
                <h3>Subscribe to Our Newsletter</h3>
                <p>Get the latest updates on courses, offers, and more.</p>
                <form className="newsletter__form">
                    <input
                        type="email"
                        placeholder="Your Email Address"
                        aria-label="Email address"
                    />
                    <button type="submit">Subscribe</button>
                </form>
            </div>

            {/* Main Footer Section */}
            <div className="footer__main">
                {/* Logo and About Section */}
                <div className="footer__logo">
                    <h2>SomaNet</h2>
                    <p>Learn smarter, achieve better. Empowering education with advanced technology.</p>
                    <div className="footer__social-icons">
                        <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF />
                        </a>
                        <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </a>
                        <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </a>
                        <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer__links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/courses">Courses</a></li>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="footer__contact">
                    <h3>Contact Us</h3>
                    <p>Email: support@somanet.com</p>
                    <p>Phone: +254 700 000 000</p>
                    <p>Address: Nairobi, Kenya</p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer__bottom">
                <p>&copy; {new Date().getFullYear()} SomaNet. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
