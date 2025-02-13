
export interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
}

export interface StatsResponse {
  success: boolean;
  data?: TableStats[] | Promise<TableStats[]>;
  error?: string;
}
