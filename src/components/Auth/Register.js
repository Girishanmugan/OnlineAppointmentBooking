// src/components/Auth/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    specialty: '',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.role === 'provider' && !formData.specialty) {
      toast.error('Please enter your specialty');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Attempting registration with:', { 
        name: formData.name, 
        email: formData.email, 
        role: formData.role 
      });
      
      // Prepare data for registration
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'provider' && {
          specialty: formData.specialty,
          experience: parseInt(formData.experience) || 0
        })
      };

      const user = await register(registrationData);
      console.log('Registration successful:', user);
      
      // Navigate based on user role
      if (user.role === 'provider') {
        navigate('/provider-dashboard');
      } else {
        navigate('/user-dashboard');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our appointment booking platform</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">I am a *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="user">Patient</option>
              <option value="provider">Healthcare Provider</option>
            </select>
          </div>
          
          {formData.role === 'provider' && (
            <>
              <div className="form-group">
                <label htmlFor="specialty">Specialty *</label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="e.g., Dentist, Cardiologist, General Practice"
                  disabled={loading}
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
                  max="50"
                  placeholder="Years of experience"
                  disabled={loading}
                />
              </div>
            </>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? 
            <Link to="/login"> Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
