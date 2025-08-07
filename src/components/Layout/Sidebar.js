// src/components/Layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  console.log('Sidebar render - User:', user, 'Current path:', location.pathname);

  const userMenuItems = [
    { path: '/user-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/providers', label: 'Find Providers', icon: '👥' },
    { path: '/appointments', label: 'My Appointments', icon: '📅' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  const providerMenuItems = [
    { path: '/provider-dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/my-appointments', label: 'My Appointments', icon: '📅' },
    { path: '/my-profile', label: 'My Profile', icon: '👤' }
  ];

  const menuItems = user?.role === 'provider' ? providerMenuItems : userMenuItems;

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => console.log('Sidebar link clicked:', item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
