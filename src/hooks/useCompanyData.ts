
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCompanyData() {
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

  return {
    codigosCIIU,
    actividadesComerciales,
    tiposRegimen
  };
}
