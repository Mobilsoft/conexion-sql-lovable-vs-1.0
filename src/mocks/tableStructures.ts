
import { TableStructure } from "@/types/table-structure";

// Estructura de tabla simulada para cada tabla
export const mockTableStructures: Record<string, TableStructure[]> = {
  'cio_customers': [
    { id: 1, table_name: 'cio_customers', column_name: 'id', data_type: 'integer', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 2, table_name: 'cio_customers', column_name: 'nombre', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 3, table_name: 'cio_customers', column_name: 'apellido', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 9, table_name: 'cio_customers', column_name: 'id_tipo_documento', data_type: 'integer', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 4, table_name: 'cio_customers', column_name: 'numero_documento', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 5, table_name: 'cio_customers', column_name: 'razon_social', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 6, table_name: 'cio_customers', column_name: 'email', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 7, table_name: 'cio_customers', column_name: 'telefono', data_type: 'varchar', is_nullable: false, column_default: null, sql_connection_id: 1 },
    { id: 8, table_name: 'cio_customers', column_name: 'direccion', data_type: 'text', is_nullable: false, column_default: null, sql_connection_id: 1 },
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
