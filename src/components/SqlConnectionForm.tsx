import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Database, Server, Lock, User } from 'lucide-react';
import DatabaseStats from './DatabaseStats';

const formSchema = z.object({
  server: z.string().min(1, 'El servidor es requerido'),
  port: z.string().regex(/^\d+$/, 'El puerto debe ser numérico'),
  database: z.string().min(1, 'La base de datos es requerida'),
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
  useWindowsAuth: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const SqlConnectionForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tableStats, setTableStats] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      server: '145.223.75.189',
      port: '1433',
      database: 'Taskmaster',
      username: 'sa',
      password: 'D3v3l0p3r2024$',
      useWindowsAuth: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const { error: saveError } = await supabase
        .from('sql_connections')
        .upsert([{
          id: 1,
          server: data.server,
          port: data.port,
          database: data.database,
          username: data.username,
          password: data.password,
          use_windows_auth: data.useWindowsAuth,
          last_connected: new Date().toISOString()
        }]);

      if (saveError) throw saveError;

      const { data: stats, error } = await supabase.functions.invoke('sql-server-connection', {
        body: { action: 'getTableStats' }
      });

      if (error) throw error;

      setTableStats(stats);

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
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-center">Configuración de Conexión</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              Ingrese los datos de conexión al servidor SQL Server
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="server"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Servidor
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ejemplo.database.windows.net" 
                          className="bg-white dark:bg-slate-900"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Server className="h-4 w-4" />
                        Puerto
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="1433" 
                          className="bg-white dark:bg-slate-900"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="database"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Base de datos
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="nombreBaseDatos" 
                          className="bg-white dark:bg-slate-900"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useWindowsAuth"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Autenticación Windows
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!form.watch('useWindowsAuth') && (
                  <>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Usuario
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="usuario" 
                              className="bg-white dark:bg-slate-900"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Contraseña
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="bg-white dark:bg-slate-900"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

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
