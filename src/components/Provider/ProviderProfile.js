// src/components/Provider/ProviderProfile.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../Layout/Layout';
import LoadingSpinner from '../Common/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ProviderProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    experience: '',
    bio: '',
    education: '',
    certifications: '',
    languages: '',
    consultationFee: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        specialty: user.specialty || '',
        experience: user.experience || '',
        bio: user.bio || '',
        education: user.education || '',
        certifications: user.certifications || '',
        languages: user.languages || '',
        consultationFee: user.consultationFee || ''
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
      await authService.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="profile-page provider-profile">
        {/* Profile Header */}
        <motion.div
          className="profile-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="profile-avatar">
            <span>{user?.name?.charAt(0) || '👨‍⚕️'}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">Dr. {user?.name}</h1>
            <p className="profile-specialty">{user?.specialty}</p>
            <span className="profile-role">Healthcare Provider</span>
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
          <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="section-header">
              <span className="section-icon">👤</span>
              <h2 className="section-title">Personal Information</h2>
            </div>
            
            <div className="section-content">
              <div className="fields-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="section-header">
              <span className="section-icon">🏥</span>
              <h2 className="section-title">Professional Information</h2>
            </div>
            
            <div className="section-content">
              <div className="fields-grid">
                <div className="form-group">
                  <label htmlFor="specialty">Specialty</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="e.g., Cardiologist, Dermatologist"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Years of practice"
                    min="0"
                    max="50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="consultationFee">Consultation Fee</label>
                  <input
                    type="number"
                    id="consultationFee"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="Fee per consultation"
                    min="0"
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="bio">Professional Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={4}
                    placeholder="Brief description of your practice and expertise..."
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="profile-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="section-header">
              <span className="section-icon">🎓</span>
              <h2 className="section-title">Education & Certifications</h2>
            </div>
            
            <div className="section-content">
              <div className="fields-grid">
                <div className="form-group full-width">
                  <label htmlFor="education">Education</label>
                  <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={3}
                    placeholder="Medical school, residency, fellowships..."
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="certifications">Certifications</label>
                  <textarea
                    id="certifications"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows={3}
                    placeholder="Board certifications, licenses..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="languages">Languages</label>
                  <input
                    type="text"
                    id="languages"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="e.g., English, Spanish, French"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </Layout>
  );
};

export default ProviderProfile;
