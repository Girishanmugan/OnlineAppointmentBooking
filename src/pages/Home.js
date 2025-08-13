import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to MediBook</h1>
          <p className="hero-subtitle">Your trusted online appointment booking system</p>
          <p className="hero-description">
            Connect with healthcare professionals, book appointments seamlessly, 
            and manage your healthcare journey with ease.
          </p>

          {!isAuthenticated ? (
            <div className="hero-actions">
              <Link to="/register" className="btn-primary">Get Started</Link>
              <Link to="/login" className="btn-secondary">Login</Link>
            </div>
          ) : (
            <div className="hero-actions">
              <Link to="/dashboard" className="btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="features-section">
          <h2>Why Choose MediBook?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏥</div>
              <h3>Find Doctors</h3>
              <p>Browse through our network of qualified healthcare professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Easy Booking</h3>
              <p>Schedule appointments with just a few clicks</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Platform</h3>
              <p>Your health information is protected with enterprise-grade security</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Updates</h3>
              <p>Get instant notifications about your appointment status</p>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="user-welcome">
            <h3>Welcome back, {user.name}!</h3>
            <p>You are logged in as a {user.userType}.</p>
            <div className="quick-actions">
              {user.userType === 'patient' && (
                <Link to="/book-appointment" className="quick-action-btn">
                  📅 Book Appointment
                </Link>
              )}
              {user.userType === 'doctor' && (
                <Link to="/doctor-dashboard" className="quick-action-btn">
                  🩺 Manage Appointments
                </Link>
              )}
              {user.userType === 'admin' && (
                <Link to="/admin-dashboard" className="quick-action-btn">
                  ⚙️ Admin Panel
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
