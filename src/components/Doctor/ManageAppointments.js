import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notes, setNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);

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
      const response = await api.put(`/appointments/${appointmentId}/status`, { 
        status: newStatus 
      });
      
      setAppointments(appointments.map(apt => 
        apt._id === appointmentId 
          ? { ...apt, status: newStatus }
          : apt
      ));
      
      // Show success message
      const appointmentIndex = appointments.findIndex(apt => apt._id === appointmentId);
      if (appointmentIndex !== -1) {
        const patientName = appointments[appointmentIndex].patient.name;
        alert(`Appointment with ${patientName} has been ${newStatus}`);
      }
    } catch (error) {
      setError('Failed to update appointment status');
      console.error('Update status error:', error);
    }
  };

  const addNotes = async (appointmentId, notesText) => {
    try {
      await api.put(`/appointments/${appointmentId}/notes`, { 
        notes: notesText 
      });
      
      setAppointments(appointments.map(apt => 
        apt._id === appointmentId 
          ? { ...apt, notes: notesText }
          : apt
      ));
      
      setShowNotesModal(false);
      setNotes('');
      setSelectedAppointment(null);
    } catch (error) {
      setError('Failed to add notes');
      console.error('Add notes error:', error);
    }
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(apt => apt.status === filter);
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(apt => apt.date === dateFilter);
    }

    // Sort by date and time
    return filtered.sort((a, b) => {
      const dateTimeA = new Date(a.date + ' ' + a.time);
      const dateTimeB = new Date(b.date + ' ' + b.time);
      return dateTimeA - dateTimeB;
    });
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = (date, time) => {
    const appointmentDateTime = new Date(date + ' ' + time);
    return appointmentDateTime > new Date();
  };

  const getAppointmentStats = () => {
    const total = appointments.length;
    const pending = appointments.filter(apt => apt.status === 'pending').length;
    const confirmed = appointments.filter(apt => apt.status === 'confirmed').length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;
    const cancelled = appointments.filter(apt => apt.status === 'cancelled').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todaysAppointments = appointments.filter(apt => apt.date === today).length;

    return { total, pending, confirmed, completed, cancelled, todaysAppointments };
  };

  if (loading) return <div className="loading">Loading appointments...</div>;

  const filteredAppointments = getFilteredAppointments();
  const stats = getAppointmentStats();

  return (
    <div className="manage-appointments-container">
      <div className="appointments-header">
        <h2>Manage Appointments</h2>
        <button 
          onClick={fetchAppointments} 
          className="btn-primary"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Statistics */}
      <div className="appointment-stats">
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.confirmed}</span>
          <span className="stat-label">Confirmed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.todaysAppointments}</span>
          <span className="stat-label">Today</span>
        </div>
      </div>

      {/* Filters */}
      <div className="appointment-filters">
        <div className="filter-group">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Appointments</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="dateFilter">Filter by Date:</label>
          <input
            type="date"
            id="dateFilter"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => {setFilter('all'); setDateFilter('');}} 
          className="btn-secondary"
        >
          Clear Filters
        </button>
      </div>

      {/* Appointments List */}
      <div className="appointments-section">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <p>No appointments found matching your filters.</p>
          </div>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => (
              <div 
                key={appointment._id} 
                className={`appointment-item ${!isUpcoming(appointment.date, appointment.time) ? 'past' : ''}`}
              >
                <div className="appointment-info">
                  <div className="appointment-patient">
                    <h3>{appointment.patient.name}</h3>
                    <div className="patient-details">
                      <span>📧 {appointment.patient.email}</span>
                      <span>📞 {appointment.patient.phone}</span>
                    </div>
                  </div>
                  
                  <div className="appointment-datetime">
                    <div className="date">📅 {formatDate(appointment.date)}</div>
                    <div className="time">🕐 {formatTime(appointment.time)}</div>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="reason">
                      <strong>Reason:</strong> {appointment.reason}
                    </div>
                    {appointment.notes && (
                      <div className="notes">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="appointment-actions">
                  <div className="status-section">
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {appointment.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="action-buttons">
                    {appointment.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                          className="btn-success"
                          title="Confirm Appointment"
                        >
                          ✅ Confirm
                        </button>
                        <button 
                          onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                          className="btn-danger"
                          title="Cancel Appointment"
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                    
                    {appointment.status === 'confirmed' && (
                      <>
                        <button 
                          onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                          className="btn-primary"
                          title="Mark as Completed"
                        >
                          ✔️ Complete
                        </button>
                        <button 
                          onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                          className="btn-danger"
                          title="Cancel Appointment"
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                    
                    <button 
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setNotes(appointment.notes || '');
                        setShowNotesModal(true);
                      }}
                      className="btn-secondary"
                      title="Add/Edit Notes"
                    >
                      📝 Notes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes Modal */}
      {showNotesModal && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setShowNotesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Notes - {selectedAppointment.patient.name}</h3>
              <button 
                onClick={() => setShowNotesModal(false)}
                className="close-button"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="appointment-summary">
                <p><strong>Date:</strong> {formatDate(selectedAppointment.date)}</p>
                <p><strong>Time:</strong> {formatTime(selectedAppointment.time)}</p>
                <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
              </div>
              
              <div className="notes-input">
                <label htmlFor="appointmentNotes">Notes:</label>
                <textarea
                  id="appointmentNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="6"
                  placeholder="Add your notes about this appointment..."
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowNotesModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => addNotes(selectedAppointment._id, notes)}
                className="btn-primary"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;
