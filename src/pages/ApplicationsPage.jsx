import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, User, Phone, Mail, Calendar, Briefcase, MessageSquare } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, contacted, rejected
  const { toast } = useToast();

  const fetchApplications = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          job_type,
          location,
          salary_min,
          salary_max,
          salary_currency
        )
      `)
      .eq('jobs.employer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las aplicaciones.',
        variant: 'destructive',
      });
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const updateApplicationStatus = async (applicationId, status) => {
    const { error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', applicationId);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la aplicación.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Estado actualizado',
        description: 'El estado de la aplicación se ha actualizado correctamente.',
        className: 'bg-green-500 text-white',
      });
      fetchApplications();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      contacted: { label: 'Contactado', className: 'bg-blue-100 text-blue-800' },
      rejected: { label: 'Rechazado', className: 'bg-red-100 text-red-800' },
      hired: { label: 'Contratado', className: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  return (
    <>
      <Helmet>
        <title>Aplicaciones - Tu Brete San Mateo</title>
      </Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Aplicaciones Recibidas</h1>
          <p className="text-lg text-gray-600">Gestiona las aplicaciones a tus ofertas de trabajo.</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
          >
            Todas ({applications.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            size="sm"
          >
            Pendientes ({applications.filter(app => app.status === 'pending' || !app.status).length})
          </Button>
          <Button
            variant={filter === 'contacted' ? 'default' : 'outline'}
            onClick={() => setFilter('contacted')}
            size="sm"
          >
            Contactados ({applications.filter(app => app.status === 'contacted').length})
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            onClick={() => setFilter('rejected')}
            size="sm"
          >
            Rechazados ({applications.filter(app => app.status === 'rejected').length})
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {application.applicant_name}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-1 text-primary font-medium">
                            <Briefcase className="h-4 w-4" />
                            Aplicó para: {application.jobs?.title}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(application.status || 'pending')}
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(application.created_at)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="font-medium">Teléfono:</span>
                          <a 
                            href={`tel:${application.applicant_phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {application.applicant_phone}
                          </a>
                        </div>
                        
                        {application.applicant_email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            <span className="font-medium">Email:</span>
                            <a 
                              href={`mailto:${application.applicant_email}`}
                              className="text-blue-600 hover:underline"
                            >
                              {application.applicant_email}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p><span className="font-medium">Puesto:</span> {application.jobs?.title}</p>
                        <p><span className="font-medium">Tipo:</span> {application.jobs?.job_type}</p>
                        <p><span className="font-medium">Ubicación:</span> {application.jobs?.location}</p>
                        {(application.jobs?.salary_min && application.jobs?.salary_max) && (
                          <p><span className="font-medium">Salario:</span> {(() => {
                            const currency = application.jobs.salary_currency === 'CRC' ? '₡' : '$';
                            const min = parseInt(application.jobs.salary_min).toLocaleString();
                            const max = parseInt(application.jobs.salary_max).toLocaleString();
                            return `${currency}${min} - ${currency}${max}`;
                          })()}</p>
                        )}
                      </div>
                    </div>

                    {application.applicant_message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-primary mt-1" />
                          <div>
                            <p className="font-medium text-sm">Mensaje del candidato:</p>
                            <p className="text-sm text-gray-700 mt-1">{application.applicant_message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      {(!application.status || application.status === 'pending') && (
                        <Button
                          size="sm"
                          onClick={() => updateApplicationStatus(application.id, 'contacted')}
                        >
                          Marcar como Contactado
                        </Button>
                      )}
                      
                      {application.status === 'contacted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          onClick={() => updateApplicationStatus(application.id, 'hired')}
                        >
                          Marcar como Contratado
                        </Button>
                      )}
                      
                      {(!application.status || application.status === 'pending' || application.status === 'contacted') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          Rechazar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-gray-100 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-800">No hay aplicaciones</h3>
            <p className="text-gray-600 mt-2">
              {filter === 'all' 
                ? 'Aún no has recibido aplicaciones a tus ofertas de trabajo.'
                : `No hay aplicaciones con el estado "${filter}".`
              }
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ApplicationsPage;
