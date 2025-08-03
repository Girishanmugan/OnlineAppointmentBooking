import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { providerService } from '../../services/providerService';
import { appointmentService } from '../../services/appointmentService';
import { toast } from 'react-toastify';

const BookAppointment = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: '',
    timeSlot: '',
    service: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProvider();
  }, [providerId]);

  const fetchProvider = async () => {
    try {
      const response = await providerService.getProvider(providerId);
      setProvider(response.data);
    } catch (error) {
      console.error('Error fetching provider:', error);
      toast.error('Provider not found');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setFormData({ ...formData, appointmentDate: selectedDate, timeSlot: '' });
    
    // Generate available time slots for the selected date
    const slots = generateTimeSlots();
    setAvailableSlots(slots);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push({
        start: `${hour.toString().padStart(2, '0')}:00`,
        end: `${(hour + 1).toString().padStart(2, '0')}:00`,
        value: `${hour.toString().padStart(2, '0')}:00`
      });
    }
    return slots;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const appointmentData = {
        ...formData,
        provider: providerId,
        timeSlot: {
          start: formData.timeSlot,
          end: formData.timeSlot.replace(/\d{2}:/, (match) => 
            (parseInt(match) + 1).toString().padStart(2, '0') + ':'
          )
        }
      };
      
      await appointmentService.bookAppointment(appointmentData);
      toast.success('Appointment booked successfully!');
      navigate('/my-appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!provider) {
    return (
      <Layout>
        <div className="error-state">
          <h2>Provider not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="book-appointment-page">
        <div className="page-header">
          <h1>Book Appointment</h1>
          <p>Schedule an appointment with {provider.user?.name}</p>
        </div>

        <div className="appointment-form-container">
          <div className="provider-info-card">
            <h3>{provider.user?.name}</h3>
            <p className="specialty">{provider.specialty}</p>
            <p className="experience">{provider.experience} years of experience</p>
          </div>

          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date</label>
              <input
                type="date"
                id="appointmentDate"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {availableSlots.length > 0 && (
              <div className="form-group">
                <label htmlFor="timeSlot">Time Slot</label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a time slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.start} - {slot.end}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="service">Service Type</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select service</option>
                <option value="consultation">Consultation</option>
                <option value="checkup">Regular Checkup</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any additional information or special requests..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/providers')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
