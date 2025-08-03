import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { providerService } from '../../services/providerService';
import Loading from '../Common/Loading';

const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    search: ''
  });

  useEffect(() => {
    fetchProviders();
  }, [filters]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await providerService.getProviders(filters);
      setProviders(response.data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="providers-page">
        <div className="page-header">
          <h1>Find Healthcare Providers</h1>
          <p>Browse and book appointments with qualified healthcare professionals</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="form-group">
              <input
                type="text"
                name="search"
                placeholder="Search by name..."
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group">
              <select
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
              >
                <option value="">All Specialties</option>
                <option value="dentist">Dentist</option>
                <option value="cardiologist">Cardiologist</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="pediatrician">Pediatrician</option>
                <option value="orthopedic">Orthopedic</option>
              </select>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="providers-grid">
          {providers.length > 0 ? (
            providers.map(provider => (
              <div key={provider._id} className="provider-card">
                <div className="provider-info">
                  <h3>{provider.user?.name}</h3>
                  <p className="provider-specialty">{provider.specialty}</p>
                  <p className="provider-experience">
                    {provider.experience} years of experience
                  </p>
                  <div className="provider-rating">
                    <span>⭐ {provider.rating || 'New'}</span>
                  </div>
                </div>
                <div className="provider-actions">
                  <Link 
                    to={`/book-appointment/${provider._id}`} 
                    className="btn btn-primary"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No providers found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProviderList;
