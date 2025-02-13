
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormHeader from './sql/FormHeader';
import ConnectionFields from './sql/ConnectionFields';
import DatabaseStats from './DatabaseStats';
import { sqlConnectionSchema, type SqlConnectionFormValues, type TableStats } from '@/types/sql-connection';
import { supabase } from '@/integrations/supabase/client';

const SqlConnectionForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [connectionData, setConnectionData] = useState<any>(null);

  const form = useForm<SqlConnectionFormValues>({
    resolver: zodResolver(sqlConnectionSchema),
    defaultValues: {
      server: '145.223.75.189',
      port: '1433',
      database: 'Taskmaster',
      username: 'sa',
      password: 'D3v3l0p3r2024$',
      useWindowsAuth: false,
    },
  });

  const onSubmit = async (data: SqlConnectionFormValues) => {
    setIsLoading(true);
    try {
      console.log('Enviando datos de conexión:', {
        ...data,
        password: '***********'
      });

      const { data: result, error } = await supabase.functions.invoke('sql-server-connection', {
        body: { 
          action: 'getTableStats',
          data: {
            server: data.server,
            port: data.port,
            database: data.database,
            username: data.username,
            password: data.password,
            useWindowsAuth: data.useWindowsAuth
          }
        }
      });

      if (error) throw error;

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido en la conexión');
      }

      setTableStats(result.data);
      setConnectionData(data);

      toast({
        title: 'Conexión exitosa',
        description: 'Se ha establecido la conexión con el servidor SQL.',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error al conectar:', error);
      toast({
        title: 'Error de conexión',
        description: error.message || 'No se pudo establecer la conexión con el servidor SQL.',
        variant: 'destructive',
        duration: 3000,
      });
      setTableStats([]);
      setConnectionData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Si hay datos de conexión, solo mostramos el tablero
  if (connectionData) {
    return <DatabaseStats stats={tableStats} connectionData={connectionData} />;
  }

  return (
    <Card className="w-full max-w-2xl p-8 space-y-8 bg-white/90 dark:bg-slate-900/90 border-0 shadow-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <FormHeader />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ConnectionFields form={form} />
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Conectando...' : 'Conectar'}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </Card>
  );
};

export default SqlConnectionForm;
