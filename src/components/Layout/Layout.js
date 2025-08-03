import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-content">
        {showSidebar && <Sidebar />}
        <main className={`main-content ${showSidebar ? 'with-sidebar' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
