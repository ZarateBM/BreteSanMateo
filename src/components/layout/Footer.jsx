
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {currentYear} Tu Brete San Mateo. Todos los derechos reservados.</p>
        <p className="text-sm mt-1">Conectando oportunidades en nuestra comunidad.</p>
      </div>
    </footer>
  );
};

export default Footer;
