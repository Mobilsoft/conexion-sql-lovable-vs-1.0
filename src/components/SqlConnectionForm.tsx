
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
} from "@/types/sql-connection";
import { supabase } from "@/integrations/supabase/client";

const SqlConnectionForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tableStats, setTableStats] = useState<any>([]);
  const [connectionData, setConnectionData] = useState<any>(null);

  const form = useForm<SqlConnectionFormValues>({
    resolver: zodResolver(sqlConnectionSchema),
    defaultValues: {
      server: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || "5432",
      database: process.env.DB_NAME || "postgres",
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      useWindowsAuth: false,
    },
  });

  const onSubmit = async (data: SqlConnectionFormValues) => {
    setIsLoading(true);
    try {
      // Obtener estadísticas de las tablas usando la función RPC de Supabase
      const { data: stats, error } = await supabase.rpc('get_table_stats');
      
      if (error) throw error;

      setTableStats(stats);
      setConnectionData(data);

      toast({
        title: "Conexión exitosa",
        description: `Se ha establecido la conexión con la base de datos ${data.database}.`,
        duration: 3000,
      });

    } catch (error: any) {
      console.error("Error al conectar:", error);
      toast({
        title: "Error de conexión",
        description: error.message || "No se pudo establecer la conexión con la base de datos.",
        variant: "destructive",
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
