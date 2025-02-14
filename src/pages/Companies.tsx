
/**
 * Companies.tsx
 * Main component for managing company data
 */

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, Database } from 'lucide-react';
import { CompaniesTable } from '@/components/CompaniesTable';
import { CompanyDialog } from '@/components/company/CompanyDialog';
import { toast } from '@/components/ui/use-toast';
import { Company } from '@/types/company';
import * as z from "zod";

export const formSchema = z.object({
  tipo_documento_id: z.string(),
  nit: z.string().min(1, "El NIT es requerido"),
  dv: z.string().length(1, "El DV debe ser un solo dígito"),
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
  municipio: z.string().min(1, "El municipio es requerido")
});

const Companies = () => {
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const queryClient = useQueryClient();

  const handleDelete = async (nit: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sql-server-connection', {
        body: {
          action: 'deleteCompany',
          data: {
            server: '145.223.75.189',
            port: '1433',
            database: 'Taskmaster',
            username: 'sa',
            password: 'D3v3l0p3r2024$',
            nit: nit
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Compañía eliminada",
        description: "La compañía ha sido eliminada exitosamente.",
      });

      await queryClient.invalidateQueries({ queryKey: ['companies'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSeedData = async () => {
    try {
      toast({
        title: "Iniciando proceso",
        description: "Insertando datos de prueba...",
      });

      const { data, error } = await supabase.functions.invoke('sql-server-connection', {
        body: {
          action: 'seedTestData',
          data: {
            server: '145.223.75.189',
            port: '1433',
            database: 'Taskmaster',
            username: 'sa',
            password: 'D3v3l0p3r2024$'
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Éxito",
          description: "Los datos de prueba han sido insertados correctamente.",
        });
        
        // Refrescar todos los datos
        await queryClient.invalidateQueries();
      } else {
        throw new Error(data.error || 'Error al insertar datos de prueba');
      }
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
      const { data, error } = await supabase.functions.invoke('sql-server-connection', {
        body: {
          action: 'getCiudades',
          data: {
            server: '145.223.75.189',
            port: '1433',
            database: 'Taskmaster',
            username: 'sa',
            password: 'D3v3l0p3r2024$'
          }
        }
      });

      if (error) throw error;
      return data?.data || [];
    },
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('sql-server-connection', {
        body: {
          action: 'getDepartamentos',
          data: {
            server: '145.223.75.189',
            port: '1433',
            database: 'Taskmaster',
            username: 'sa',
            password: 'D3v3l0p3r2024$'
          }
        }
      });

      if (error) throw error;
      return data?.data || [];
    },
  });

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('sql-server-connection', {
        body: {
          action: 'getCompanies',
          data: {
            server: '145.223.75.189',
            port: '1433',
            database: 'Taskmaster',
            username: 'sa',
            password: 'D3v3l0p3r2024$'
          }
        }
      });

      if (error) {
        toast({
          title: "Error al cargar compañías",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data?.data || [];
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
              <div className="flex gap-2">
                <Button onClick={handleSeedData} size="sm" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Insertar Datos de Prueba
                </Button>
                <Button onClick={() => setOpen(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Compañía
                </Button>
              </div>
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
