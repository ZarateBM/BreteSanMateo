import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PostJobForm = () => {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: 'San Mateo',
    job_type: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'CRC',
    description: '',
    requirements: '',
    benefits: '',
    category: '',
    experience_level: '',
    expires_at: '',
    contact_email: '',
    contact_phone: '',
    is_remote: false,
    company_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Categorías de trabajo disponibles
  const jobCategories = [
    'Construcción',
    'Servicios',
    'Comercio',
    'Turismo',
    'Tecnología',
    'Salud',
    'Educación',
    'Agricultura',
    'Transporte',
    'Manufactura',
    'Gastronomía',
    'Limpieza',
    'Seguridad',
    'Otros'
  ];

  // Niveles de experiencia
  const experienceLevels = [
    'Sin experiencia',
    '1-2 años',
    '3-5 años',
    '5+ años',
    'Senior'
  ];

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    if (!formData.job_type) newErrors.job_type = 'El tipo de jornada es requerido';
    if (!formData.category) newErrors.category = 'La categoría es requerida';
    if (!formData.experience_level) newErrors.experience_level = 'El nivel de experiencia es requerido';
    
    if (formData.salary_min && formData.salary_max) {
      if (parseInt(formData.salary_min) >= parseInt(formData.salary_max)) {
        newErrors.salary = 'El salario mínimo debe ser menor al máximo';
      }
    }

    if (formData.expires_at) {
      const expirationDate = new Date(formData.expires_at);
      const today = new Date();
      if (expirationDate <= today) {
        newErrors.expires_at = 'La fecha de vencimiento debe ser en el futuro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Limpiar error cuando se modifique el campo
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  // Función para generar el rango salarial para mostrar
  const getSalaryDisplay = () => {
    if (formData.salary_min && formData.salary_max) {
      const currency = formData.salary_currency === 'CRC' ? '₡' : '$';
      const min = parseInt(formData.salary_min).toLocaleString();
      const max = parseInt(formData.salary_max).toLocaleString();
      return `${currency}${min} - ${currency}${max}`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({ 
        title: 'Error en el formulario', 
        description: 'Por favor corrige los errores antes de continuar.', 
        variant: 'destructive' 
      });
      return;
    }

    if (!user) {
      toast({ title: 'Error', description: 'Debes iniciar sesión para publicar.', variant: 'destructive' });
      return;
    }
    
    setLoading(true);

    // Preparar datos para insertar
    const jobData = {
      ...formData,
      employer_id: user.id,
      company_name: profile?.company_name || 'Empresa',
      status: 'active',
      created_at: new Date().toISOString(),
    };

    // Si no se especifica fecha de expiración, establecer 30 días por defecto
    if (!jobData.expires_at) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      jobData.expires_at = expirationDate.toISOString();
    }

    const { error } = await supabase.from('jobs').insert([jobData]);

    setLoading(false);

    if (error) {
      toast({
        title: 'Error al publicar',
        description: 'Hubo un problema al crear la oferta. Inténtalo de nuevo.',
        variant: 'destructive',
      });
      console.error('Error posting job:', error);
    } else {
      toast({
        title: '¡Éxito!',
        description: 'Tu oferta de trabajo ha sido publicada exitosamente.',
        className: 'bg-green-500 text-white',
      });
      navigate('/dashboard');
    }
  };

  const JobPreview = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{formData.title || 'Título del Trabajo'}</CardTitle>
        <CardDescription className="text-lg">
          {profile?.company_name || 'Tu Empresa'} • {formData.location} • {formData.job_type}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {getSalaryDisplay() && (
          <div>
            <h4 className="font-semibold">Salario:</h4>
            <p>{getSalaryDisplay()}</p>
          </div>
        )}
        
        {formData.description && (
          <div>
            <h4 className="font-semibold">Descripción:</h4>
            <p className="whitespace-pre-line">{formData.description}</p>
          </div>
        )}
        
        {formData.requirements && (
          <div>
            <h4 className="font-semibold">Requisitos:</h4>
            <p className="whitespace-pre-line">{formData.requirements}</p>
          </div>
        )}
        
        {formData.benefits && (
          <div>
            <h4 className="font-semibold">Beneficios:</h4>
            <p className="whitespace-pre-line">{formData.benefits}</p>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {formData.category && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{formData.category}</span>}
          {formData.experience_level && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">{formData.experience_level}</span>}
          {formData.is_remote && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">Trabajo Remoto</span>}
        </div>
      </CardContent>
    </Card>
  );

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Vista Previa de la Oferta</h2>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Editar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {loading ? 'Publicando...' : 'Confirmar y Publicar'}
            </Button>
          </div>
        </div>
        <JobPreview />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progreso del formulario */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <div className={`h-1 w-16 ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
            3
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paso 1: Información Básica */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Información Básica del Empleo</CardTitle>
              <CardDescription>Completa los datos fundamentales de la oferta de trabajo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Título del Puesto *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Ej: Obrero de construcción, Vendedor, Cocinero..." 
                  required 
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category">Categoría *</Label>
                  <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="job_type">Tipo de Jornada *</Label>
                  <Select onValueChange={(value) => handleSelectChange('job_type', value)} value={formData.job_type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una jornada" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tiempo Completo">Tiempo Completo</SelectItem>
                      <SelectItem value="Medio Tiempo">Medio Tiempo</SelectItem>
                      <SelectItem value="Por Horas">Por Horas</SelectItem>
                      <SelectItem value="Temporal">Temporal</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.job_type && <p className="text-sm text-red-500 mt-1">{errors.job_type}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="Ciudad, provincia" 
                    required 
                  />
                </div>

                <div>
                  <Label htmlFor="experience_level">Nivel de Experiencia *</Label>
                  <Select onValueChange={(value) => handleSelectChange('experience_level', value)} value={formData.experience_level}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.experience_level && <p className="text-sm text-red-500 mt-1">{errors.experience_level}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_remote"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="is_remote">Este trabajo se puede realizar de forma remota</Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paso 2: Detalles del Trabajo */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Trabajo</CardTitle>
              <CardDescription>Describe las responsabilidades y requisitos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="description">Descripción del Trabajo *</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Describe las responsabilidades principales, el ambiente de trabajo, horarios, etc." 
                  rows={5}
                  required 
                />
                {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="requirements">Requisitos del Puesto</Label>
                <Textarea 
                  id="requirements" 
                  name="requirements" 
                  value={formData.requirements} 
                  onChange={handleChange} 
                  placeholder="Lista de habilidades, experiencia, certificaciones o herramientas necesarias." 
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="benefits">Beneficios Ofrecidos</Label>
                <Textarea 
                  id="benefits" 
                  name="benefits" 
                  value={formData.benefits} 
                  onChange={handleChange} 
                  placeholder="Seguro médico, bonificaciones, capacitaciones, etc." 
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="company_description">Descripción de la Empresa</Label>
                <Textarea 
                  id="company_description" 
                  name="company_description" 
                  value={formData.company_description} 
                  onChange={handleChange} 
                  placeholder="Cuéntanos sobre tu empresa, su misión y ambiente laboral." 
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Paso 3: Salario y Contacto */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Salario y Información de Contacto</CardTitle>
              <CardDescription>Completa los detalles finales de la oferta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Rango Salarial</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salary_min">Salario Mínimo</Label>
                    <Input 
                      id="salary_min" 
                      name="salary_min" 
                      type="number" 
                      value={formData.salary_min} 
                      onChange={handleChange}
                      placeholder="350000" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_max">Salario Máximo</Label>
                    <Input 
                      id="salary_max" 
                      name="salary_max" 
                      type="number" 
                      value={formData.salary_max} 
                      onChange={handleChange}
                      placeholder="450000" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_currency">Moneda</Label>
                    <Select onValueChange={(value) => handleSelectChange('salary_currency', value)} value={formData.salary_currency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRC">Colones (₡)</SelectItem>
                        <SelectItem value="USD">Dólares ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {getSalaryDisplay() && (
                  <p className="text-sm text-gray-600 mt-2">Vista previa: {getSalaryDisplay()}</p>
                )}
                {errors.salary && <p className="text-sm text-red-500 mt-1">{errors.salary}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact_email">Email de Contacto</Label>
                  <Input 
                    id="contact_email" 
                    name="contact_email" 
                    type="email" 
                    value={formData.contact_email} 
                    onChange={handleChange} 
                    placeholder={user?.email || "contacto@empresa.com"} 
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                  <Input 
                    id="contact_phone" 
                    name="contact_phone" 
                    type="tel" 
                    value={formData.contact_phone} 
                    onChange={handleChange} 
                    placeholder="8888-8888" 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expires_at">Fecha de Vencimiento (Opcional)</Label>
                <Input 
                  id="expires_at" 
                  name="expires_at" 
                  type="date" 
                  value={formData.expires_at} 
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-sm text-gray-500 mt-1">Si no especificas una fecha, la oferta expirará en 30 días</p>
                {errors.expires_at && <p className="text-sm text-red-500 mt-1">{errors.expires_at}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between items-center pt-6">
          {currentStep > 1 && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Anterior
            </Button>
          )}
          
          {currentStep < 3 ? (
            <Button 
              type="button" 
              onClick={() => setCurrentStep(prev => prev + 1)}
              className={currentStep === 1 ? 'ml-auto' : ''}
            >
              Siguiente
            </Button>
          ) : (
            <div className="flex gap-2 ml-auto">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPreview(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Vista Previa
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {loading ? 'Publicando...' : 'Publicar Brete'}
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostJobForm;