
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
import axios from 'axios';

const SqlConnectionForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tableStats, setTableStats] = useState<TableStats[]>([]);

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

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiUrl}/api/table-stats`, data);
      console.log('Respuesta recibida:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.error || 'Error desconocido en la conexión');
      }

      setTableStats(response.data.data);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
      <DatabaseStats stats={tableStats} />
    </>
  );
};

export default SqlConnectionForm;
