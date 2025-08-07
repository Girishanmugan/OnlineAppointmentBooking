// src/components/User/UserAppointments.js
import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import Loading from '../Common/Loading';
import Modal from '../Common/Modal';
import { appointmentService } from '../../services/appointmentService';
import { toast } from 'react-toastify';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelModal, setCancelModal] = useState({ show: false, appointmentId: null });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getUserAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      toast.error('Failed to load appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await appointmentService.cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
      setCancelModal({ show: false, appointmentId: null });
      fetchAppointments(); // Refresh list
    } catch (error) {
      toast.error('Failed to cancel appointment');
      console.error('Error cancelling appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    const aptDate = new Date(appointment.appointmentDate);
    
    switch (filter) {
      case 'upcoming':
        return aptDate >= now && appointment.status !== 'cancelled';
      case 'past':
        return aptDate < now || appointment.status === 'completed';
      case 'cancelled':
        return appointment.status === 'cancelled';
      default:
        return true;
    }
  });

  const canCancelAppointment = (appointment) => {
    const now = new Date();
    const aptDate = new Date(appointment.appointmentDate);
    const hoursDiff = (aptDate - now) / (1000 * 60 * 60);
    
    return (
      appointment.status === 'pending' || appointment.status === 'confirmed'
    ) && hoursDiff > 24; // Can cancel if more than 24 hours away
  };

  return (
    <Layout>
      <div className="appointments-page">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Manage your scheduled appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({appointments.length})
          </button>
          <button
            className={`tab ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({appointments.filter(apt => {
              const now = new Date();
              const aptDate = new Date(apt.appointmentDate);
              return aptDate >= now && apt.status !== 'cancelled';
            }).length})
          </button>
          <button
            className={`tab ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past ({appointments.filter(apt => {
              const now = new Date();
              const aptDate = new Date(apt.appointmentDate);
              return aptDate < now || apt.status === 'completed';
            }).length})
          </button>
          <button
            className={`tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({appointments.filter(apt => apt.status === 'cancelled').length})
          </button>
        </div>

        {/* Appointments List */}
        <div className="appointments-section">
          {loading ? (
            <Loading />
          ) : filteredAppointments.length > 0 ? (
            <div className="appointments-list">
              {filteredAppointments.map(appointment => (
                <div key={appointment._id} className="appointment-card">
                  <div className="appointment-main">
                    <div className="appointment-info">
                      <h3>{appointment.provider?.user?.name}</h3>
                      <p className="specialty">{appointment.provider?.specialty}</p>
                      <p className="service">{appointment.service?.name}</p>
                      
                      <div className="appointment-datetime">
                        <span className="date">
                          📅 {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </span>
                        <span className="time">
                          🕒 {appointment.timeSlot?.start} - {appointment.timeSlot?.end}
                        </span>
                      </div>

                      {appointment.notes && (
                        <div className="appointment-notes">
                          <strong>Notes:</strong> {appointment.notes}
                        </div>
                      )}
                    </div>

                    <div className="appointment-status">
                      <span className={`status-badge ${appointment.status}`}>
                        {appointment.status}
                      </span>
                      <div className="appointment-actions">
                        {canCancelAppointment(appointment) && (
                          <button
                            onClick={() => setCancelModal({ 
                              show: true, 
                              appointmentId: appointment._id 
                            })}
                            className="btn btn-outline btn-danger"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No appointments found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't booked any appointments yet."
                  : `No ${filter} appointments found.`
                }
              </p>
              <a href="/providers" className="btn btn-primary">
                Book an Appointment
              </a>
            </div>
          )}
        </div>

        {/* Cancel Confirmation Modal */}
        <Modal
          isOpen={cancelModal.show}
          onClose={() => setCancelModal({ show: false, appointmentId: null })}
          title="Cancel Appointment"
        >
          <div className="modal-content">
            <p>Are you sure you want to cancel this appointment?</p>
            <p className="text-small text-muted">This action cannot be undone.</p>
            
            <div className="modal-actions">
              <button
                onClick={() => setCancelModal({ show: false, appointmentId: null })}
                className="btn btn-outline"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => handleCancelAppointment(cancelModal.appointmentId)}
                className="btn btn-danger"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default UserAppointments;
