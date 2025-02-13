
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validateCompanyData, formatValidationErrors } from '@/utils/validationUtils';
import { Company } from '@/types/company';
import * as z from "zod";
import { formSchema } from '@/pages/Companies';
import { Progress } from "@/components/ui/progress";

interface UseCompanyFormProps {
  onOpenChange: (open: boolean) => void;
  editingCompany: Company | null;
  departamentos: any[];
  ciudades: any[];
}

export function useCompanyForm({ onOpenChange, editingCompany, departamentos, ciudades }: UseCompanyFormProps) {
  const queryClient = useQueryClient();
  let toastInstance;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Toast inicial con progress
      toastInstance = toast({
        title: "Iniciando proceso...",
        description: (
          <div className="w-full space-y-2">
            <p>Preparando datos para el envío</p>
            <Progress value={0} className="w-full" />
          </div>
        ),
        duration: 100000,
      });

      const companyData = {
        nit: values.nit,
        dv: values.dv.substring(0, 1),
        razon_social: values.razon_social,
        tipo_documento_id: parseInt(values.tipo_documento_id),
        tipo_contribuyente: parseInt(values.tipo_contribuyente),
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

      console.log('Iniciando proceso de guardado con datos:', companyData);

      // Actualizar progress 25%
      toastInstance.update({
        title: "Validando datos...",
        description: (
          <div className="w-full space-y-2">
            <p>Validando la información ingresada</p>
            <Progress value={25} className="w-full" />
          </div>
        ),
        duration: 100000,
      });

      // Validar datos antes de enviar
      const validationErrors = await validateCompanyData(companyData);
      if (validationErrors.length > 0) {
        throw new Error(formatValidationErrors(validationErrors));
      }

      // Actualizar progress 50%
      toastInstance.update({
        title: "Enviando datos...",
        description: (
          <div className="w-full space-y-2">
            <p>Enviando información al servidor</p>
            <Progress value={50} className="w-full" />
          </div>
        ),
        duration: 100000,
      });

      // Enviar al servidor SQL Server
      const { data, error } = await supabase.functions.invoke('sql-server-connection', {
        body: {
          action: editingCompany ? 'updateCompany' : 'insertCompany',
          data: companyData
        }
      });

      if (error) throw error;

      console.log('Respuesta del servidor:', data);

      // Actualizar progress 75%
      toastInstance.update({
        title: "Procesando respuesta...",
        description: (
          <div className="w-full space-y-2">
            <p>Verificando respuesta del servidor</p>
            <Progress value={75} className="w-full" />
          </div>
        ),
        duration: 100000,
      });
      
      if (data.success) {
        // Progress 100% y mensaje de éxito
        toastInstance.update({
          title: editingCompany ? "¡Actualización Exitosa!" : "¡Registro Exitoso!",
          description: (
            <div className="w-full space-y-2">
              <p>{`La compañía ${companyData.razon_social} ha sido ${editingCompany ? 'actualizada' : 'registrada'} correctamente.`}</p>
              <Progress value={100} className="w-full" />
            </div>
          ),
          duration: 3000,
        });

        // Invalidar la consulta para refrescar la tabla
        await queryClient.invalidateQueries({ queryKey: ['companies'] });
        
        // Cerrar el diálogo y reiniciar el formulario
        onOpenChange(false);
      } else {
        throw new Error(data.error || 'Error al procesar la solicitud');
      }
      
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
      } else {
        errorDescription = error.message;
      }
      
      // Mostrar error con progress en rojo
      if (toastInstance) {
        toastInstance.update({
          variant: "destructive",
          title: "Error en el Proceso",
          description: (
            <div className="w-full space-y-2">
              <p>{errorDescription}</p>
              <Progress value={100} className="w-full bg-red-200" />
            </div>
          ),
          duration: null,
        });
      }
    }
  };

  return { handleSubmit };
}
