import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, appointmentsResponse] = await Promise.all([
        api.get('/users'),
        api.get('/appointments')
      ]);
      
      setUsers(usersResponse.data.users);
      setAppointments(appointmentsResponse.data.appointments);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.put(`/users/${userId}/toggle-status`);
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isActive: !user.isActive }
          : user
      ));
    } catch (error) {
      setError('Failed to update user status');
      console.error('Toggle user status error:', error);
    }
  };

  const getStats = () => {
    const totalUsers = users.length;
    const totalDoctors = users.filter(user => user.userType === 'doctor').length;
    const totalPatients = users.filter(user => user.userType === 'patient').length;
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

    return {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingAppointments,
      completedAppointments
    };
  };

  if (loading) return <div className="loading">Loading...</div>;

  const stats = getStats();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <div className="stat-number">{stats.totalUsers}</div>
              </div>
              <div className="stat-card">
                <h3>Doctors</h3>
                <div className="stat-number">{stats.totalDoctors}</div>
              </div>
              <div className="stat-card">
                <h3>Patients</h3>
                <div className="stat-number">{stats.totalPatients}</div>
              </div>
              <div className="stat-card">
                <h3>Total Appointments</h3>
                <div className="stat-number">{stats.totalAppointments}</div>
              </div>
              <div className="stat-card">
                <h3>Pending</h3>
                <div className="stat-number">{stats.pendingAppointments}</div>
              </div>
              <div className="stat-card">
                <h3>Completed</h3>
                <div className="stat-number">{stats.completedAppointments}</div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="section">
            <h2>All Users</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`user-type-badge ${user.userType}`}>
                          {user.userType}
                        </span>
                      </td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => toggleUserStatus(user._id)}
                          className={`btn-sm ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="section">
            <h2>All Appointments</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td>{appointment.patient.name}</td>
                      <td>Dr. {appointment.doctor.name}</td>
                      <td>{new Date(appointment.date).toLocaleDateString()}</td>
                      <td>{appointment.time}</td>
                      <td>
                        <span className={`status-badge ${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="reason-cell">{appointment.reason}</td>
                      <td>{new Date(appointment.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
