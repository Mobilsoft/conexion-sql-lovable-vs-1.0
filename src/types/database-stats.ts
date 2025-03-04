
export interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
}

export type KnownTables = 
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
