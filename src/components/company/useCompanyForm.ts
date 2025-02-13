
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast'; // Corregido el import del toast
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
      // Mostrar mensaje de guardando
      toast({
        title: "Guardando...",
        description: "Por favor espere mientras se guardan los datos.",
      });

      const companyData = {
        nit: values.nit,
        dv: values.dv.substring(0, 1),
        razon_social: values.razon_social,
        tipo_documento_id: parseInt(values.tipo_documento_id),
        tipo_contribuyente: parseInt(values.tipo_contribuyente), // Convertir a número
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

      console.log('Datos a validar:', companyData);

      const validationErrors = await validateCompanyData(companyData);
      if (validationErrors.length > 0) {
        console.log('Errores de validación:', validationErrors);
        toast({
          variant: "destructive",
          title: "Error de Validación",
          description: formatValidationErrors(validationErrors),
        });
        return;
      }

      console.log('Iniciando operación de guardado...');
      let result;
      
      if (editingCompany) {
        result = await supabase
          .from('companies')
          .update(companyData)
          .eq('nit', values.nit);

        if (result.error) throw result.error;
        
        console.log('Compañía actualizada:', result.data);
        toast({
          title: "¡Actualización Exitosa!",
          description: `La compañía ${companyData.razon_social} ha sido actualizada correctamente.`,
        });
      } else {
        result = await supabase
          .from('companies')
          .insert(companyData)
          .select()
          .single();

        if (result.error) throw result.error;
        
        console.log('Compañía creada:', result.data);
        toast({
          title: "¡Registro Exitoso!",
          description: `La compañía ${companyData.razon_social} ha sido registrada correctamente.`,
        });
      }

      // Invalidar la consulta para refrescar la tabla
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
      
      // Cerrar el diálogo y reiniciar el formulario
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Error completo:', error);
      
      let errorDescription = "Ha ocurrido un error al procesar la solicitud.";
      
      if (error.message.includes('violates foreign key constraint')) {
        const fieldMatch = error.message.match(/companies_(\w+)_fkey/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          errorDescription = `Error en el campo ${fieldName}: La referencia seleccionada no es válida.`;
        }
      } else if (error.message.includes('value too long')) {
        const columnMatch = error.message.match(/column "([^"]+)"/);
        if (columnMatch) {
          const fieldName = columnMatch[1];
          errorDescription = `Error en el campo ${fieldName}: El valor ingresado es demasiado largo.`;
        }
      } else if (error.message.includes('duplicate key')) {
        errorDescription = "Ya existe una compañía con este NIT en el sistema.";
      }
      
      toast({
        variant: "destructive",
        title: "Error en el Proceso",
        description: errorDescription,
      });
    }
  };

  return { handleSubmit };
}
