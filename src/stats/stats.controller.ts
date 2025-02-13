
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsResponse, TableStats } from '../types/table-stats';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getTableStats(): Promise<StatsResponse> {
    try {
      const stats: TableStats[] = await this.statsService.getTableStats();
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener estadísticas de tablas'
      };
    }
  }
}
