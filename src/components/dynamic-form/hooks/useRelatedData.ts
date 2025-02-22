
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRelatedData = () => {
  const { data: tiposDocumento = [] } = useQuery({
    queryKey: ['tipos_documento'],
    queryFn: async () => {
      const { data } = await supabase.from('tipos_documento').select('*');
      return data || [];
    }
  });

  const { data: ciudades = [] } = useQuery({
    queryKey: ['ciudades'],
    queryFn: async () => {
      const { data } = await supabase
        .from('ciudades')
        .select(`
          id,
          nombre,
          departamento:departamentos (
            id,
            nombre
          )
        `);
      return data || [];
    }
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos'],
    queryFn: async () => {
      const { data } = await supabase.from('departamentos').select('*');
      return data || [];
    }
  });

  const { data: tiposRegimen = [] } = useQuery({
    queryKey: ['tipos_regimen'],
    queryFn: async () => {
      const { data } = await supabase.from('tipos_regimen_tributario').select('*');
      return data || [];
    }
  });

  const { data: actividadesComerciales = [] } = useQuery({
    queryKey: ['actividades_comerciales'],
    queryFn: async () => {
      const { data } = await supabase.from('actividades_comerciales').select('*');
      return data || [];
    }
  });

  return {
    tiposDocumento,
    ciudades,
    departamentos,
    tiposRegimen,
    actividadesComerciales,
  };
};
