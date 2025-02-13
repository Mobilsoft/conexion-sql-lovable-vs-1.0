import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Company } from '@/types/company';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CompanyBasicInfo } from './CompanyBasicInfo';
import { CompanyCommercialInfo } from './CompanyCommercialInfo';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formSchema } from '@/pages/Companies';

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCompany: Company | null;
  ciudades: any[];
  departamentos: any[];
}

export function CompanyDialog({ 
  open, 
  onOpenChange, 
  editingCompany,
  ciudades,
  departamentos
}: CompanyDialogProps) {
  const queryClient = useQueryClient();

  const { data: codigosCIIU = [] } = useQuery({
    queryKey: ['codigos_ciiu'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('codigos_ciiu')
        .select('*')
        .order('codigo');
      if (error) throw error;
      return data;
    },
  });

  const { data: actividadesComerciales = [] } = useQuery({
    queryKey: ['actividades_comerciales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('actividades_comerciales')
        .select('*')
        .order('nombre');
      if (error) throw error;
      return data;
    },
  });

  const { data: tiposRegimen = [] } = useQuery({
    queryKey: ['tipos_regimen_tributario'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_regimen_tributario')
        .select('*')
        .order('nombre');
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editingCompany ? {
      tipo_documento_id: editingCompany.tipo_documento_id?.toString() || "",
      nit: editingCompany.nit || "",
      dv: editingCompany.dv || "",
      tipo_contribuyente: editingCompany.tipo_contribuyente || "",
      razon_social: editingCompany.razon_social || "",
      direccion: editingCompany.direccion || "",
      telefono: editingCompany.telefono || "",
      email: editingCompany.email || "",
      pais_id: editingCompany.pais_id?.toString() || "",
      departamento_id: editingCompany.departamento_id?.toString() || "",
      ciudad_id: editingCompany.ciudad_id?.toString() || "",
      codigo_ciiu_id: editingCompany.codigo_ciiu_id?.toString() || "",
      actividad_comercial_id: editingCompany.actividad_comercial_id?.toString() || "",
      tipo_regimen_id: editingCompany.tipo_regimen_id?.toString() || "",
      numero_documento: editingCompany.numero_documento || "",
      municipio: editingCompany.municipio || "",
    } : {
      tipo_documento_id: "",
      nit: "",
      dv: "",
      tipo_contribuyente: "",
      razon_social: "",
      direccion: "",
      telefono: "",
      email: "",
      pais_id: "",
      departamento_id: "",
      ciudad_id: "",
      codigo_ciiu_id: "",
      actividad_comercial_id: "",
      tipo_regimen_id: "",
      numero_documento: "",
      municipio: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        pais_id: 1, // Valor por defecto mientras no validamos
        codigo_ciiu_id: parseInt(values.codigo_ciiu_id),
        actividad_comercial_id: parseInt(values.actividad_comercial_id),
        tipo_regimen_id: parseInt(values.tipo_regimen_id),
        municipio: values.municipio,
        master_detail: 'M', // Cambiado a 'M' para empresas principales
        estado_empresa: 'Activo',
        naturaleza_empresa: 'Jurídica',
        tipo_empresa: 'Principal',
      };

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
      console.error('Detalles del error:', error.message);
      if (error.error) console.error('Error interno:', error.error);
      
      toast({
        title: "Error en el Proceso",
        description: `${error.message}. Por favor, verifique los datos e intente nuevamente.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingCompany ? "Editar Compañía" : "Nueva Compañía"}
          </DialogTitle>
          <DialogDescription>
            Completa los datos de la compañía para registrarla.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg">
                <AccordionTrigger className="px-4 bg-[#F2FCE2] hover:bg-[#E5F7D3] rounded-t-lg">
                  <span className="font-medium text-[#2E7D32]">Información Básica</span>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                  <CompanyBasicInfo 
                    form={form} 
                    ciudades={ciudades} 
                    departamentos={departamentos}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg">
                <AccordionTrigger className="px-4 bg-[#F2FCE2] hover:bg-[#E5F7D3] rounded-t-lg">
                  <span className="font-medium text-[#2E7D32]">Información Comercial</span>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-white">
                  <CompanyCommercialInfo 
                    form={form}
                    codigosCIIU={codigosCIIU}
                    actividadesComerciales={actividadesComerciales}
                    tiposRegimen={tiposRegimen}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingCompany ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
