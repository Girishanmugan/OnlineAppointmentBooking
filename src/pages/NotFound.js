import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/';
    
    switch (user?.userType) {
      case 'patient': return '/patient-dashboard';
      case 'doctor': return '/doctor-dashboard';  
      case 'admin': return '/admin-dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-illustration">
          <div className="error-code">404</div>
          <div className="error-icon">🔍</div>
        </div>
        
        <h2>Oops! Page Not Found</h2>
        <p className="error-message">
          The page you're looking for seems to have wandered off. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>

        <div className="not-found-actions">
          <button 
            onClick={() => navigate(-1)} 
            className="btn-secondary"
          >
            ← Go Back
          </button>
          
          <Link to="/" className="btn-primary">
            🏠 Go Home
          </Link>
          
          {isAuthenticated && (
            <Link to={getDashboardLink()} className="btn-primary">
              📊 Dashboard
            </Link>
          )}
        </div>

        <div className="help-section">
          <h3>Need Help?</h3>
          <div className="help-links">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="help-link">Login</Link>
                <Link to="/register" className="help-link">Sign Up</Link>
              </>
            ) : (
              <>
                {user?.userType === 'patient' && (
                  <Link to="/book-appointment" className="help-link">Book Appointment</Link>
                )}
                <Link to="/dashboard" className="help-link">Dashboard</Link>
              </>
            )}
          </div>
        </div>

        <div className="search-suggestion">
          <p>Looking for something specific? Try these popular pages:</p>
          <div className="popular-links">
            <Link to="/" className="popular-link">Home</Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="popular-link">Login</Link>
                <Link to="/register" className="popular-link">Register</Link>
              </>
            )}
            {isAuthenticated && user?.userType === 'patient' && (
              <Link to="/book-appointment" className="popular-link">Book Appointment</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
