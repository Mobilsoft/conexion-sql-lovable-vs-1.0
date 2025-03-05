
import { Card } from "@/components/ui/card";
import { Database } from "lucide-react";
import { TableStructureDialog } from "./TableStructureDialog";
import { DynamicForm } from "./DynamicForm";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DatabaseStatsTable } from "./database/DatabaseStatsTable";
import { TableStats } from "@/types/database-stats";
import { mockTableStructures } from "@/mocks/tableStructures";
import { filterExcludedFields } from "@/utils/database-utils";

const DatabaseStats = ({ stats, connectionData }: { stats: TableStats[], connectionData: any }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [formTable, setFormTable] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveForm = async (data: any) => {
    if (!formTable) return;
    
    try {
      // Simular guardado exitoso
      console.log('Guardando datos:', data);
      
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

  return (
    <Card className="w-full max-w-2xl p-6 mt-8 bg-white/90 dark:bg-slate-900/90 border-0 shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold flex items-center gap-2">
          <Database className="h-6 w-6" />
          Estadísticas de la Base de Datos
        </h3>
      </div>
      
      <DatabaseStatsTable
        stats={stats}
        onViewStructure={(tableName) => setSelectedTable(tableName)}
        onOpenForm={(tableName) => setFormTable(tableName)}
      />

      <TableStructureDialog
        open={!!selectedTable}
        onOpenChange={(open) => !open && setSelectedTable(null)}
        tableName={selectedTable || ''}
        connectionData={connectionData}
      />

      {formTable && mockTableStructures[formTable] && (
        <DynamicForm
          open={!!formTable}
          onOpenChange={(open) => !open && setFormTable(null)}
          fields={filterExcludedFields(mockTableStructures[formTable]).map(field => ({
            name: field.column_name,
            type: field.data_type.includes('int') ? 'number' : 'text',
            required: !field.is_nullable,
            defaultValue: field.column_default,
            properties: {
              id: field.id,
              table_name: field.table_name,
              column_name: field.column_name,
              display_type: field.column_name === 'id_tipo_documento' || field.column_name === 'id_ciudad' ? 'select' : 
                            field.data_type === 'boolean' ? 'switch' : 'text',
              reference_table: field.column_name === 'id_tipo_documento' ? 'tipos_documento' :
                              field.column_name === 'id_ciudad' ? 'ciudades' : undefined,
              reference_value_field: field.column_name === 'id_tipo_documento' || field.column_name === 'id_ciudad' ? 'id' : undefined,
              reference_display_field: field.column_name === 'id_tipo_documento' || field.column_name === 'id_ciudad' ? 'nombre' : undefined,
              is_required: !field.is_nullable,
              orden: field.id,
              estado: true
            }
          }))}
          tableName={formTable || ''}
          onSave={handleSaveForm}
        />
      )}
    </Card>
  );
};

export default DatabaseStats;
