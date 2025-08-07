// src/components/User/UserDashboard.js - Completely Redesigned
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../Layout/Layout';
import StatsCard from '../Common/StatsCard';
import AppointmentCard from '../Common/AppointmentCard';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

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
  const [quickActions] = useState([
    {
      title: 'Find Specialists',
      description: 'Browse verified healthcare providers',
      icon: '🔍',
      color: 'blue',
      link: '/providers',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'My Appointments',
      description: 'View and manage appointments',
      icon: '📅',
      color: 'green',
      link: '/appointments',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Profile Settings',
      description: 'Update your personal information',
      icon: '👤',
      color: 'purple',
      link: '/profile',
      gradient: 'from-purple-500 to-purple-600'
    }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await appointmentService.getUserAppointments();
      const appointmentData = response.data || [];
      setAppointments(appointmentData);
      
      // Calculate stats
      const now = new Date();
      const calculatedStats = appointmentData.reduce((acc, apt) => {
        acc.total++;
        if (apt.status === 'completed') acc.completed++;
        else if (apt.status === 'cancelled') acc.cancelled++;
        else if (new Date(apt.appointmentDate) >= now) acc.upcoming++;
        return acc;
      }, { total: 0, upcoming: 0, completed: 0, cancelled: 0 });
      
      setStats(calculatedStats);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments
    .filter(apt => {
      const now = new Date();
      const aptDate = new Date(apt.appointmentDate);
      return aptDate >= now && apt.status !== 'cancelled';
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3);

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
              {getTimeOfDayGreeting()}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="welcome-subtitle">
              Here's your health overview for today
            </p>
          </div>
          <div className="welcome-actions">
            <Link to="/providers" className="btn-primary-gradient">
              <span className="btn-icon">🔍</span>
              Find Specialists
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
              trend="+12% from last month"
              loading={loading}
            />
            <StatsCard
              title="Upcoming"
              value={stats.upcoming}
              icon="📅"
              color="green"
              trend="Next appointment today"
              loading={loading}
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon="✅"
              color="purple"
              trend="Great progress!"
              loading={loading}
            />
            <StatsCard
              title="Cancelled"
              value={stats.cancelled}
              icon="❌"
              color="red"
              trend="Try to minimize"
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

        {/* Upcoming Appointments */}
        <motion.div 
          className="upcoming-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="section-header">
            <h2 className="section-title">Upcoming Appointments</h2>
            <Link to="/appointments" className="view-all-link">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="appointments-loading">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="appointment-skeleton" />
              ))}
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="appointments-grid">
              {upcomingAppointments.map((appointment, index) => (
                <AppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  index={index}
                  showActions={false}
                />
              ))}
            </div>
          ) : (
            <div className="empty-appointments">
              <div className="empty-icon">📅</div>
              <h3>No upcoming appointments</h3>
              <p>Book your next appointment to stay on top of your health</p>
              <Link to="/providers" className="btn-primary-gradient">
                Find Specialists
              </Link>
            </div>
          )}
        </motion.div>

        {/* Health Tips */}
        <motion.div 
          className="health-tips-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="section-title">Health Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">💧</div>
              <h3>Stay Hydrated</h3>
              <p>Drink at least 8 glasses of water daily for optimal health</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🏃</div>
              <h3>Regular Exercise</h3>
              <p>30 minutes of moderate activity 5 times a week</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">😴</div>
              <h3>Quality Sleep</h3>
              <p>Aim for 7-9 hours of sleep each night</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
