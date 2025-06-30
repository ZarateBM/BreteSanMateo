import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, profile, setProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.company_name || '');
      setWebsite(profile.website || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updates = {
      id: user.id,
      company_name: companyName,
      website,
      updated_at: new Date(),
    };

    const { data, error } = await supabase.from('profiles').upsert(updates).select().single();

    if (error) {
      toast({ title: 'Error', description: 'No se pudo actualizar el perfil.', variant: 'destructive' });
    } else {
      setProfile(data);
      toast({ title: 'Éxito', description: 'Perfil actualizado correctamente.', className: 'bg-green-500 text-white' });
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Mi Perfil - Tu Brete San Mateo</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold">Perfil de la <span className="gradient-text">Empresa</span></h1>
          <p className="text-lg text-gray-600">Actualiza la información de tu empresa.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md border">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <Label>Correo Electrónico</Label>
              <Input type="email" value={user?.email || ''} disabled />
            </div>
            <div>
              <Label htmlFor="companyName">Nombre de la Empresa</Label>
              <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="website">Sitio Web (Opcional)</Label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://tuempresa.com" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </Button>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default ProfilePage;