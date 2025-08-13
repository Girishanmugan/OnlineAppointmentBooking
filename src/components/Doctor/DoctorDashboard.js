import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data.appointments);
    } catch (error) {
      setError('Failed to fetch appointments');
      console.error('Fetch appointments error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      setAppointments(appointments.map(apt => 
        apt._id === appointmentId 
          ? { ...apt, status: newStatus }
          : apt
      ));
    } catch (error) {
      setError('Failed to update appointment status');
      console.error('Update status error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      case 'completed': return '#6c757d';
      default: return '#007bff';
    }
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => 
      (apt.status === 'pending' || apt.status === 'confirmed') && 
      apt.date >= today
    ).sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time));
  };

  const getPastAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => 
      apt.date < today || apt.status === 'completed' || apt.status === 'cancelled'
    ).sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Appointments</h3>
            <div className="stat-number">{appointments.length}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="stat-number">
              {appointments.filter(apt => apt.status === 'pending').length}
            </div>
          </div>
          <div className="stat-card">
            <h3>Upcoming</h3>
            <div className="stat-number">{getUpcomingAppointments().length}</div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="stat-number">
              {appointments.filter(apt => apt.status === 'completed').length}
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Upcoming Appointments</h2>
          
          {getUpcomingAppointments().length === 0 ? (
            <div className="no-data">No upcoming appointments</div>
          ) : (
            <div className="appointments-grid">
              {getUpcomingAppointments().map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {appointment.status.toUpperCase()}
                    </span>
                    <span className="appointment-date">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </span>
                  </div>
                  
                  <div className="appointment-details">
                    <h3>{appointment.patient.name}</h3>
                    <p><strong>Email:</strong> {appointment.patient.email}</p>
                    <p><strong>Phone:</strong> {appointment.patient.phone}</p>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                    {appointment.notes && (
                      <p><strong>Notes:</strong> {appointment.notes}</p>
                    )}
                  </div>
                  
                  <div className="appointment-actions">
                    {appointment.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                          className="btn-success"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                          className="btn-danger"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button 
                        onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                        className="btn-primary"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h2>Past Appointments</h2>
          
          {getPastAppointments().length === 0 ? (
            <div className="no-data">No past appointments</div>
          ) : (
            <div className="appointments-grid">
              {getPastAppointments().slice(0, 10).map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {appointment.status.toUpperCase()}
                    </span>
                    <span className="appointment-date">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </span>
                  </div>
                  
                  <div className="appointment-details">
                    <h3>{appointment.patient.name}</h3>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                    {appointment.notes && (
                      <p><strong>Notes:</strong> {appointment.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
