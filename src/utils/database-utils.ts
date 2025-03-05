
import { TableStructure } from "@/types/table-structure";
import { KnownTables } from "@/types/database-stats";

// Función auxiliar para validar tablas conocidas
export const isKnownTable = (table: string): table is KnownTables => {
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
export const filterExcludedFields = (fields: TableStructure[]): TableStructure[] => {
  return fields.filter(field => 
    field.column_name !== 'id' && 
    field.column_name !== 'master_detail' && 
    field.column_name !== 'fecha_creacion' && 
    field.column_name !== 'fecha_actualizacion'
  );
};
