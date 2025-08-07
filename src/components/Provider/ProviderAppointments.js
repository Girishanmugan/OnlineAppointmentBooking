// src/components/Provider/ProviderAppointments.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../Layout/Layout';
import LoadingSpinner from '../Common/LoadingSpinner';
import { appointmentService } from '../../services/appointmentService';
import toast from 'react-hot-toast';

const ProviderAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getProviderAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      toast.error('Failed to load appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setUpdating(appointmentId);
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update appointment status');
    } finally {
      setUpdating(null);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    const aptDate = new Date(appointment.appointmentDate);
    
    switch (filter) {
      case 'pending':
        return appointment.status === 'pending';
      case 'confirmed':
        return appointment.status === 'confirmed';
      case 'today':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return aptDate >= today && aptDate < tomorrow;
      case 'upcoming':
        return aptDate >= now && appointment.status !== 'cancelled' && appointment.status !== 'completed';
      case 'completed':
        return appointment.status === 'completed';
      default:
        return true;
    }
  });

  const getFilterCounts = () => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return appointments.reduce((acc, apt) => {
      const aptDate = new Date(apt.appointmentDate);
      
      acc.all++;
      if (apt.status === 'pending') acc.pending++;
      if (apt.status === 'confirmed') acc.confirmed++;
      if (apt.status === 'completed') acc.completed++;
      if (aptDate >= today && aptDate < tomorrow) acc.today++;
      if (aptDate >= now && apt.status !== 'cancelled' && apt.status !== 'completed') acc.upcoming++;
      
      return acc;
    }, { all: 0, pending: 0, confirmed: 0, completed: 0, today: 0, upcoming: 0 });
  };

  const counts = getFilterCounts();

  return (
    <Layout>
      <div className="appointments-page provider-appointments">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>My Appointments</h1>
          <p>Manage your patient appointments and schedule</p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="filter-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({counts.all})
          </button>
          <button
            className={`tab ${filter === 'today' ? 'active' : ''}`}
            onClick={() => setFilter('today')}
          >
            Today ({counts.today})
          </button>
          <button
            className={`tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({counts.pending})
          </button>
          <button
            className={`tab ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed ({counts.confirmed})
          </button>
          <button
            className={`tab ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({counts.upcoming})
          </button>
          <button
            className={`tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({counts.completed})
          </button>
        </motion.div>

        {/* Appointments List */}
        <motion.div 
          className="appointments-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <LoadingSpinner size="md" message="Loading appointments..." />
          ) : filteredAppointments.length > 0 ? (
            <div className="appointments-grid provider-grid">
              {filteredAppointments.map((appointment, index) => (
                <ProviderAppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  index={index}
                  onStatusUpdate={handleStatusUpdate}
                  updating={updating === appointment._id}
                />
              ))}
            </div>
          ) : (
            <div className="empty-appointments">
              <div className="empty-icon">📅</div>
              <h3>No appointments found</h3>
              <p>
                {filter === 'all' 
                  ? "You don't have any appointments yet."
                  : `No ${filter} appointments found.`
                }
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

// Provider appointment card component
const ProviderAppointmentCard = ({ appointment, index, onStatusUpdate, updating }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return 'Time TBD';
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      className="appointment-card-modern provider-appointment-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, translateY: -2 }}
    >
      <div className="appointment-header">
        <div className="patient-info">
          <div className="patient-avatar">
            {appointment.patient?.name?.charAt(0) || '👤'}
          </div>
          <div className="patient-details">
            <h3 className="patient-name">
              {appointment.patient?.name || 'Patient'}
            </h3>
            <p className="patient-contact">
              📧 {appointment.patient?.email || 'No email'}
            </p>
            {appointment.patient?.phone && (
              <p className="patient-phone">
                📞 {appointment.patient.phone}
              </p>
            )}
          </div>
        </div>
        <span className={`status-badge ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="appointment-details">
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span className="detail-text">
            {formatDate(appointment.appointmentDate)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🕐</span>
          <span className="detail-text">
            {appointment.timeSlot?.start ? 
              `${formatTime(appointment.timeSlot.start)} - ${formatTime(appointment.timeSlot.end)}` :
              'Time TBD'
            }
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🏥</span>
          <span className="detail-text">
            {appointment.service?.name || 'General Consultation'}
          </span>
        </div>
        {appointment.notes && (
          <div className="detail-item notes">
            <span className="detail-icon">📝</span>
            <span className="detail-text">{appointment.notes}</span>
          </div>
        )}
      </div>

      <div className="appointment-actions provider-actions">
        {appointment.status === 'pending' && (
          <>
            <button
              onClick={() => onStatusUpdate(appointment._id, 'confirmed')}
              className="btn-secondary confirm-btn"
              disabled={updating}
            >
              {updating ? '⏳' : '✅'} Confirm
            </button>
            <button
              onClick={() => onStatusUpdate(appointment._id, 'cancelled')}
              className="btn-danger decline-btn"
              disabled={updating}
            >
              {updating ? '⏳' : '❌'} Decline
            </button>
          </>
        )}
        {appointment.status === 'confirmed' && (
          <button
            onClick={() => onStatusUpdate(appointment._id, 'completed')}
            className="btn-secondary complete-btn"
            disabled={updating}
          >
            {updating ? '⏳' : '✅'} Mark Complete
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProviderAppointments;
