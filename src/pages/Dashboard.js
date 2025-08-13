import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from '../components/Patient/PatientDashboard';
import DoctorDashboard from '../components/Doctor/DoctorDashboard';
import AdminDashboard from '../components/Admin/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  switch (user.userType) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div className="error">Invalid user type</div>;
  }
};

export default Dashboard;
