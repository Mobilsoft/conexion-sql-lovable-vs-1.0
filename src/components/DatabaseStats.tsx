
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
import { DynamicFormField, TableStructure } from "@/types/table-structure";

interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
}

type KnownTables = 
  | 'cio_customers' 
  | 'cio_products' 
  | 'cio_product_categories' 
  | 'cio_brands' 
  | 'cio_sales' 
  | 'cio_sale_details' 
  | 'cio_inventory' 
  | 'gen_empresas' 
  | 'gen_usuarios' 
  | 'table_structures';

// Estructura de tabla simulada para cada tabla
const mockTableStructures: Record<string, TableStructure[]> = {
  'cio_customers': [
    { id: 1, table_name: 'cio_customers', column_name: 'id', data_type: 'integer', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 2, table_name: 'cio_customers', column_name: 'nombre', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 3, table_name: 'cio_customers', column_name: 'apellido', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 4, table_name: 'cio_customers', column_name: 'numero_documento', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 5, table_name: 'cio_customers', column_name: 'razon_social', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 6, table_name: 'cio_customers', column_name: 'email', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 7, table_name: 'cio_customers', column_name: 'telefono', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 8, table_name: 'cio_customers', column_name: 'direccion', data_type: 'text', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 9, table_name: 'cio_customers', column_name: 'id_tipo_documento', data_type: 'integer', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 10, table_name: 'cio_customers', column_name: 'id_ciudad', data_type: 'integer', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 11, table_name: 'cio_customers', column_name: 'master_detail', data_type: 'character', is_nullable: true, column_default: "'M'::bpchar", sql_connection_id: 1 },
    { id: 12, table_name: 'cio_customers', column_name: 'fecha_creacion', data_type: 'timestamp', is_nullable: true, column_default: "CURRENT_TIMESTAMP", sql_connection_id: 1 },
    { id: 13, table_name: 'cio_customers', column_name: 'fecha_actualizacion', data_type: 'timestamp', is_nullable: true, column_default: "CURRENT_TIMESTAMP", sql_connection_id: 1 }
  ],
  'cio_products': [
    { id: 14, table_name: 'cio_products', column_name: 'id', data_type: 'integer', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 15, table_name: 'cio_products', column_name: 'nombre', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 16, table_name: 'cio_products', column_name: 'codigo', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 17, table_name: 'cio_products', column_name: 'precio_venta', data_type: 'numeric', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 18, table_name: 'cio_products', column_name: 'id_categoria', data_type: 'integer', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 19, table_name: 'cio_products', column_name: 'master_detail', data_type: 'character', is_nullable: true, column_default: "'M'::bpchar", sql_connection_id: 1 },
    { id: 20, table_name: 'cio_products', column_name: 'fecha_creacion', data_type: 'timestamp', is_nullable: true, column_default: "CURRENT_TIMESTAMP", sql_connection_id: 1 },
    { id: 21, table_name: 'cio_products', column_name: 'fecha_actualizacion', data_type: 'timestamp', is_nullable: true, column_default: "CURRENT_TIMESTAMP", sql_connection_id: 1 }
  ]
};

const DatabaseStats = ({ stats, connectionData }: { stats: any[], connectionData: any }) => {
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

  // Función auxiliar para validar tablas conocidas
  const isKnownTable = (table: string): table is KnownTables => {
    const knownTables = [
      'cio_customers',
      'cio_products',
      'cio_product_categories',
      'cio_brands',
      'cio_sales',
      'cio_sale_details',
      'cio_inventory',
      'gen_empresas',
      'gen_usuarios',
      'table_structures'
    ];
    return knownTables.includes(table);
  };

  // Función para filtrar campos excluidos
  const filterExcludedFields = (fields: TableStructure[]): TableStructure[] => {
    return fields.filter(field => 
      field.column_name !== 'id' && 
      field.column_name !== 'master_detail' && 
      field.column_name !== 'fecha_creacion' && 
      field.column_name !== 'fecha_actualizacion'
    );
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
          {(stats || []).map((stat) => (
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
