
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast({
        title: "Iniciando proceso...",
        description: (
          <div className="w-full space-y-2">
            <p>Preparando datos para el envío</p>
            <Progress value={0} className="w-full" />
          </div>
        ),
        duration: 5000,
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

      toast({
        title: "Validando datos...",
        description: (
          <div className="w-full space-y-2">
            <p>Validando la información ingresada</p>
            <Progress value={25} className="w-full" />
          </div>
        ),
        duration: 5000,
      });

      const url = editingCompany 
        ? `http://localhost:3000/companies/${values.nit}`
        : 'http://localhost:3000/companies';

      const response = await fetch(url, {
        method: editingCompany ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      if (!response.ok) {
        throw new Error('Error al procesar la solicitud');
      }

      toast({
        title: editingCompany ? "¡Actualización Exitosa!" : "¡Registro Exitoso!",
        description: (
          <div className="w-full space-y-2">
            <p>{`La compañía ${companyData.razon_social} ha sido ${editingCompany ? 'actualizada' : 'registrada'} correctamente.`}</p>
            <Progress value={100} className="w-full" />
          </div>
        ),
        duration: 3000,
      });

      await queryClient.invalidateQueries({ queryKey: ['companies'] });
      onOpenChange(false);
      
    } catch (error: any) {
      console.error('Error completo:', error);
      
      toast({
        variant: "destructive",
        title: "Error en el Proceso",
        description: (
          <div className="w-full space-y-2">
            <p>{error.message}</p>
            <Progress value={100} className="w-full bg-red-200" />
          </div>
        ),
      });
    }
  };

  return { handleSubmit };
}
