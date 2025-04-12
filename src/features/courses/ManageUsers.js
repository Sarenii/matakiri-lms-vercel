// src/pages/ManageUsersPage.jsx
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types'; // Step 1: Import PropTypes
import { getUsers, updateUser, deleteUser } from "../../services/users";
import "../../styles/manageAdmin.css";

/* Reuse dialog components */

// Confirm Dialog Component
const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button className="dialog-btn confirm" onClick={onConfirm}>Yes</button>
          <button className="dialog-btn cancel" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

// Step 2: Add propTypes validation for ConfirmDialog
ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};


// Info Dialog Component
const InfoDialog = ({ isOpen, title, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-box info-box">
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-buttons">
          <button className="dialog-btn info" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

// Step 3: Add propTypes validation for InfoDialog
InfoDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};


// Main Manage Users Page Component
const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editUserId, setEditUserId] = useState(null);
  const [editedRole, setEditedRole] = useState("");
  const [updateError, setUpdateError] = useState("");

  // For deletion confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmDialogMessage, setConfirmDialogMessage] = useState("");

  // For info dialog
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [infoDialogTitle, setInfoDialogTitle] = useState("");
  const [infoDialogMessage, setInfoDialogMessage] = useState("");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleEditClick = (userId, currentRole) => {
    setEditUserId(userId);
    setEditedRole(currentRole);
    setUpdateError("");
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
    setEditedRole("");
    setUpdateError("");
  };

  const handleSaveRole = async (userId) => {
    try {
      await updateUser(userId, { role: editedRole });
      const updated = users.map(u =>
        u.id === userId ? { ...u, role: editedRole } : u
      );
      setUsers(updated);
      setInfoDialogTitle("Success");
      setInfoDialogMessage("User role updated successfully!");
      setInfoDialogOpen(true);
      setEditUserId(null);
      setEditedRole("");
    } catch (err) {
      console.error("Failed to update user:", err);
      setUpdateError("Failed to update user role. Check console for details.");
    }
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setConfirmDialogMessage("Are you sure you want to delete this user?");
    setConfirmDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      setUsers(users.filter(u => u.id !== userToDelete));
      setInfoDialogTitle("User Deleted");
      setInfoDialogMessage("The user was deleted successfully.");
      setInfoDialogOpen(true);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user. Check console for details.");
    } finally {
      setConfirmDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  const closeInfoDialog = () => {
    setInfoDialogOpen(false);
    setInfoDialogTitle("");
    setInfoDialogMessage("");
  };

  return (
    <div className="manage-users-page">
      <h1>Manage Users</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const isEditing = user.id === editUserId;
              return (
                <tr key={user.id}>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.email}</td>
                  <td>
                    {isEditing ? (
                      <select
                        value={editedRole}
                        onChange={e => setEditedRole(e.target.value)}
                        className="role-select"
                      >
                        <option value="STUDENT">Student</option>
                        <option value="INSTRUCTOR">Instructor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="actions-cell">
                    {isEditing ? (
                      <>
                        <button className="edit-btn" onClick={() => handleSaveRole(user.id)}>Save</button>
                        <button className="delete-btn" onClick={handleCancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => handleEditClick(user.id, user.role)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteClick(user.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {updateError && <p className="error-msg">{updateError}</p>}
      <ConfirmDialog
        isOpen={confirmDialogOpen}
        message={confirmDialogMessage}
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
      />
      <InfoDialog
        isOpen={infoDialogOpen}
        title={infoDialogTitle}
        message={infoDialogMessage}
        onClose={closeInfoDialog}
      />
    </div>
  );
};

export default ManageUsersPage;