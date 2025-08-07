// src/components/Provider/ProviderDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../Layout/Layout';
import StatsCard from '../Common/StatsCard';
import AppointmentCard from '../Common/AppointmentCard';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    today: 0
  });
  const [loading, setLoading] = useState(true);
  const [quickActions] = useState([
    {
      title: 'View All Appointments',
      description: 'Manage your appointment schedule',
      icon: '📅',
      color: 'blue',
      link: '/my-appointments',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Update Profile',
      description: 'Edit your professional information',
      icon: '👤',
      color: 'green',
      link: '/my-profile',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Patient Reviews',
      description: 'View feedback from patients',
      icon: '⭐',
      color: 'purple',
      link: '/reviews',
      gradient: 'from-purple-500 to-purple-600'
    }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await appointmentService.getProviderAppointments();
      const appointmentData = response.data || [];
      setAppointments(appointmentData);
      
      // Calculate stats
      const now = new Date();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const calculatedStats = appointmentData.reduce((acc, apt) => {
        const aptDate = new Date(apt.appointmentDate);
        
        acc.total++;
        if (apt.status === 'pending') acc.pending++;
        else if (apt.status === 'confirmed') acc.confirmed++;
        else if (apt.status === 'completed') acc.completed++;
        
        // Today's appointments
        if (aptDate >= today && aptDate < tomorrow) {
          acc.today++;
        }
        
        return acc;
      }, { total: 0, pending: 0, confirmed: 0, completed: 0, today: 0 });
      
      setStats(calculatedStats);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const todayAppointments = appointments
    .filter(apt => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= today && aptDate < tomorrow;
    })
    .sort((a, b) => {
      const timeA = a.timeSlot?.start || '00:00';
      const timeB = b.timeSlot?.start || '00:00';
      return timeA.localeCompare(timeB);
    })
    .slice(0, 5);

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div className="dashboard-modern">
        {/* Welcome Section */}
        <motion.div 
          className="welcome-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="welcome-content">
            <h1 className="welcome-title">
              {getTimeOfDayGreeting()}, Dr. {user?.name?.split(' ')[0]}! 👨‍⚕️
            </h1>
            <p className="welcome-subtitle">
              You have {stats.today} appointment{stats.today !== 1 ? 's' : ''} scheduled for today
            </p>
          </div>
          <div className="welcome-actions">
            <Link to="/my-appointments" className="btn-primary-gradient">
              <span className="btn-icon">📅</span>
              View Schedule
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="stats-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="stats-grid">
            <StatsCard
              title="Total Appointments"
              value={stats.total}
              icon="📊"
              color="blue"
              trend={`${stats.today} scheduled today`}
              loading={loading}
            />
            <StatsCard
              title="Pending Approval"
              value={stats.pending}
              icon="⏳"
              color="yellow"
              trend="Requires your attention"
              loading={loading}
            />
            <StatsCard
              title="Confirmed Today"
              value={stats.today}
              icon="✅"
              color="green"
              trend="Ready to see patients"
              loading={loading}
            />
            <StatsCard
              title="Completed This Month"
              value={stats.completed}
              icon="🎯"
              color="purple"
              trend="Keep up the great work!"
              loading={loading}
            />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="quick-actions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="action-card"
              >
                <div className={`action-icon bg-gradient-to-r ${action.gradient}`}>
                  <span>{action.icon}</span>
                </div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div 
          className="upcoming-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="section-header">
            <h2 className="section-title">Today's Schedule</h2>
            <Link to="/my-appointments" className="view-all-link">
              View All Appointments →
            </Link>
          </div>

          {loading ? (
            <div className="appointments-loading">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="appointment-skeleton" />
              ))}
            </div>
          ) : todayAppointments.length > 0 ? (
            <div className="appointments-grid">
              {todayAppointments.map((appointment, index) => (
                <ProviderAppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  index={index}
                  onStatusUpdate={fetchDashboardData}
                />
              ))}
            </div>
          ) : (
            <div className="empty-appointments">
              <div className="empty-icon">📅</div>
              <h3>No appointments scheduled for today</h3>
              <p>Enjoy your day off or check your upcoming schedule</p>
              <Link to="/my-appointments" className="btn-primary-gradient">
                View Full Schedule
              </Link>
            </div>
          )}
        </motion.div>

        {/* Provider Insights */}
        <motion.div 
          className="insights-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="section-title">Provider Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">📈</div>
              <h3>Patient Satisfaction</h3>
              <div className="insight-value">4.8/5.0</div>
              <p>Based on recent reviews</p>
            </div>
            <div className="insight-card">
              <div className="insight-icon">⏱️</div>
              <h3>Average Consultation</h3>
              <div className="insight-value">32 min</div>
              <p>Per appointment session</p>
            </div>
            <div className="insight-card">
              <div className="insight-icon">👥</div>
              <h3>Monthly Patients</h3>
              <div className="insight-value">85</div>
              <p>Unique patients this month</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

// Provider-specific appointment card component
const ProviderAppointmentCard = ({ appointment, index, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await appointmentService.updateAppointmentStatus(appointment._id, newStatus);
      toast.success(`Appointment ${newStatus} successfully`);
      onStatusUpdate();
    } catch (error) {
      toast.error('Failed to update appointment status');
    } finally {
      setUpdating(false);
    }
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
      className="appointment-card-modern provider-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
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
              {appointment.patient?.email || 'No email'}
            </p>
          </div>
        </div>
        <span className={`status-badge ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>

      <div className="appointment-details">
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
          <div className="detail-item">
            <span className="detail-icon">📝</span>
            <span className="detail-text">{appointment.notes}</span>
          </div>
        )}
      </div>

      <div className="appointment-actions provider-actions">
        {appointment.status === 'pending' && (
          <>
            <button
              onClick={() => handleStatusUpdate('confirmed')}
              className="btn-secondary"
              disabled={updating}
            >
              ✅ Confirm
            </button>
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              className="btn-danger"
              disabled={updating}
            >
              ❌ Decline
            </button>
          </>
        )}
        {appointment.status === 'confirmed' && (
          <button
            onClick={() => handleStatusUpdate('completed')}
            className="btn-secondary"
            disabled={updating}
          >
            ✅ Mark Complete
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProviderDashboard;
