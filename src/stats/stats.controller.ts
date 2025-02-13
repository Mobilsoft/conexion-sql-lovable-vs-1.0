
import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsResponse } from '../types/table-stats';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getTableStats(): Promise<StatsResponse> {
    try {
      return Promise.resolve({
        success: true,
        data: this.statsService.getTableStats()
      });
    } catch (error) {
      return Promise.resolve({
        success: false,
        error: error instanceof Error ? error.message : 'Error al obtener estadísticas de tablas'
      });
    }
  }
}
