import React, { useState, useEffect } from 'react';
import Layout from '../Layout/Layout';
import { appointmentService } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import Loading from '../Common/Loading';

const ProviderAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getProviderAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status);
      toast.success(`Appointment ${status} successfully`);
      fetchAppointments();
    } catch (error) {
      toast.error(`Failed to ${status} appointment`);
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
          <p>Manage your patient appointments</p>
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
        </div>

        {/* Appointments List */}
        <div className="appointments-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(appointment => (
              <div key={appointment._id} className="appointment-card">
                <div className="appointment-info">
                  <h3>{appointment.patient?.name}</h3>
                  <p className="appointment-date">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="appointment-time">
                    {appointment.timeSlot?.start} - {appointment.timeSlot?.end}
                  </p>
                  <p className="appointment-service">
                    Service: {appointment.service}
                  </p>
                  <p className="patient-contact">
                    Contact: {appointment.patient?.email}
                  </p>
                  {appointment.notes && (
                    <p className="appointment-notes">
                      Notes: {appointment.notes}
                    </p>
                  )}
                </div>
                <div className="appointment-actions">
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                  {appointment.status === 'pending' && (
                    <div className="action-buttons">
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                        className="btn btn-success btn-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                        className="btn btn-danger btn-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {appointment.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                      className="btn btn-primary btn-sm"
                    >
                      Mark Complete
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

export default ProviderAppointments;
