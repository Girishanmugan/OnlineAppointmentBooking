import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          {process.env.REACT_APP_APP_NAME || 'AppointMed'}
        </Link>
      </div>
      {user && (
        <div className="navbar-user">
          <span className="user-name">Welcome, {user.name}</span>
          <button onClick={logout} className="btn btn-outline">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
