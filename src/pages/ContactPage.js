import React, { useState } from 'react';
import '../styles/contactPage.css'; // Make sure this path is correct

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate sending the data to a server or API endpoint
    console.log('Form data submitted:', formData);
    setFormStatus('Thank you for contacting us. We will get back to you shortly.');

    // Reset form fields
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you! Fill out the form below to get in touch.</p>
      </div>

      <div className="contact-info">
        <div className="contact-item">
          <i className="fas fa-map-marker-alt" />
          <p>123 LMS Avenue, Nairobi, Kenya</p>
        </div>
        <div className="contact-item">
          <i className="fas fa-phone" />
          <p>+254 700 000 000</p>
        </div>
        <div className="contact-item">
          <i className="fas fa-envelope" />
          <p>support@lms.com</p>
        </div>
      </div>

      <div className="contact-form-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@domain.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Your message here..."
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-button">
            Send Message
          </button>

          {formStatus && <p className="form-status">{formStatus}</p>}
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
