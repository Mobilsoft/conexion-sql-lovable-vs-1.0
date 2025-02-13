
/**
 * Companies.tsx
 * Main component for managing company data
 */

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CompaniesTable } from '@/components/CompaniesTable';
import { CompanyDialog } from '@/components/company/CompanyDialog';
import { toast } from '@/components/ui/use-toast';
import { Company } from '@/types/company';
import * as z from "zod";

export const formSchema = z.object({
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

      // Refetch companies after deletion
      await queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const { data: ciudades = [] } = useQuery({
    queryKey: ['ciudades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ciudades')
        .select('*')
        .order('nombre');
      if (error) throw error;
      return data;
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
      return data;
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

                <CompanyDialog
                  open={open}
                  onOpenChange={setOpen}
                  editingCompany={editingCompany}
                  ciudades={ciudades}
                  departamentos={departamentos}
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
