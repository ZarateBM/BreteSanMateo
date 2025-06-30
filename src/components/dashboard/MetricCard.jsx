import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, icon: Icon, gradient, change }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="col-md-6 col-lg-3 mb-4"
  >
    <div className="metric-card p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className={`p-3 rounded-circle ${gradient}`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <span className="badge bg-success bg-opacity-20 text-success">
            +{change}%
          </span>
        )}
      </div>
      <h3 className="text-white fw-bold mb-1">{value.toLocaleString()}</h3>
      <p className="text-white-50 mb-0">{title}</p>
    </div>
  </motion.div>
);

export default MetricCard;