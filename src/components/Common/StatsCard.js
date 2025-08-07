// src/components/Common/StatsCard.js
import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, trend, loading }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
  };

  if (loading) {
    return (
      <div className="stats-card loading">
        <div className="stat-skeleton">
          <div className="skeleton-icon"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-value"></div>
            <div className="skeleton-trend"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="stats-card"
      whileHover={{ scale: 1.02, translateY: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`stat-icon bg-gradient-to-r ${colorClasses[color]}`}>
        <span>{icon}</span>
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        <p className="stat-trend">{trend}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
