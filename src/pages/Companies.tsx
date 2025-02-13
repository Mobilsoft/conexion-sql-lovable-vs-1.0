
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { CompaniesTable } from '@/components/CompaniesTable';
import { useState } from 'react';
import { Company } from '@/types/company';
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

  const formFields: DynamicFormField[] = [
    { name: 'nit', type: 'text', required: true },
    { name: 'dv', type: 'text', required: true },
    { name: 'razon_social', type: 'text', required: true },
    { name: 'primer_apellido', type: 'text', required: false },
    { name: 'segundo_apellido', type: 'text', required: false },
    { name: 'primer_nombre', type: 'text', required: false },
    { name: 'segundo_nombre', type: 'text', required: false },
    { name: 'tipo_documento', type: 'text', required: true },
    { name: 'numero_documento', type: 'text', required: true },
    { name: 'tipo_empresa', type: 'text', required: true },
    { name: 'naturaleza_empresa', type: 'text', required: true },
    { name: 'codigo_ciuu', type: 'text', required: true },
    { name: 'descripcion_actividad', type: 'textarea', required: true },
    { name: 'fecha_constitucion', type: 'date', required: true },
    { name: 'direccion', type: 'text', required: true },
    { name: 'direccion_principal', type: 'text', required: true },
    { name: 'barrio', type: 'text', required: true },
    { name: 'ciudad', type: 'text', required: true },
    { name: 'municipio', type: 'text', required: true },
    { name: 'departamento', type: 'text', required: true },
    { name: 'pais', type: 'text', required: true },
    { name: 'telefono', type: 'text', required: true },
    { name: 'telefono_fijo', type: 'text', required: false },
    { name: 'telefono_movil', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'correo_electronico', type: 'email', required: true },
    { name: 'pagina_web', type: 'url', required: false },
    { name: 'tipo_contribuyente', type: 'text', required: true },
    { name: 'regimen_tributario', type: 'text', required: true },
    { name: 'responsabilidad_fiscal', type: 'text', required: true },
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
