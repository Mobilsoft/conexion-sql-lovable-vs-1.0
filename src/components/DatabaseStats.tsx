
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
import { supabase } from "@/integrations/supabase/client";
import { DynamicFormField, TableStructure } from "@/types/table-structure";

const DatabaseStats = ({ stats, connectionData }: { stats: TableStats[], connectionData: any }) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [formTable, setFormTable] = useState<string | null>(null);
  const [tableFields, setTableFields] = useState<DynamicFormField[]>([]);
  const { toast } = useToast();

  const handleOpenForm = async (tableName: string) => {
    try {
      // Get the structure for the selected table first
      let structureData: TableStructure[];
      
      if (import.meta.env.DEV && connectionData.server === "localhost") {
        // Use mock data in local development
        structureData = mockTableStructures[tableName] || [];
      } else {
        // Call the edge function to get the structure
        const { data: result, error } = await supabase.functions.invoke(
          'sql-server-connection/structure', 
          {
            body: JSON.stringify({
              ...connectionData,
              tableName
            }),
            method: 'POST',
          }
        );

        if (error) throw new Error(error.message);
        if (!result.success) throw new Error(result.error);
        
        structureData = result.data.recordset || [];
      }
      
      // Map the structure to form fields with the correct properties
      const fields: DynamicFormField[] = structureData.map((field: TableStructure) => ({
        name: field.column_name,
        type: getFieldType(field.data_type),
        required: !field.is_nullable,
        defaultValue: field.column_default,
        properties: {
          id: field.id || 0,
          table_name: tableName,
          column_name: field.column_name,
          display_type: field.column_name === 'id_tipo_documento' || 
                        field.column_name === 'id_ciudad' ? 'select' : 
                        field.data_type === 'boolean' ? 'switch' : 'text',
          reference_table: field.column_name === 'id_tipo_documento' ? 'tipos_documento' :
                          field.column_name === 'id_ciudad' ? 'ciudades' : undefined,
          reference_value_field: field.column_name === 'id_tipo_documento' || 
                                field.column_name === 'id_ciudad' ? 'id' : undefined,
          reference_display_field: field.column_name === 'id_tipo_documento' || 
                                  field.column_name === 'id_ciudad' ? 'nombre' : undefined,
          is_required: !field.is_nullable,
          orden: 0,
          estado: true
        }
      }));
      
      // Store the fields and open the form
      setTableFields(fields);
      setFormTable(tableName);
      
    } catch (error: any) {
      console.error('Error loading form structure:', error);
      toast({
        title: "Error",
        description: `No se pudo cargar la estructura de la tabla: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Helper function to map SQL data types to form field types
  const getFieldType = (dataType: string): string => {
    if (dataType.includes('int')) return 'number';
    if (dataType === 'boolean' || dataType === 'bit') return 'boolean';
    if (dataType.includes('date') || dataType.includes('time')) return 'date';
    return 'text';
  };

  const handleSaveForm = async (data: any) => {
    if (!formTable) return;
    
    try {
      console.log('Guardando datos en tabla:', formTable, data);
      
      if (import.meta.env.DEV && connectionData.server === "localhost") {
        // In development, just show a success message
        toast({
          title: "Éxito",
          description: "Datos guardados correctamente (simulado)",
        });
        return;
      }
      
      // Call the edge function to save the data
      const { data: result, error } = await supabase.functions.invoke(
        'sql-server-connection/insertData', 
        {
          body: JSON.stringify({
            ...connectionData,
            tableName: formTable,
            data
          }),
          method: 'POST',
        }
      );

      if (error) throw new Error(error.message);
      if (!result.success) throw new Error(result.error);
      
      toast({
        title: "Éxito",
        description: "Datos guardados correctamente",
      });
      
    } catch (error: any) {
      console.error('Error al guardar:', error);
      toast({
        title: "Error",
        description: error.message || "Error al guardar los datos",
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
        onOpenForm={(tableName) => handleOpenForm(tableName)}
      />

      <TableStructureDialog
        open={!!selectedTable}
        onOpenChange={(open) => !open && setSelectedTable(null)}
        tableName={selectedTable || ''}
        connectionData={connectionData}
      />

      {formTable && (
        <DynamicForm
          open={!!formTable}
          onOpenChange={(open) => !open && setFormTable(null)}
          fields={filterExcludedFields(tableFields).map(field => ({
            ...field,
            type: field.type === 'boolean' ? 'boolean' : field.type
          }))}
          tableName={formTable || ''}
          onSave={handleSaveForm}
        />
      )}
    </Card>
  );
};

export default DatabaseStats;
