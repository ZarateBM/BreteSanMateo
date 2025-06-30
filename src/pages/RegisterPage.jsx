import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, companyName);
    if (error) {
      toast({
        title: 'Error en el registro',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Registro exitoso!',
        description: 'Revisa tu correo para confirmar tu cuenta.',
        className: 'bg-green-500 text-white',
      });
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Registro de Empleador - Tu Brete San Mateo</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-2">
            Crea tu Cuenta de <span className="gradient-text">Empleador</span>
          </h1>
          <p className="text-lg text-gray-600">Publica bretes y encuentra al candidato ideal.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md border">
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <Label htmlFor="companyName">Nombre de la Empresa o Empleador</Label>
              <Input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>
          </form>
           <p className="text-center text-sm text-gray-600 mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default RegisterPage;