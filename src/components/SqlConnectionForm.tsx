
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FormHeader from "./sql/FormHeader";
import ConnectionFields from "./sql/ConnectionFields";
import DatabaseStats from "./DatabaseStats";
import {
  sqlConnectionSchema,
  type SqlConnectionFormValues,
  type TableStats,
} from "@/types/sql-connection";
import { supabase } from "@/integrations/supabase/client";

const SqlConnectionForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tableStats, setTableStats] = useState<TableStats[]>([]);
  const [connectionData, setConnectionData] = useState<SqlConnectionFormValues | null>(null);

  const form = useForm<SqlConnectionFormValues>({
    resolver: zodResolver(sqlConnectionSchema),
    defaultValues: {
      server: import.meta.env.VITE_DB_HOST || "localhost",
      port: import.meta.env.VITE_DB_PORT || "1433",
      database: import.meta.env.VITE_DB_NAME || "Mobilpos",
      username: import.meta.env.VITE_DB_USER || "sa",
      password: import.meta.env.VITE_DB_PASSWORD || "",
      useWindowsAuth: false,
    },
  });

  const onSubmit = async (data: SqlConnectionFormValues) => {
    setIsLoading(true);
    try {
      console.info("Enviando datos de conexión:", {
        server: data.server,
        port: data.port,
        database: data.database,
        username: data.username,
        useWindowsAuth: data.useWindowsAuth,
        // No mostramos la contraseña por seguridad
      });
      
      // Intentar conectar al servidor SQL
      console.log("Intentando conexión con SQL Server:", data.server);
      const { data: connectionResult, error } = await supabase.functions.invoke(
        'sql-server-connection/connect', 
        {
          body: JSON.stringify(data),
          method: 'POST',
        }
      );

      if (error) {
        console.error("Error en la función Edge:", error);
        throw new Error(`Error en la petición: ${error.message}`);
      }
      
      if (!connectionResult.success) {
        console.error("La conexión falló:", connectionResult.error);
        throw new Error(connectionResult.error);
      }

      console.log("Resultado de la conexión:", connectionResult);
      
      // Formatear los resultados de estadísticas de tablas
      let formattedStats: TableStats[] = [];
      
      if (connectionResult.data && connectionResult.data.recordset) {
        formattedStats = connectionResult.data.recordset.map((item: any) => ({
          table_name: item.table_name,
          row_count: typeof item.row_count === 'string' ? parseInt(item.row_count, 10) : item.row_count,
          size_in_kb: typeof item.size_in_kb === 'number' ? item.size_in_kb : 0
        }));
      }
      
      setTableStats(formattedStats);
      setConnectionData(data);

      toast({
        title: "Conexión exitosa",
        description: `Se ha establecido la conexión con la base de datos ${data.database} en ${data.server}.`,
        duration: 3000,
      });

    } catch (error: any) {
      console.error("Error al conectar:", error);
      toast({
        title: "Error de conexión",
        description: error.message || "No se pudo establecer la conexión con la base de datos.",
        variant: "destructive",
        duration: 5000,
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
                {isLoading ? "Conectando..." : "Conectar"}
              </Button>
            </div>
          </form>
        </Form>
      </motion.div>
    </Card>
  );
};

export default SqlConnectionForm;
