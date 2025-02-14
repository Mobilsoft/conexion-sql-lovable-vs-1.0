
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fetchSQLServerData = async (queryName: string) => {
  const { data, error } = await supabase.functions.invoke('sql-server-connection', {
    body: {
      action: queryName,
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
  if (!data.success) throw new Error(data.error || `Error al obtener ${queryName}`);
  
  return data.data;
};

export function useCompanyData() {
  const { data: codigosCIIU = [] } = useQuery({
    queryKey: ['codigos_ciiu_sql'],
    queryFn: () => fetchSQLServerData('getCodigosCIIU'),
  });

  const { data: actividadesComerciales = [] } = useQuery({
    queryKey: ['actividades_comerciales_sql'],
    queryFn: () => fetchSQLServerData('getActividadesComerciales'),
  });

  const { data: tiposRegimen = [] } = useQuery({
    queryKey: ['tipos_regimen_sql'],
    queryFn: () => fetchSQLServerData('getTiposRegimen'),
  });

  return {
    codigosCIIU,
    actividadesComerciales,
    tiposRegimen
  };
}
