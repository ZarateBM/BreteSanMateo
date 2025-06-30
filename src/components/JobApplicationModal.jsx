
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const JobApplicationModal = ({ isOpen, onClose, jobId, jobTitle }) => {
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_phone: '',
    applicant_message: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('applications').insert([
      { ...formData, job_id: jobId },
    ]);

    setLoading(false);

    if (error) {
      toast({
        title: 'Error al aplicar',
        description: 'Hubo un problema al enviar tu aplicación. Inténtalo de nuevo.',
        variant: 'destructive',
      });
      console.error('Error submitting application:', error);
    } else {
      toast({
        title: '¡Aplicación Enviada!',
        description: 'Tu información ha sido enviada al empleador. ¡Mucha suerte!',
        className: 'bg-green-500 text-white',
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aplicar a: {jobTitle}</DialogTitle>
          <DialogDescription>
            Completa tu información para que el empleador pueda contactarte.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label htmlFor="applicant_name">Nombre Completo</Label>
            <Input id="applicant_name" name="applicant_name" value={formData.applicant_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="applicant_phone">Número de Teléfono</Label>
            <Input id="applicant_phone" name="applicant_phone" value={formData.applicant_phone} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="applicant_message">Mensaje (Opcional)</Label>
            <Textarea id="applicant_message" name="applicant_message" value={formData.applicant_message} onChange={handleChange} placeholder="Puedes contar un poco sobre tu experiencia aquí." />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? 'Enviando...' : 'Enviar Aplicación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
