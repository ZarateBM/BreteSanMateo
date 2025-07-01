import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import JobApplicationModal from '@/components/JobApplicationModal';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Building, Calendar, Clock, DollarSign, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const JobCard = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, profile } = useAuth();

  // Las empresas logueadas no deberían ver este componente, pero por seguridad
  // verificamos que no sea una empresa la que intenta aplicar
  const isCompany = user && profile;
  const isOwnJob = user && job.user_id === user.id;

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return `hace unos segundos`;
  };

  // Función para generar el rango salarial
  const getSalaryDisplay = () => {
    if (job.salary_min && job.salary_max) {
      const currency = job.salary_currency === 'CRC' ? '₡' : '$';
      const min = parseInt(job.salary_min).toLocaleString();
      const max = parseInt(job.salary_max).toLocaleString();
      return `${currency}${min} - ${currency}${max}`;
    }
    return 'A convenir';
  };

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-primary">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">{job.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-1 text-base">
            <Building className="h-4 w-4 text-gray-500" />
            {job.profiles?.company_name || 'Particular'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-3">
          <p className="text-gray-700">{job.description}</p>
          
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span className="font-semibold mr-1">Jornada:</span>
            <Badge variant="secondary">{job.job_type || 'No especificado'}</Badge>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 text-primary" />
            <span className="font-semibold mr-1">Salario:</span>
            <span>{getSalaryDisplay()}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span className="font-semibold mr-1">Ubicación:</span>
            <span>{job.location}</span>
          </div>

          {job.requirements && (
            <div className="flex items-start text-sm text-gray-600">
              <FileText className="h-4 w-4 mr-2 mt-1 text-primary flex-shrink-0" />
              <div>
                <span className="font-semibold">Requisitos:</span>
                <p className="pl-0 text-xs text-gray-500 whitespace-pre-line">{job.requirements}</p>
              </div>
            </div>
          )}

        </CardContent>
        <CardFooter className="flex-col items-stretch space-y-2">
          {!isCompany ? (
            <Button className="w-full" onClick={() => setIsModalOpen(true)}>
              Aplicar Ahora
            </Button>
          ) : (
            <Button className="w-full" disabled variant="outline">
              {isOwnJob ? 'Es tu publicación' : 'Solo para candidatos'}
            </Button>
          )}
          <div className="flex items-center text-xs text-gray-400 justify-center pt-2">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Publicado {timeAgo(job.created_at)}</span>
          </div>
        </CardFooter>
      </Card>
      {!isCompany && (
        <JobApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          jobId={job.id}
          jobTitle={job.title}
        />
      )}
    </>
  );
};

export default JobCard;