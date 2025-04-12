// src/pages/ProfilePage.js
import React, { useEffect, useState, useRef } from 'react';
import {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture
} from '../services/AdvancedUserProfileService'; // Adjust the path as needed
import '../styles/profilePage.css'; // Updated styling below

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);  // Holds the user profile data
  const [isEditing, setIsEditing] = useState(false); // Controls edit mode for text fields

  // Local state for the editable fields (first_name, last_name, email)
  const [editableProfile, setEditableProfile] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });

  // Hidden file input reference (for uploading a new profile picture)
  const fileInputRef = useRef(null);

  // On component mount, fetch the user's profile
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserProfile();
        setProfile(userData);
        setEditableProfile({
          first_name: userData?.first_name || '',
          last_name: userData?.last_name || '',
          email: userData?.email || ''
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchData();
  }, []);

  // Handle toggling edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle canceling edit mode
  const handleCancel = () => {
    // Restore fields to their original values
    if (profile) {
      setEditableProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email
      });
    }
    setIsEditing(false);
  };

  // Handle saving user data
  const handleSave = async () => {
    try {
      const updatedData = await updateUserProfile(editableProfile);
      // Update local component state
      setProfile((prev) => ({
        ...prev,
        ...updatedData
      }));
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Optionally, display an error message to the user
    }
  };

  // Handle text input changes (first_name, last_name, email)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Trigger file input when the camera icon is clicked
  const handlePhotoEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection for profile picture
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      // We’ll assume the backend expects a FormData for an actual file upload
      const formData = new FormData();
      formData.append('profile_picture', file);

      const updatedPicData = await updateProfilePicture(formData);
      // Update local state with new picture
      setProfile((prev) => ({
        ...prev,
        profile_picture: updatedPicData?.profile_picture
      }));
    } catch (error) {
      console.error("Error updating profile picture:", error);
      // Optionally, display an error message to the user
    }
  };

  if (!profile) {
    return <div className="profile-page">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <div className="profile-card">
        {/* PROFILE PICTURE (TOP CENTERED) */}
        <div className="image-container">
          <img
            src={profile.profile_picture || '/default-profile.png'}
            alt="Profile"
            className="profile-image"
          />
          <div className="camera-icon" onClick={handlePhotoEditClick} aria-label="Change Profile Picture" title="Change Profile Picture">
            {/* Inline SVG for Camera Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="camera-svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="20px"
              height="20px"
            >
              <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              <path d="M17.3 6.71a1 1 0 00-1.41 0L15 7.59V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3.59l-0.89-0.89a1 1 0 10-1.41 1.41l2.59 2.59a1 1 0 001.41 0l2.59-2.59a1 1 0 000-1.41z" />
            </svg>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* PROFILE INFO */}
        <div className="profile-info">
          {isEditing ? (
            <>
              <label htmlFor="first_name" className="edit-label">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                className="edit-input"
                value={editableProfile.first_name}
                onChange={handleChange}
              />

              <label htmlFor="last_name" className="edit-label">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                className="edit-input"
                value={editableProfile.last_name}
                onChange={handleChange}
              />

              <label htmlFor="email" className="edit-label">Email</label>
              <input
                id="email"
                name="email"
                type="text"
                className="edit-input"
                value={editableProfile.email}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <h2>
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="email">{profile.email}</p>
            </>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-button" onClick={handleEdit}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
          {/* Logout button removed */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
