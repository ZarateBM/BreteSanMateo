import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, Edit, Trash2, Eye, Users, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import EditJobModal from '@/components/EditJobModal';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    recentApplications: 0
  });
  const { toast } = useToast();

  const fetchJobs = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *, 
        applications ( 
          id,
          applicant_name,
          created_at
        )
      `)
      .eq('employer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      toast({ title: 'Error', description: 'No se pudieron cargar tus bretes.', variant: 'destructive' });
    } else {
      setJobs(data);
      
      // Calcular estadísticas
      const totalJobs = data.length;
      const activeJobs = data.filter(job => job.status === 'active').length;
      const totalApplications = data.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
      
      // Aplicaciones de los últimos 7 días
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentApplications = data.reduce((sum, job) => {
        const recentApps = job.applications?.filter(app => 
          new Date(app.created_at) > oneWeekAgo
        ) || [];
        return sum + recentApps.length;
      }, 0);

      setStats({
        totalJobs,
        activeJobs,
        totalApplications,
        recentApplications
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const deleteJob = async (jobId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta oferta de trabajo? Esta acción no se puede deshacer.')) {
      return;
    }

    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar el brete.', variant: 'destructive' });
    } else {
      toast({ title: 'Éxito', description: 'Brete eliminado correctamente.', className: 'bg-green-500 text-white' });
      fetchJobs();
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Activo', className: 'bg-green-100 text-green-800' },
      paused: { label: 'Pausado', className: 'bg-yellow-100 text-yellow-800' },
      closed: { label: 'Cerrado', className: 'bg-red-100 text-red-800' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Tu Brete San Mateo</title>
      </Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold">Dashboard de {profile?.company_name}</h1>
            <p className="text-lg text-gray-600">Gestiona tus ofertas de empleo y revisa estadísticas.</p>
          </div>
          <Link to="/post-job">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Publicar Nuevo Brete
            </Button>
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Empleos</p>
                  <p className="text-2xl font-bold text-primary">{stats.totalJobs}</p>
                </div>
                <Eye className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Empleos Activos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeJobs}</p>
                </div>
                <PlusCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Aplicaciones</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalApplications}</p>
                </div>
                <Link to="/applications">
                  <Users className="h-8 w-8 text-blue-600 hover:text-blue-700 cursor-pointer" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Últimos 7 días</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.recentApplications}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : jobs.length > 0 ? (
          <div className="space-y-8">
            {/* Acciones rápidas */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/post-job">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <PlusCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="font-medium">Publicar Nuevo Brete</p>
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/applications">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium">Ver Aplicaciones</p>
                      {stats.recentApplications > 0 && (
                        <Badge className="bg-red-100 text-red-800 mt-1">
                          {stats.recentApplications} nuevas
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
                
                <Link to="/profile">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium">Editar Perfil</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Tus Ofertas de Trabajo</h2>
              <div className="grid grid-cols-1 gap-6">
              {jobs.map((job, index) => (
                <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            {getStatusBadge(job.status)}
                          </div>
                          <CardDescription className="text-base">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {job.job_type}
                              </span>
                              {(job.salary_min && job.salary_max) && (
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {(() => {
                                    const currency = job.salary_currency === 'CRC' ? '₡' : '$';
                                    const min = parseInt(job.salary_min).toLocaleString();
                                    const max = parseInt(job.salary_max).toLocaleString();
                                    return `${currency}${min} - ${currency}${max}`;
                                  })()}
                                </span>
                              )}
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="py-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Aplicaciones</p>
                          <p className="text-lg font-bold text-primary">{job.applications?.length || 0}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Categoría</p>
                          <p className="text-gray-900">{job.category || 'No especificada'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Experiencia</p>
                          <p className="text-gray-900">{job.experience_level || 'No especificado'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Publicado</p>
                          <p className="text-gray-900">{formatDate(job.created_at)}</p>
                        </div>
                      </div>
                      
                      {job.description && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-3">
                      <div className="flex items-center text-xs text-gray-500">
                        {job.expires_at && (
                          <span>Expira: {formatDate(job.expires_at)}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditJob(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => deleteJob(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800">Aún no has publicado bretes</h3>
            <p className="text-gray-600 mt-2">¡Publica tu primera oferta para empezar a recibir candidatos!</p>
          </div>
        )}
      </motion.div>

      {/* Modal de Edición */}
      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingJob(null);
        }}
        job={editingJob}
        onJobUpdated={fetchJobs}
      />
    </>
  );
};

export default DashboardPage;