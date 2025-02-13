
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Database, Server, Lock, User } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { SqlConnectionFormValues } from '@/types/sql-connection';

interface ConnectionFieldsProps {
  form: UseFormReturn<SqlConnectionFormValues>;
}

const ConnectionFields = ({ form }: ConnectionFieldsProps) => {
  return (
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
  );
};

export default ConnectionFields;
