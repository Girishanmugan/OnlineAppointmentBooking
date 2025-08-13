import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const PatientDashboard = () => {
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

  const cancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.delete(`/appointments/${appointmentId}`);
        setAppointments(appointments.filter(apt => apt._id !== appointmentId));
      } catch (error) {
        setError('Failed to cancel appointment');
        console.error('Cancel appointment error:', error);
      }
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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <Link to="/book-appointment" className="btn-primary">
          Book New Appointment
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="section">
          <h2>My Appointments</h2>
          
          {appointments.length === 0 ? (
            <div className="no-data">
              <p>No appointments found.</p>
              <Link to="/book-appointment" className="btn-primary">
                Book Your First Appointment
              </Link>
            </div>
          ) : (
            <div className="appointments-grid">
              {appointments.map((appointment) => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-header">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {appointment.status.toUpperCase()}
                    </span>
                    <span className="appointment-date">
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="appointment-details">
                    <h3>Dr. {appointment.doctor.name}</h3>
                    <p><strong>Hospital:</strong> {appointment.doctor.hospitalName}</p>
                    <p><strong>Specialization:</strong> {appointment.doctor.specialization}</p>
                    <p><strong>Time:</strong> {appointment.time}</p>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                    {appointment.notes && (
                      <p><strong>Notes:</strong> {appointment.notes}</p>
                    )}
                  </div>
                  
                  <div className="appointment-actions">
                    {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                      <button 
                        onClick={() => cancelAppointment(appointment._id)}
                        className="btn-danger"
                      >
                        Cancel
                      </button>
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

export default PatientDashboard;
