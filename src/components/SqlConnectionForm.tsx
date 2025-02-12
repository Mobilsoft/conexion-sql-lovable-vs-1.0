
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      server: '',
      port: '1433',
      database: '',
      username: '',
      password: '',
      useWindowsAuth: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Aquí iría la lógica de conexión al servidor
      console.log('Datos de conexión:', data);
      toast({
        title: 'Conexión exitosa',
        description: 'Se ha establecido la conexión con el servidor SQL.',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error de conexión',
        description: 'No se pudo establecer la conexión con el servidor SQL.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Conexión SQL Server</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ingrese los datos de conexión al servidor
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="server"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servidor</FormLabel>
                  <FormControl>
                    <Input placeholder="ejemplo.database.windows.net" {...field} />
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
                  <FormLabel>Puerto</FormLabel>
                  <FormControl>
                    <Input placeholder="1433" {...field} />
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
                  <FormLabel>Base de datos</FormLabel>
                  <FormControl>
                    <Input placeholder="nombreBaseDatos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useWindowsAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Autenticación Windows</FormLabel>
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
                      <FormLabel>Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="usuario" {...field} />
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
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Conectando...' : 'Conectar'}
            </Button>
          </form>
        </Form>
      </motion.div>
    </Card>
  );
};

export default SqlConnectionForm;
