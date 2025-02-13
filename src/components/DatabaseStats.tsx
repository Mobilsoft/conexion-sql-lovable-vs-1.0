
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Database, FileText, FilePlus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableStructureDialog } from "./TableStructureDialog";
import { DynamicForm } from "./DynamicForm";
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DynamicFormField, TableStructure } from "@/types/table-structure";

interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
  master_detail?: 'M' | 'D';
}

const DatabaseStats = ({ stats, connectionData }: { stats: TableStats[], connectionData: any }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [formTable, setFormTable] = useState<string | null>(null);
  const [generatedForms, setGeneratedForms] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const { data: tableStructure } = useQuery({
    queryKey: ['tableStructure', formTable],
    queryFn: async () => {
      if (!formTable) return null;
      const { data, error } = await supabase
        .from('table_structures')
        .select('*')
        .eq('table_name', formTable);

      if (error) throw error;
      return data as TableStructure[];
    },
    enabled: !!formTable,
  });

  const mapStructureToFields = (structure: TableStructure[]): DynamicFormField[] => {
    return structure.map(field => ({
      name: field.column_name,
      type: field.data_type.includes('int') ? 'number' : 'text',
      required: !field.is_nullable,
      defaultValue: field.column_default,
    }));
  };

  if (!stats?.length) return null;

  const handleFormAction = async (tableName: string) => {
    setFormTable(tableName);
    if (generatedForms.has(tableName)) {
      toast({
        title: "Editar Formulario",
        description: `Editando formulario para la tabla ${tableName}`,
      });
    } else {
      setGeneratedForms(prev => new Set([...prev, tableName]));
      toast({
        title: "Generar Formulario",
        description: `Formulario generado para la tabla ${tableName}`,
      });
    }
  };

  const handleSaveForm = async (data: any) => {
    if (!formTable) return;
    
    // Validar que la tabla existe en el esquema
    const validTables = ['clientes', 'companies', 'sql_connections', 'table_structures', 
                        'task_attachments', 'tasks', 'users', 'task_comments'];
    
    if (!validTables.includes(formTable.toLowerCase())) {
      toast({
        title: "Error",
        description: "Tabla no válida",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from(formTable.toLowerCase() as any)
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Datos guardados correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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
            <TableHead className="text-right">Tipo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => (
            <TableRow key={stat.table_name}>
              <TableCell className="font-medium">{stat.table_name}</TableCell>
              <TableCell className="text-right">{stat.row_count.toLocaleString()}</TableCell>
              <TableCell className="text-right">{stat.size_in_kb.toFixed(2)}</TableCell>
              <TableCell className="text-right">{stat.master_detail === 'M' ? 'Maestro' : 'Detalle'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTable(stat.table_name)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  {stat.master_detail === 'M' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFormAction(stat.table_name)}
                    >
                      {generatedForms.has(stat.table_name) ? (
                        <Edit className="h-4 w-4" />
                      ) : (
                        <FilePlus className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
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
          fields={mapStructureToFields(tableStructure)}
          tableName={formTable || ''}
          onSave={handleSaveForm}
        />
      )}
    </Card>
  );
};

export default DatabaseStats;
