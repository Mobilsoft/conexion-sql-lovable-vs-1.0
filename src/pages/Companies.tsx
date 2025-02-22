
import { useState } from "react";
import { CompaniesTable } from "@/components/CompaniesTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { CompanyDialog } from "@/components/company/CompanyDialog";
import { Company, CompanyFormData } from "@/types/company";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const formSchema = z.object({
  tipo_documento_id: z.string(),
  nit: z.string(),
  dv: z.string(),
  tipo_contribuyente: z.string(),
  razon_social: z.string(),
  direccion: z.string(),
  telefono: z.string(),
  email: z.string(),
  pais_id: z.string(),
  departamento_id: z.string(),
  ciudad_id: z.string(),
  codigo_ciiu_id: z.string(),
  actividad_comercial_id: z.string(),
  tipo_regimen_id: z.string(),
  municipio: z.string(),
  tabla_master: z.string().default('D'),
});

export default function Companies() {
  const [open, setOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('fecha_creacion', { ascending: false });
      if (error) throw error;
      return data as Company[];
    },
  });

  const { data: ciudades = [] } = useQuery({
    queryKey: ['ciudades'],
    queryFn: async () => {
      const { data, error } = await supabase.from('ciudades').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => {
      const { data, error } = await supabase.from('departamentos').select('*');
      if (error) throw error;
      return data;
    },
  });

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

      toast({
        title: "Compañía eliminada",
        description: "La compañía ha sido eliminada exitosamente.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Compañías</h2>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Compañía
        </Button>
      </div>

      <CompaniesTable
        companies={companies}
        onEdit={handleEdit}
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
  );
}
