import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { providerService } from '../../services/providerService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const ProviderProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    specialty: '',
    experience: '',
    description: '',
    availability: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '13:00', available: false },
      sunday: { start: '09:00', end: '13:00', available: false }
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize form with user data if available
    if (user?.provider) {
      setFormData({
        specialty: user.provider.specialty || '',
        experience: user.provider.experience || '',
        description: user.provider.description || '',
        availability: user.provider.availability || formData.availability
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        [day]: {
          ...formData.availability[day],
          [field]: value
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await providerService.updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="page-header">
          <h1>Provider Profile</h1>
          <p>Manage your professional information and availability</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Professional Information</h2>
            
            <div className="form-group">
              <label htmlFor="specialty">Specialty</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="e.g., Cardiologist, Dentist"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Professional Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief description of your practice and expertise..."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Availability Schedule</h2>
            
            <div className="availability-grid">
              {Object.entries(formData.availability).map(([day, schedule]) => (
                <div key={day} className="availability-row">
                  <div className="day-label">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </div>
                  
                  <div className="availability-controls">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={schedule.available}
                        onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                      />
                      Available
                    </label>
                    
                    {schedule.available && (
                      <>
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProviderProfile;
