
export interface TableStructure {
  id: number;
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string | null;
  sql_connection_id: number | null;
}

export interface DynamicFormField {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
}
