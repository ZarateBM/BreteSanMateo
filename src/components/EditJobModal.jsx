import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const EditJobModal = ({ isOpen, onClose, job, onJobUpdated }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    location: job?.location || '',
    job_type: job?.job_type || '',
    salary_min: job?.salary_min || '',
    salary_max: job?.salary_max || '',
    salary_currency: job?.salary_currency || 'CRC',
    description: job?.description || '',
    requirements: job?.requirements || '',
    benefits: job?.benefits || '',
    category: job?.category || '',
    experience_level: job?.experience_level || '',
    contact_email: job?.contact_email || '',
    contact_phone: job?.contact_phone || '',
    is_remote: job?.is_remote || false,
    status: job?.status || 'active',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const jobCategories = [
    'Construcción', 'Servicios', 'Comercio', 'Turismo', 'Tecnología',
    'Salud', 'Educación', 'Agricultura', 'Transporte', 'Manufactura',
    'Gastronomía', 'Limpieza', 'Seguridad', 'Otros'
  ];

  const experienceLevels = [
    'Sin experiencia', '1-2 años', '3-5 años', '5+ años', 'Senior'
  ];

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'paused', label: 'Pausado' },
    { value: 'closed', label: 'Cerrado' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('jobs')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    setLoading(false);

    if (error) {
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo actualizar la oferta de trabajo.',
        variant: 'destructive',
      });
      console.error('Error updating job:', error);
    } else {
      toast({
        title: 'Empleo actualizado',
        description: 'Los cambios se han guardado correctamente.',
        className: 'bg-green-500 text-white',
      });
      onJobUpdated();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Oferta de Trabajo</DialogTitle>
          <DialogDescription>
            Modifica los detalles de tu oferta de trabajo publicada.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Título del Puesto</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="job_type">Tipo de Jornada</Label>
              <Select onValueChange={(value) => handleSelectChange('job_type', value)} value={formData.job_type}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona jornada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tiempo Completo">Tiempo Completo</SelectItem>
                  <SelectItem value="Medio Tiempo">Medio Tiempo</SelectItem>
                  <SelectItem value="Por Horas">Por Horas</SelectItem>
                  <SelectItem value="Temporal">Temporal</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <Label htmlFor="experience_level">Experiencia</Label>
              <Select onValueChange={(value) => handleSelectChange('experience_level', value)} value={formData.experience_level}>
                <SelectTrigger>
                  <SelectValue placeholder="Nivel de experiencia" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label>Rango Salarial</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Input 
                    name="salary_min" 
                    value={formData.salary_min} 
                    onChange={handleChange} 
                    placeholder="Salario mínimo"
                    type="number"
                  />
                </div>
                <div>
                  <Input 
                    name="salary_max" 
                    value={formData.salary_max} 
                    onChange={handleChange} 
                    placeholder="Salario máximo"
                    type="number"
                  />
                </div>
                <div>
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
            </div>

            <div>
              <Label htmlFor="status">Estado de la Oferta</Label>
              <Select onValueChange={(value) => handleSelectChange('status', value)} value={formData.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3}
                required 
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="requirements">Requisitos</Label>
              <Textarea 
                id="requirements" 
                name="requirements" 
                value={formData.requirements} 
                onChange={handleChange} 
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="benefits">Beneficios</Label>
              <Textarea 
                id="benefits" 
                name="benefits" 
                value={formData.benefits} 
                onChange={handleChange} 
                rows={2}
                placeholder="Seguro médico, bonificaciones, etc."
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Email de Contacto</Label>
              <Input 
                id="contact_email" 
                name="contact_email" 
                type="email"
                value={formData.contact_email} 
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Teléfono</Label>
              <Input 
                id="contact_phone" 
                name="contact_phone" 
                value={formData.contact_phone} 
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_remote"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleChange}
                  className="rounded"
                />
                <Label htmlFor="is_remote">Trabajo remoto disponible</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobModal;
