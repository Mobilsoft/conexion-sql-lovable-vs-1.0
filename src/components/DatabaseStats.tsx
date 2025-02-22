
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Database, FileText, FormInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableStructureDialog } from "./TableStructureDialog";
import { DynamicForm } from "./DynamicForm";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DynamicFormField, TableStructure } from "@/types/table-structure";

interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
}

type KnownTables = 'gen_empresas' | 'gen_usuarios' | 'table_structures';

const DatabaseStats = ({ stats, connectionData }: { stats: any[], connectionData: any }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [formTable, setFormTable] = useState<string | null>(null);
  const { toast } = useToast();

  // Obtenemos las estadísticas de las tablas usando la función get_table_stats
  const { data: tableStats } = useQuery({
    queryKey: ['tableStats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_table_stats');
      if (error) throw error;
      return data as TableStats[];
    },
  });

  const { data: tableStructure } = useQuery({
    queryKey: ['tableStructure', formTable],
    queryFn: async () => {
      if (!formTable) return null;
      
      const { data, error } = await supabase
        .from('table_structures')
        .select('*')
        .eq('table_name', formTable)
        .order('id');

      if (error) throw error;
      return data as TableStructure[];
    },
    enabled: !!formTable,
  });

  const handleSaveForm = async (data: any) => {
    if (!formTable) return;
    
    try {
      // Validamos que la tabla sea una de las conocidas
      if (!isKnownTable(formTable)) {
        throw new Error('Tabla no soportada para inserción');
      }

      const { error } = await supabase
        .from(formTable)
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Datos guardados correctamente",
      });
      
    } catch (error: any) {
      console.error('Error al guardar:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Función auxiliar para validar tablas conocidas
  const isKnownTable = (table: string): table is KnownTables => {
    const knownTables = ['gen_empresas', 'gen_usuarios', 'table_structures'];
    return knownTables.includes(table);
  };

  return (
    <Card className="w-full max-w-2xl p-6 mt-8 bg-white/90 dark:bg-slate-900/90 border-0 shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Database className="h-6 w-6" />
          Estadísticas de la Base de Datos
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tabla</TableHead>
            <TableHead className="text-right">Registros</TableHead>
            <TableHead className="text-right">Tamaño (KB)</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(tableStats || []).map((stat) => (
            <TableRow key={stat.table_name}>
              <TableCell className="font-medium">{stat.table_name}</TableCell>
              <TableCell className="text-right">{stat.row_count.toLocaleString()}</TableCell>
              <TableCell className="text-right">{stat.size_in_kb.toFixed(2)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTable(stat.table_name)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFormTable(stat.table_name)}
                >
                  <FormInput className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TableStructureDialog
        open={!!selectedTable}
        onOpenChange={(open) => !open && setSelectedTable(null)}
        tableName={selectedTable || ''}
        connectionData={connectionData}
      />

      {tableStructure && (
        <DynamicForm
          open={!!formTable}
          onOpenChange={(open) => !open && setFormTable(null)}
          fields={tableStructure.map(field => ({
            name: field.column_name,
            type: field.data_type.includes('int') ? 'number' : 'text',
            required: !field.is_nullable,
            defaultValue: field.column_default,
          }))}
          tableName={formTable || ''}
          onSave={handleSaveForm}
        />
      )}
    </Card>
  );
};

export default DatabaseStats;
