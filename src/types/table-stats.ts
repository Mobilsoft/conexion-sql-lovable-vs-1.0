
export interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
  master_detail?: 'M' | 'D';
}

export interface StatsResponse {
  success: boolean;
  data?: TableStats[];
  error?: string;
}
