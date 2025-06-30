
import React from 'react';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DashboardHeader = ({ user, handleLogout, sidebarOpen, setSidebarOpen }) => {
  const { toast } = useToast();

  return (
    <header className="dashboard-header p-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-white d-lg-none p-0 me-3"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-white mb-0 h4">
            Bienvenido, {user?.email || 'Administrador'}
          </h1>
        </div>
        
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-link text-white me-3 p-2"
            onClick={() => toast({
              title: "🚧 Notificaciones",
              description: "¡Esta funcionalidad estará disponible pronto! 🚀",
              variant: "default",
            })}
          >
            <Bell size={20} />
          </button>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            <LogOut size={16} className="me-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
