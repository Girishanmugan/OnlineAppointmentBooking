// src/components/User/ProviderList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import Loading from '../Common/Loading';
import { providerService } from '../../services/providerService';
import { toast } from 'react-toastify';

const ProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    search: ''
  });
  const [specialties, setSpecialties] = useState([]);

  useEffect(() => {
    fetchProviders();
    fetchSpecialties();
  }, [filters]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await providerService.getProviders(filters);
      setProviders(response.data || []);
    } catch (error) {
      toast.error('Failed to load providers');
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await providerService.getSpecialties();
      setSpecialties(response.data || []);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      specialty: '',
      location: '',
      search: ''
    });
  };

  return (
    <Layout>
      <div className="providers-page">
        <div className="page-header">
          <h1>Find Healthcare Providers</h1>
          <p>Book appointments with qualified healthcare professionals</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="form-group">
              <label htmlFor="search">Search by name</label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Enter provider name..."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="specialty">Specialty</label>
              <select
                id="specialty"
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location..."
              />
            </div>

            <div className="filter-actions">
              <button onClick={resetFilters} className="btn btn-outline">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="results-section">
          {loading ? (
            <Loading />
          ) : providers.length > 0 ? (
            <>
              <div className="results-header">
                <p>{providers.length} provider{providers.length !== 1 ? 's' : ''} found</p>
              </div>
              <div className="providers-grid">
                {providers.map(provider => (
                  <div key={provider._id} className="provider-card">
                    <div className="provider-info">
                      <h3>{provider.user?.name}</h3>
                      <p className="specialty">{provider.specialty}</p>
                      <p className="experience">{provider.experience} years experience</p>
                      {provider.location && (
                        <p className="location">📍 {provider.location}</p>
                      )}
                      {provider.rating && (
                        <div className="rating">
                          ⭐ {provider.rating.toFixed(1)} ({provider.reviewCount} reviews)
                        </div>
                      )}
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
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h3>No providers found</h3>
              <p>Try adjusting your search criteria</p>
              <button onClick={resetFilters} className="btn btn-primary">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProviderList;
