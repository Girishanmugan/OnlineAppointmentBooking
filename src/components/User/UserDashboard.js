import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';

const UserDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getUserAppointments();
      const appointmentData = response.data || [];
      setAppointments(appointmentData);
      
      // Calculate stats
      const now = new Date();
      const stats = appointmentData.reduce((acc, apt) => {
        acc.total++;
        if (apt.status === 'completed') acc.completed++;
        else if (apt.status === 'cancelled') acc.cancelled++;
        else if (new Date(apt.appointmentDate) >= now) acc.upcoming++;
        return acc;
      }, { total: 0, upcoming: 0, completed: 0, cancelled: 0 });
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled')
    .slice(0, 3);

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Manage your appointments and find healthcare providers</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.upcoming}</div>
            <div className="stat-label">Upcoming</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.cancelled}</div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <Link to="/providers" className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Find Providers</h3>
              <p>Search and book appointments with healthcare providers</p>
            </Link>
            <Link to="/my-appointments" className="action-card">
              <div className="action-icon">📅</div>
              <h3>My Appointments</h3>
              <p>View and manage your scheduled appointments</p>
            </Link>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="upcoming-section">
          <h2>Upcoming Appointments</h2>
          {loading ? (
            <p>Loading appointments...</p>
          ) : upcomingAppointments.length > 0 ? (
            <div className="appointment-list">
              {upcomingAppointments.map(appointment => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-info">
                    <h4>{appointment.provider?.user?.name}</h4>
                    <p className="appointment-date">
                      {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.timeSlot?.start}
                    </p>
                    <p className="appointment-service">{appointment.service?.name}</p>
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No upcoming appointments</p>
              <Link to="/providers" className="btn btn-primary">
                Book an Appointment
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
