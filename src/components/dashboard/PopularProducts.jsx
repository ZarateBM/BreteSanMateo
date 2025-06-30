import React from 'react';
import { motion } from 'framer-motion';

const PopularProducts = () => {
  const products = [
    { name: 'Smartphone XYZ', sales: 45 },
    { name: 'Laptop ABC', sales: 32 },
    { name: 'Auriculares DEF', sales: 28 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="card-gradient p-4 rounded-4"
    >
      <h5 className="text-white mb-4">Productos Populares</h5>
      <div className="space-y-3">
        {products.map(product => (
          <div key={product.name} className="d-flex align-items-center justify-content-between py-2">
            <span className="text-white">{product.name}</span>
            <span className="badge bg-primary">{product.sales} ventas</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PopularProducts;