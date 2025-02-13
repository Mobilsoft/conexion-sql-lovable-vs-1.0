
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

interface TableStats {
  table_name: string;
  row_count: number;
  size_in_kb: number;
}

interface StatsResponse {
  success: boolean;
  data?: TableStats[];
  error?: string;
}

@Controller('api')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('table-stats')
  async getTableStats(): Promise<StatsResponse> {
    try {
      const data = await this.statsService.getTableStats();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al obtener estadísticas de tablas' 
      };
    }
  }
}
