
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  DollarSign, 
  Package, 
  ShoppingCart,
} from 'lucide-react';

import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentSales from '@/components/dashboard/RecentSales';
import QuickActions from '@/components/dashboard/QuickActions';
import PopularProducts from '@/components/dashboard/PopularProducts';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);
  const [activeSection, setActiveSection] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    totalVentas: 125430,
    totalUsuarios: 1250,
    totalProductos: 89,
    ventasHoy: 15,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    signOut();
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
    
    if (section !== 'overview') {
      toast({
        title: "🚧 Funcionalidad en desarrollo",
        description: "¡Esta sección estará disponible pronto! Puedes solicitarla en tu próximo prompt 🚀",
        variant: "default",
      });
    }
  };

  const renderContent = () => {
    if (activeSection === 'overview') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="text-white mb-4">Resumen General</h2>
            </div>
          </div>

          <div className="row">
            <MetricCard
              title="Ventas Totales"
              value={dashboardData.totalVentas}
              icon={DollarSign}
              gradient="btn-gradient-success"
              change={12}
            />
            <MetricCard
              title="Total Usuarios"
              value={dashboardData.totalUsuarios}
              icon={Users}
              gradient="btn-gradient-primary"
              change={8}
            />
            <MetricCard
              title="Productos"
              value={dashboardData.totalProductos}
              icon={Package}
              gradient="btn-gradient-warning"
              change={5}
            />
            <MetricCard
              title="Ventas Hoy"
              value={dashboardData.ventasHoy}
              icon={ShoppingCart}
              gradient="btn-gradient-secondary"
              change={25}
            />
          </div>

          <div className="row mt-5">
            <div className="col-lg-8 mb-4 mb-lg-0">
              <RecentSales />
            </div>
            <div className="col-lg-4">
              <QuickActions />
              <PopularProducts />
            </div>
          </div>
        </motion.div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white text-center p-5 card-gradient rounded-4"
      >
        <h2 className="text-capitalize">{activeSection}</h2>
        <p>Esta sección está en construcción.</p>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Panel de Administración Ecommerce</title>
        <meta name="description" content="Panel de control principal con métricas y gestión completa de tu ecommerce" />
      </Helmet>

      <div className="d-flex">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          activeSection={activeSection}
          handleSectionChange={handleSectionChange}
        />

        <div className="flex-grow-1" style={{ marginLeft: sidebarOpen && window.innerWidth >= 992 ? '250px' : '0', transition: 'margin-left 0.3s ease' }}>
          <DashboardHeader 
            user={user}
            handleLogout={handleLogout}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="p-4">
            {renderContent()}
          </main>
        </div>
      </div>

      {sidebarOpen && window.innerWidth < 992 && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 999 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Dashboard;
