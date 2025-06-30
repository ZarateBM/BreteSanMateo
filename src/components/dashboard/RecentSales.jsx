import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit } from 'lucide-react';

const RecentSales = () => {
  const sales = [
    { id: '#001', client: 'Juan Pérez', product: 'Smartphone XYZ', total: '$599.99', status: 'Completado', statusClass: 'bg-success' },
    { id: '#002', client: 'María García', product: 'Laptop ABC', total: '$899.99', status: 'Pendiente', statusClass: 'bg-warning' },
    { id: '#003', client: 'Carlos López', product: 'Auriculares DEF', total: '$199.99', status: 'Enviado', statusClass: 'bg-info' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-gradient p-4 rounded-4"
    >
      <h5 className="text-white mb-4">Ventas Recientes</h5>
      <div className="table-responsive">
        <table className="table table-dark table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.id}</td>
                <td>{sale.client}</td>
                <td>{sale.product}</td>
                <td>{sale.total}</td>
                <td><span className={`badge ${sale.statusClass}`}>{sale.status}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline-light me-1">
                    <Eye size={14} />
                  </button>
                  <button className="btn btn-sm btn-outline-light">
                    <Edit size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RecentSales;