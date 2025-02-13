import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompaniesTable } from '@/components/CompaniesTable';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Company, CodigoCIIU, ActividadComercial, Pais, Departamento, Ciudad, TipoRegimenTributario, TipoDocumento } from '@/types/company';

const formSchema = z.object({
  nit: z.string().min(1, "El NIT es requerido"),
  dv: z.string().min(1, "El DV es requerido"),
  razon_social: z.string().min(1, "La razón social es requerida"),
  tipo_documento_id: z.string(),
  numero_documento: z.string(),
  tipo_contribuyente: z.string(),
  direccion: z.string(),
  telefono: z.string(),
  email: z.string().email("Email inválido"),
  // ... add other validations as needed
});

const Companies = () => {
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nit: "",
      dv: "",
      razon_social: "",
      tipo_documento_id: "",
      numero_documento: "",
      tipo_contribuyente: "",
      direccion: "",
      telefono: "",
      email: "",
      // ... add other default values
    },
  });

  // Query hooks
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
      const departamento = departamentos.find(d => d.id === parseInt(values.departamento_id))?.nombre || '';

      const companyData = {
        ...values,
        departamento,
        master_detail: 'M',
        tipo_documento_id: parseInt(values.tipo_documento_id),
        departamento_id: parseInt(values.departamento_id),
        ciudad_id: parseInt(values.ciudad_id),
        pais_id: parseInt(values.pais_id),
        codigo_ciiu_id: parseInt(values.codigo_ciiu_id),
        actividad_comercial_id: parseInt(values.actividad_comercial_id),
        tipo_regimen_id: parseInt(values.tipo_regimen_id),
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
                  isLoading={isLoading}
                />

                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCompany ? "Editar Compañía" : "Nueva Compañía"}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Información Básica</h2>
                            
                            <FormField
                              control={form.control}
                              name="tipo_contribuyente"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo de Contribuyente</FormLabel>
                                  <Select 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccione el tipo de contribuyente" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Responsable de IVA">Responsable de IVA</SelectItem>
                                      <SelectItem value="No Responsable de IVA">No Responsable de IVA</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="nit"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>NIT</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="dv"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>DV</FormLabel>
                                    <FormControl>
                                      <Input {...field} maxLength={1} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="razon_social"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Razón Social</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="direccion"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Dirección</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="space-y-4">
                            <h2 className="text-lg font-semibold">Información de Contacto</h2>
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="email" />
                                  </FormControl>
                                  <FormMessage />
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
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

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
