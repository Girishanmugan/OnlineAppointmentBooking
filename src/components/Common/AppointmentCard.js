// src/components/Common/AppointmentCard.js
import React from 'react';
import { motion } from 'framer-motion';

const AppointmentCard = ({ appointment, index = 0, showActions = true }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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
      className="appointment-card-modern"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ scale: 1.01, translateY: -2 }}
    >
      <div className="appointment-header">
        <div className="provider-info">
          <div className="provider-avatar">
            {appointment.provider?.specialty?.charAt(0) || '👨‍⚕️'}
          </div>
          <div className="provider-details">
            <h3 className="provider-name">
              {appointment.provider?.user?.name || 'Provider'}
            </h3>
            <p className="provider-specialty">
              {appointment.provider?.specialty || 'Healthcare Provider'}
            </p>
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
      </div>

      {showActions && (
        <div className="appointment-actions">
          <button className="btn-secondary">Reschedule</button>
          <button className="btn-danger">Cancel</button>
        </div>
      )}
    </motion.div>
  );
};

export default AppointmentCard;
