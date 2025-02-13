
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { CompaniesTable } from '@/components/CompaniesTable';
import { useState } from 'react';
import { Company, CodigoCIIU, ActividadComercial, Pais, Departamento, Ciudad, TipoRegimenTributario, TipoDocumento } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { DynamicForm } from '@/components/DynamicForm';
import { DynamicFormField } from '@/types/table-structure';

const Companies = () => {
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Consultas para obtener los datos de las tablas de referencia
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

  const formFields: DynamicFormField[] = [
    { name: 'nit', type: 'text', required: true },
    { name: 'dv', type: 'text', required: true },
    { name: 'razon_social', type: 'text', required: true },
    { name: 'primer_apellido', type: 'text', required: false },
    { name: 'segundo_apellido', type: 'text', required: false },
    { name: 'primer_nombre', type: 'text', required: false },
    { name: 'segundo_nombre', type: 'text', required: false },
    { 
      name: 'tipo_documento_id', 
      type: 'select', 
      required: true,
      options: tiposDocumento.map(td => ({ value: td.id.toString(), label: td.nombre }))
    },
    { name: 'numero_documento', type: 'text', required: true },
    { name: 'tipo_empresa', type: 'text', required: true },
    { name: 'naturaleza_empresa', type: 'text', required: true },
    { 
      name: 'codigo_ciiu_id', 
      type: 'select', 
      required: true,
      options: codigosCIIU.map(c => ({ value: c.id.toString(), label: `${c.codigo} - ${c.descripcion}` }))
    },
    { 
      name: 'actividad_comercial_id', 
      type: 'select', 
      required: true,
      options: actividadesComerciales.map(ac => ({ value: ac.id.toString(), label: ac.nombre }))
    },
    { name: 'descripcion_actividad', type: 'textarea', required: true },
    { name: 'fecha_constitucion', type: 'date', required: true },
    { name: 'direccion', type: 'text', required: true },
    { name: 'direccion_principal', type: 'text', required: true },
    { name: 'barrio', type: 'text', required: true },
    { 
      name: 'pais_id', 
      type: 'select', 
      required: true,
      options: paises.map(p => ({ value: p.id.toString(), label: p.nombre }))
    },
    { 
      name: 'departamento_id', 
      type: 'select', 
      required: true,
      options: departamentos.map(d => ({ value: d.id.toString(), label: d.nombre }))
    },
    { 
      name: 'ciudad_id', 
      type: 'select', 
      required: true,
      options: ciudades.map(c => ({ value: c.id.toString(), label: c.nombre }))
    },
    { name: 'municipio', type: 'text', required: true },
    { name: 'telefono', type: 'text', required: true },
    { name: 'telefono_fijo', type: 'text', required: false },
    { name: 'telefono_movil', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'correo_electronico', type: 'email', required: true },
    { name: 'pagina_web', type: 'url', required: false },
    { name: 'tipo_contribuyente', type: 'text', required: true },
    { 
      name: 'tipo_regimen_id', 
      type: 'select', 
      required: true,
      options: tiposRegimen.map(tr => ({ value: tr.id.toString(), label: tr.nombre }))
    },
    { name: 'responsabilidad_fiscal', type: 'text', required: true },
    { name: 'categoria', type: 'text', required: false },
    { name: 'tipo_permiso', type: 'text', required: false },
    { name: 'numero_permiso', type: 'text', required: false },
    { name: 'numero_matricula', type: 'text', required: false },
    { name: 'estado_empresa', type: 'text', required: false },
    { name: 'estado_dian', type: 'text', required: false },
    { name: 'sucursales', type: 'checkbox', required: false },
    { name: 'comentarios', type: 'textarea', required: false },
  ];

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

  const handleSave = async (company: Company) => {
    try {
      const companyData = {
        ...company,
        master_detail: 'M',
        fecha_actualizacion: new Date().toISOString(),
      };

      if (editingCompany) {
        const { error } = await supabase
          .from('companies')
          .update(companyData)
          .eq('nit', company.nit);

        if (error) throw error;

        toast({
          title: "Compañía actualizada",
          description: "Los datos de la compañía han sido actualizados exitosamente.",
        });
      } else {
        const { error } = await supabase
          .from('companies')
          .insert({
            ...companyData,
            fecha_creacion: new Date().toISOString(),
          });

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

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setOpen(true);
  };

  const handleDelete = async (nit: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('nit', nit);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "Compañía eliminada",
        description: "La compañía ha sido eliminada exitosamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingCompany(null);
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
                  onEdit={handleEdit} 
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />
                <DynamicForm 
                  open={open}
                  onOpenChange={handleOpenChange}
                  onSave={handleSave}
                  fields={formFields}
                  tableName="Compañía"
                  initialData={editingCompany}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Companies;
