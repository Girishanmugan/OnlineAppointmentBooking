import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { appointmentService } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import Loading from '../Common/Loading';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getUserAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(appointmentId);
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="appointments-page">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>View and manage your scheduled appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`tab ${filter === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilter('confirmed')}
          >
            Confirmed
          </button>
          <button
            className={`tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Appointments List */}
        <div className="appointments-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-info">
                  <h3>{appointment.provider?.user?.name}</h3>
                  <p className="appointment-specialty">
                    {appointment.provider?.specialty}
                  </p>
                  <p className="appointment-date">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="appointment-time">
                    {appointment.timeSlot?.start} - {appointment.timeSlot?.end}
                  </p>
                  <p className="appointment-service">
                    Service: {appointment.service}
                  </p>
                  {appointment.notes && (
                    <p className="appointment-notes">
                      Notes: {appointment.notes}
                    </p>
                  )}
                </div>
                <div className="appointment-status">
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                  {appointment.status === 'pending' && (
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No appointments found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserAppointments;
