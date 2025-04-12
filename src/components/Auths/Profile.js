import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../../services/auth'; // Import functions from auth.js
import defaultProfilePicture from '../../assets/Images/default.jpeg'; // Fallback profile picture
import '../../styles/Profile.css'; // Import the CSS file

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
        setFormData(data);
      } catch (error) {
        setErrorMessage('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      profile_picture: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedProfile = await updateUserProfile(formData);
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">My Profile</h1>

      {errorMessage && <div className="message message-error">{errorMessage}</div>}
      {successMessage && <div className="message message-success">{successMessage}</div>}

      <div className="profile-info">
        <img
          src={profile?.profile_picture || defaultProfilePicture}
          alt="Profile"
          className="profile-picture"
        />
        {!isEditing && (
          <div>
            <h2>
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p>{profile?.email}</p>
          </div>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div>
            <label>Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Profile Picture</label>
            <input type="file" name="profile_picture" onChange={handleFileChange} />
          </div>

          <div className="profile-buttons">
            <button type="submit" className="profile-button profile-button-primary">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="profile-button profile-button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p>
            <strong>Bio:</strong> {profile?.bio || 'Not provided'}
          </p>
          <p>
            <strong>Phone:</strong> {profile?.phone_number || 'Not provided'}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="profile-button profile-button-primary"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
