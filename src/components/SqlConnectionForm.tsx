
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
      server: import.meta.env.VITE_DB_HOST || "localhost",
      port: import.meta.env.VITE_DB_PORT || "5432",
      database: import.meta.env.VITE_DB_NAME || "postgres",
      username: import.meta.env.VITE_DB_USER || "postgres",
      password: import.meta.env.VITE_DB_PASSWORD || "",
      useWindowsAuth: false,
    },
  });

  const onSubmit = async (data: SqlConnectionFormValues) => {
    setIsLoading(true);
    try {
      console.info("Enviando datos de conexión:", data);
      
      // Simular conexión exitosa para desarrollo
      // En producción, esto se conectaría al servicio real
      const mockStats = [
        { table_name: "cio_customers", row_count: 150, size_in_kb: 256.5 },
        { table_name: "cio_products", row_count: 500, size_in_kb: 480.2 },
        { table_name: "cio_sales", row_count: 1200, size_in_kb: 930.8 },
        { table_name: "cio_inventory", row_count: 800, size_in_kb: 540.3 },
        { table_name: "gen_empresas", row_count: 50, size_in_kb: 120.7 },
        { table_name: "gen_usuarios", row_count: 75, size_in_kb: 95.2 }
      ];
      
      setTableStats(mockStats);
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
