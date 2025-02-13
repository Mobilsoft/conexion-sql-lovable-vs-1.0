/**
 * Companies.tsx
 * Main component for managing company data
 */

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { CompaniesTable } from '@/components/CompaniesTable';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateDV } from '@/utils/dvCalculator';
import { 
  Company, 
  TipoDocumento, 
  CodigoCIIU, 
  ActividadComercial, 
  Pais, 
  Departamento, 
  Ciudad, 
  TipoRegimenTributario 
} from '@/types/company';

const formSchema = z.object({
  tipo_documento_id: z.string(),
  nit: z.string().min(1, "El NIT es requerido"),
  dv: z.string().min(1, "El DV es requerido"),
  tipo_contribuyente: z.string(),
  razon_social: z.string().min(1, "La razón social es requerida"),
  direccion: z.string(),
  telefono: z.string(),
  email: z.string().email("Email inválido"),
  pais_id: z.string(),
  departamento_id: z.string(),
  ciudad_id: z.string(),
  codigo_ciiu_id: z.string(),
  actividad_comercial_id: z.string(),
  tipo_regimen_id: z.string(),
  numero_documento: z.string(),
  municipio: z.string(),
});

const Companies = () => {
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  // Watch for NIT changes to calculate DV
  const watchNit = form.watch("nit");
  const watchTipoDocumento = form.watch("tipo_documento_id");
  const watchCiudadId = form.watch("ciudad_id");

  useEffect(() => {
    if (watchTipoDocumento === "2" && watchNit) { // Assuming 2 is the ID for NIT
      const calculatedDV = calculateDV(watchNit);
      form.setValue("dv", calculatedDV);
    }
  }, [watchNit, watchTipoDocumento]);

  // Update departamento and país when ciudad changes
  useEffect(() => {
    if (watchCiudadId) {
      const ciudad = ciudades.find(c => c.id === parseInt(watchCiudadId));
      if (ciudad) {
        const departamento = departamentos.find(d => d.id === ciudad.departamento_id);
        if (departamento) {
          form.setValue("departamento_id", departamento.id.toString());
          if (departamento.pais_id) {
            form.setValue("pais_id", departamento.pais_id.toString());
          }
        }
      }
    }
  }, [watchCiudadId]);

  const handleDelete = async (nit: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('nit', nit);

      if (error) throw error;

      toast({
        title: "Compañía eliminada",
        description: "La compañía ha sido eliminada exitosamente.",
      });

      queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const { data: tiposDocumento = [] } = useQuery({
    queryKey: ['tipos_documento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tipos_documento')
        .select('*')
        .order('nombre');
      if (error) throw error;
      return data as TipoDocumento[];
    },
  });

  const { data: codigosCIIU = [] } = useQuery({
    queryKey: ['codigos_ciiu'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('codigos_ciiu')
        .select('*')
        .order('codigo');
      if (error) throw error;
      return data as CodigoCIIU[];
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
      return data as ActividadComercial[];
    },
  });

  const { data: paises = [] } = useQuery({
    queryKey: ['paises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('paises')
        .select('*')
        .order('nombre');
      if (error) throw error;
      return data as Pais[];
    },
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departamentos')
        .select('*')
        .order('nombre');
      if (error) throw error;
      return data as Departamento[];
    },
  });

  const { data: ciudades = [] } = useQuery({
    queryKey: ['ciudades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ciudades')
        .select('*')
        .order('nombre');
      if (error) throw error;
      return data as Ciudad[];
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
      return data as TipoRegimenTributario[];
    },
  });

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('master_detail', 'M')
        .order('fecha_creacion', { ascending: false });

      if (error) {
        toast({
          title: "Error al cargar compañías",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const companyData = {
        nit: values.nit,
        dv: values.dv,
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
        pais_id: parseInt(values.pais_id),
        codigo_ciiu_id: parseInt(values.codigo_ciiu_id),
        actividad_comercial_id: parseInt(values.actividad_comercial_id),
        tipo_regimen_id: parseInt(values.tipo_regimen_id),
        municipio: values.municipio,
        master_detail: 'M',
        estado_empresa: 'Activo',
        naturaleza_empresa: 'Jurídica',
        tipo_empresa: 'Principal',
      };

      if (editingCompany) {
        const { error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('nit', values.nit);

        if (error) throw error;
        toast({
          title: "Compañía actualizada",
          description: "Los datos de la compañía han sido actualizados exitosamente.",
        });
      } else {
        const { error } = await supabase
          .from('companies')
          .insert(companyData);

        if (error) throw error;
        toast({
          title: "Compañía registrada",
          description: "La compañía ha sido registrada exitosamente.",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setEditingCompany(null);
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <SidebarTrigger />
                <h1 className="ml-4 text-xl font-semibold">Registro de Compañías</h1>
              </div>
              <Button onClick={() => setOpen(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Compañía
              </Button>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                <CompaniesTable 
                  companies={companies}
                  onEdit={setEditingCompany}
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />

                <Dialog open={open} onOpenChange={setOpen}>
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
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          <AccordionItem value="item-1" className="border rounded-lg bg-gray-50/30">
                            <AccordionTrigger className="px-4">Información Básica</AccordionTrigger>
                            <AccordionContent className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <FormField
                                  control={form.control}
                                  name="tipo_documento_id"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                      <FormLabel>Tipo de Documento</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione tipo" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {tiposDocumento.map((tipo) => (
                                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                              {tipo.nombre}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="nit"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-3">
                                      <FormLabel>NIT</FormLabel>
                                      <FormControl>
                                        <Input {...field} maxLength={15} placeholder="Máximo 15 dígitos" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="dv"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                      <FormLabel>DV</FormLabel>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          disabled={watchTipoDocumento !== "2"}
                                          maxLength={1}
                                          placeholder="1 dígito"
                                          className="w-full"
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="tipo_contribuyente"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-4">
                                      <FormLabel>Tipo de Contribuyente</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione tipo" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="Responsable de IVA">Responsable de IVA</SelectItem>
                                          <SelectItem value="No Responsable de IVA">No Responsable de IVA</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="razon_social"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-6">
                                      <FormLabel>Razón Social</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="direccion"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-6">
                                      <FormLabel>Dirección Comercial</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="telefono"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Teléfono</FormLabel>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem className="md:col-span-6">
                                      <FormLabel>Correo Electrónico</FormLabel>
                                      <FormControl>
                                        <Input {...field} type="email" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="ciudad_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Ciudad</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione ciudad" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {ciudades.map((ciudad) => (
                                            <SelectItem key={ciudad.id} value={ciudad.id.toString()}>
                                              {ciudad.nombre}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="departamento_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Departamento</FormLabel>
                                      <FormControl>
                                        <Input {...field} disabled />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="pais_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>País</FormLabel>
                                      <FormControl>
                                        <Input {...field} disabled />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>

                          <AccordionItem value="item-2" className="border rounded-lg bg-gray-50/30">
                            <AccordionTrigger className="px-4">Información Tributaria</AccordionTrigger>
                            <AccordionContent className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="codigo_ciiu_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Código CIIU</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione código CIIU" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {codigosCIIU.map((ciiu) => (
                                            <SelectItem key={ciiu.id} value={ciiu.id.toString()}>
                                              {ciiu.codigo} - {ciiu.descripcion}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="actividad_comercial_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Actividad Comercial</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione actividad" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {actividadesComerciales.map((actividad) => (
                                            <SelectItem key={actividad.id} value={actividad.id.toString()}>
                                              {actividad.nombre}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="tipo_regimen_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Tipo de Régimen Tributario</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Seleccione régimen" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          {tiposRegimen.map((tipo) => (
                                            <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                              {tipo.nombre}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Companies;
