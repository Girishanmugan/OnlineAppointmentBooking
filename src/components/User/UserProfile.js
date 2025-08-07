// src/components/User/UserProfile.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../Layout/Layout';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        emergencyContact: user.emergencyContact || '',
        medicalHistory: user.medicalHistory || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.updateProfile(formData);
      // Update user in context (you'll need to add this method to AuthContext)
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const profileSections = [
    {
      title: 'Personal Information',
      icon: '👤',
      fields: [
        { key: 'name', label: 'Full Name', type: 'text' },
        { key: 'email', label: 'Email Address', type: 'email' },
        { key: 'phone', label: 'Phone Number', type: 'tel' },
        { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' }
      ]
    },
    {
      title: 'Contact Information',
      icon: '📍',
      fields: [
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'emergencyContact', label: 'Emergency Contact', type: 'text' }
      ]
    },
    {
      title: 'Medical Information',
      icon: '🏥',
      fields: [
        { key: 'medicalHistory', label: 'Medical History', type: 'textarea' }
      ]
    }
  ];

  return (
    <Layout>
      <div className="profile-page">
        {/* Profile Header */}
        <motion.div
          className="profile-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-avatar">
            <span>{user?.name?.charAt(0) || '👤'}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-role">Patient</span>
          </div>
          <div className="profile-actions">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  onClick={() => setEditing(false)}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          {profileSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="profile-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <div className="section-header">
                <span className="section-icon">{section.icon}</span>
                <h2 className="section-title">{section.title}</h2>
              </div>
              
              <div className="section-content">
                <div className="fields-grid">
                  {section.fields.map((field) => (
                    <div key={field.key} className="form-group">
                      <label htmlFor={field.key}>{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.key}
                          name={field.key}
                          value={formData[field.key]}
                          onChange={handleInputChange}
                          disabled={!editing}
                          rows={4}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      ) : (
                        <input
                          type={field.type}
                          id={field.key}
                          name={field.key}
                          value={formData[field.key]}
                          onChange={handleInputChange}
                          disabled={!editing}
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </form>

        {/* Account Settings */}
        <motion.div
          className="profile-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="section-header">
            <span className="section-icon">⚙️</span>
            <h2 className="section-title">Account Settings</h2>
          </div>
          
          <div className="section-content">
            <div className="settings-grid">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Change Password</h3>
                  <p>Update your account password</p>
                </div>
                <button className="btn btn-outline">Change Password</button>
              </div>
              
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Email Notifications</h3>
                  <p>Manage your notification preferences</p>
                </div>
                <button className="btn btn-outline">Manage</button>
              </div>
              
              <div className="setting-item danger">
                <div className="setting-info">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account and data</p>
                </div>
                <button className="btn btn-danger">Delete Account</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default UserProfile;
