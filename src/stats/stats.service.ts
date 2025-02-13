
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TableStats } from '../types/table-stats';

@Injectable()
export class StatsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getTableStats(): Promise<TableStats[]> {
    const sql = `
      SELECT 
        t.name AS table_name,
        p.rows AS row_count,
        (SUM(a.used_pages) * 8.0 / 1024) AS size_in_kb
      FROM sys.tables t
      INNER JOIN sys.indexes i ON t.object_id = i.object_id
      INNER JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
      INNER JOIN sys.allocation_units a ON p.partition_id = a.container_id
      GROUP BY t.name, p.rows
      ORDER BY t.name;
    `;
    
    return this.databaseService.executeQuery<TableStats>(sql);
  }
}
