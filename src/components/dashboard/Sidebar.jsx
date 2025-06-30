import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  ShoppingCart,
  Users,
  Settings
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, section, active, onClick }) => (
  <motion.li
    whileHover={{ x: 5 }}
    className="nav-item"
  >
    <button
      className={`nav-link w-100 text-start d-flex align-items-center ${active ? 'active' : ''}`}
      onClick={() => onClick(section)}
    >
      <Icon size={20} className="me-3" />
      {label}
    </button>
  </motion.li>
);

const Sidebar = ({ sidebarOpen, activeSection, handleSectionChange }) => {
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -250 },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate={sidebarOpen ? "open" : "closed"}
      transition={{ duration: 0.3 }}
      className="sidebar position-fixed d-lg-block"
      style={{ width: '250px', zIndex: 1000 }}
    >
      <div className="p-4">
        <div className="d-flex align-items-center mb-4">
          <ShoppingBag size={32} className="text-white me-3" />
          <h4 className="text-white mb-0 fw-bold">Dashboard</h4>
        </div>
        
        <nav>
          <ul className="nav flex-column">
            <SidebarItem 
              icon={TrendingUp} 
              label="Resumen" 
              section="overview"
              active={activeSection === 'overview'}
              onClick={handleSectionChange}
            />
            <SidebarItem 
              icon={Package} 
              label="Productos" 
              section="products"
              active={activeSection === 'products'}
              onClick={handleSectionChange}
            />
            <SidebarItem 
              icon={ShoppingCart} 
              label="Pedidos" 
              section="orders"
              active={activeSection === 'orders'}
              onClick={handleSectionChange}
            />
            <SidebarItem 
              icon={Users} 
              label="Clientes" 
              section="customers"
              active={activeSection === 'customers'}
              onClick={handleSectionChange}
            />
            <SidebarItem 
              icon={Settings} 
              label="Configuración" 
              section="settings"
              active={activeSection === 'settings'}
              onClick={handleSectionChange}
            />
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;