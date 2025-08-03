import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getProviderAppointments();
      const appointmentData = response.data || [];
      setAppointments(appointmentData);
      
      // Calculate stats
      const stats = appointmentData.reduce((acc, apt) => {
        acc.total++;
        if (apt.status === 'pending') acc.pending++;
        else if (apt.status === 'confirmed') acc.confirmed++;
        else if (apt.status === 'completed') acc.completed++;
        return acc;
      }, { total: 0, pending: 0, confirmed: 0, completed: 0 });
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayAppointments = appointments
    .filter(apt => {
      const today = new Date();
      const aptDate = new Date(apt.appointmentDate);
      return aptDate.toDateString() === today.toDateString();
    })
    .slice(0, 5);

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Provider Dashboard</h1>
          <p>Welcome back, Dr. {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Approval</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.confirmed}</div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="today-section">
          <h2>Today's Appointments</h2>
          {loading ? (
            <p>Loading appointments...</p>
          ) : todayAppointments.length > 0 ? (
            <div className="appointment-list">
              {todayAppointments.map(appointment => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-info">
                    <h4>{appointment.patient?.name}</h4>
                    <p className="appointment-time">
                      {appointment.timeSlot?.start} - {appointment.timeSlot?.end}
                    </p>
                    <p className="appointment-service">{appointment.service}</p>
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="appointment-actions">
                    <p className="patient-contact">{appointment.patient?.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No appointments scheduled for today</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProviderDashboard;
