import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuickActions = () => {
  const { toast } = useToast();

  const showToast = (title) => {
    toast({
      title: `🚧 ${title}`,
      description: "¡Esta funcionalidad estará disponible pronto! 🚀",
      variant: "default",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card-gradient p-4 rounded-4 mb-4"
    >
      <h5 className="text-white mb-4">Acciones Rápidas</h5>
      <div className="d-grid gap-2">
        <button 
          className="btn btn-gradient-primary"
          onClick={() => showToast("Agregar Producto")}
        >
          <Plus size={16} className="me-2" />
          Agregar Producto
        </button>
        <button 
          className="btn btn-gradient-success"
          onClick={() => showToast("Ver Pedidos")}
        >
          <ShoppingCart size={16} className="me-2" />
          Ver Pedidos
        </button>
        <button 
          className="btn btn-gradient-warning"
          onClick={() => showToast("Gestionar Usuarios")}
        >
          <Users size={16} className="me-2" />
          Gestionar Usuarios
        </button>
      </div>
    </motion.div>
  );
};

export default QuickActions;