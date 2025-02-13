
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { validateCompanyData, formatValidationErrors } from '@/utils/validationUtils';
import { Company } from '@/types/company';
import * as z from "zod";
import { formSchema } from '@/pages/Companies';

interface UseCompanyFormProps {
  onOpenChange: (open: boolean) => void;
  editingCompany: Company | null;
  departamentos: any[];
  ciudades: any[];
}

export function useCompanyForm({ onOpenChange, editingCompany, departamentos, ciudades }: UseCompanyFormProps) {
  const queryClient = useQueryClient();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const companyData = {
        nit: values.nit,
        dv: values.dv.substring(0, 1),
        razon_social: values.razon_social,
        tipo_documento_id: parseInt(values.tipo_documento_id),
        numero_documento: values.numero_documento,
        tipo_contribuyente: values.tipo_contribuyente,
        direccion: values.direccion,
        direccion_principal: values.direccion,
        telefono: values.telefono,
        telefono_movil: values.telefono,
        email: values.email,
        correo_electronico: values.email,
        departamento_id: parseInt(values.departamento_id),
        departamento: departamentos.find(d => d.id === parseInt(values.departamento_id))?.nombre || '',
        ciudad_id: parseInt(values.ciudad_id),
        ciudad: ciudades.find(c => c.id === parseInt(values.ciudad_id))?.nombre || '',
        pais_id: 1,
        codigo_ciiu_id: parseInt(values.codigo_ciiu_id),
        actividad_comercial_id: parseInt(values.actividad_comercial_id),
        tipo_regimen_id: parseInt(values.tipo_regimen_id),
        municipio: values.municipio,
        master_detail: 'M',
        estado_empresa: 'Activo',
        naturaleza_empresa: 'Jurídica',
        tipo_empresa: 'Principal',
      };

      const validationErrors = validateCompanyData(companyData);
      if (validationErrors.length > 0) {
        toast({
          title: "Error de Validación",
          description: formatValidationErrors(validationErrors),
          variant: "destructive",
        });
        return;
      }

      console.log('Datos a enviar:', companyData);

      if (editingCompany) {
        const { error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('nit', values.nit);

        if (error) throw error;
        toast({
          title: "¡Actualización Exitosa!",
          description: "Los datos de la compañía han sido actualizados correctamente.",
        });
      } else {
        const { error } = await supabase
          .from('companies')
          .insert(companyData);

        if (error) throw error;
        toast({
          title: "¡Registro Exitoso!",
          description: "La compañía ha sido registrada correctamente en el sistema.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['companies'] });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error completo:', error);
      
      let errorDescription = error.message;
      
      if (error.message.includes('violates foreign key constraint')) {
        const fieldMatch = error.message.match(/companies_(\w+)_fkey/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          errorDescription = `Error en el campo ${fieldName}: La referencia seleccionada no es válida.`;
        }
      } else if (error.message.includes('value too long')) {
        const fieldMatch = error.message.match(/value too long for type character varying\(\d+\)/);
        if (fieldMatch) {
          const columnMatch = error.message.match(/column "([^"]+)"/);
          if (columnMatch) {
            const fieldName = columnMatch[1];
            errorDescription = `Error en el campo ${fieldName}: El valor ingresado es demasiado largo.`;
          }
        }
      }
      
      toast({
        title: "Error en el Proceso",
        description: errorDescription,
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
}
